'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { H3 } from '@/components/ui/typography';
import { CirclePlusIcon, DeleteIcon, Loader2Icon, RocketIcon } from 'lucide-react';
import { useFirestore } from '@/hooks/use-firestore';
import { useInvoiceStore } from '@/store/use-invoice';
import { useEffect, useState } from 'react';
import { InvoiceData, ProfileData, AdditionalCharge } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { PrefixedInput } from '@/components/prefixed-input';
import { useUserStore } from '@/store/use-user';
import { useTemplateStore } from '@/store/use-templates';
import { useProfileStore } from '@/store/use-profile';
import { useToast } from '@/hooks/use-toast';
import { Document, pdf } from '@react-pdf/renderer';
import templates, { TemplateKey } from '@/templates';
import { IconButton } from '@/components/ui/icon-button';
import { generateInvoiceRef } from '@/lib/utils';

export default function FormView() {
	const { addInvoice, loading, incrementExportCount } = useFirestore();
	const { invoiceData, updateInvoiceData, updateBilledToData, updateRef, resetInvoiceData } = useInvoiceStore();
	const [exporting, setExporting] = useState(false);
	const { userData } = useUserStore();
	const { selectedTemplate, selectedPageSize } = useTemplateStore();
	const { profile } = useProfileStore();
	const { toast } = useToast();

	// Generate invoice ref when component mounts and profile is available
	useEffect(() => {
		if (profile?.name && (!invoiceData.ref || invoiceData.ref.trim() === '')) {
			const newRef = generateInvoiceRef(profile.name);
			updateRef(newRef);
		}
	}, [profile?.name, invoiceData.ref, updateRef]);

	const formSchema = z.object({
		name: z.string().min(3, { message: 'Recipient should be at least 3 characters long.' }),
		address: z
			.union([z.string().min(3, { message: 'Address should be at least 3 characters long.' }), z.string().length(0)])
			.optional()
			.transform((e) => (e === '' ? undefined : e)),
		email: z
			.union([z.string().email({ message: 'Invalid email address' }), z.string().length(0)])
			.optional()
			.transform((e) => (e === '' ? undefined : e)),
		phone: z
			.union([
				z.string().min(7, { message: 'Phone number should be at least 7 characters long.' }).max(15, { message: 'Phone number should be at most 15 characters long.' }),
				z.string().length(0),
			])
			.optional()
			.transform((e) => (e === '' ? undefined : e)),
		items: z
			.array(
				z.object({
					description: z.string({ required_error: 'Description is required' }).min(1, { message: 'Description is required' }),
					quantity: z.number({ required_error: 'Quantity is required', invalid_type_error: 'Quantity is required' }).min(0, 'Quantity must be at least 0'),
					amount: z.number({ required_error: 'Amount is required', invalid_type_error: 'Unit price is required' }).min(0, 'Amount must be at least 0'),
				})
			)
			.min(1, { message: 'At least one item is required' }),
		additionalCharges: z
			.array(
				z.object({
					description: z.string().min(1, { message: 'Description is required' }),
					amount: z.number().min(0, 'Amount must be at least 0'),
					type: z.enum(['income', 'expense']),
				})
			)
			.optional(),
		discount: z
			.union([z.number().min(0).max(100, { message: 'Discount must be between 0 and 100' }), z.string().length(0)])
			.optional()
			.transform((e) => (e === '' ? undefined : e)),
		tax: z
			.union([z.number().min(0).max(100, { message: 'Tax must be between 0 and 100' }), z.string().length(0)])
			.optional()
			.transform((e) => (e === '' ? undefined : e)),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: invoiceData.billedTo.name ?? '',
			address: invoiceData.billedTo.address?.join(', '),
			email: invoiceData.billedTo.email ?? '',
			phone: invoiceData.billedTo.phone ?? '',
			items: invoiceData.items?.map((item) => ({
				description: item?.description ?? '',
				quantity: item?.quantity ?? 0,
				amount: item?.amount ?? 0,
			})) ?? [{ description: '', quantity: 0, amount: 0 }],
			additionalCharges: invoiceData.additionalCharges ?? [],
			discount: invoiceData.discount ?? 0,
			tax: invoiceData.tax ?? 0,
		},
	});

	// Sync form changes to Zustand
	useEffect(() => {
		const subscription = form.watch((values) => {
			updateBilledToData({
				name: values.name,
				address: values.address ? values.address.split(', ') : [''],
				email: values.email,
				phone: values.phone,
			});
			updateInvoiceData({
				items: values.items as InvoiceData['items'],
				additionalCharges: values.additionalCharges as AdditionalCharge[],
				discount: values.discount as number,
				tax: values.tax as number,
			});
		});

		return () => subscription.unsubscribe();
	}, [form, updateInvoiceData, updateBilledToData]);

	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });
	const { fields: chargeFields, append: appendCharge, remove: removeCharge } = useFieldArray({ control: form.control, name: 'additionalCharges' });

	const addNewItem = () => {
		append({ description: '', quantity: '' as unknown as number, amount: '' as unknown as number });
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const subtotal = values.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.amount || 0), 0);
			const afterTax = subtotal + (subtotal * ((values.tax as number) ?? 0)) / 100;
			const afterDiscount = afterTax - (afterTax * ((values.discount as number) ?? 0)) / 100;
			const additionalChargesTotal = values.additionalCharges?.reduce((sum, charge) => sum + charge.amount, 0) || 0;
			const total = parseFloat((afterDiscount + additionalChargesTotal).toFixed(2));
			const formattedAddress = values.address ? values.address.split(', ') : [''];

			const formData = {
				billedTo: {
					name: values.name,
					address: formattedAddress ?? [''],
					email: values.email ?? '',
					phone: values.phone ?? '',
				},
				items: values.items,
				additionalCharges: values.additionalCharges || [],
				discount: (values.discount as number) ?? 0,
				tax: (values.tax as number) ?? 0,
				total: total,
			};
			await addInvoice(formData);
		} catch (error) {
			console.error(error);
		}
	}

	const invoicePayload = {
		data: invoiceData,
		profile: profile as ProfileData,
	};

	const handleExportPDF = async () => {
		setExporting(true);
		try {
			const canExport = await incrementExportCount();
			if (!canExport) return;

			const SelectedRenderer = templates[selectedTemplate as TemplateKey].render;
			const pdfDoc = <Document title="Invoice">{SelectedRenderer({ ...invoicePayload, pageSize: selectedPageSize })}</Document>;

			const blob = await pdf(pdfDoc).toBlob();

			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			const recipientName = invoiceData.billedTo.name || 'Unknown';
			const invoiceRef = invoiceData.ref || 'INV';
			link.download = `${recipientName} - ${invoiceRef}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
			toast({
				variant: 'default',
				title: 'Invoice ready to share!',
				description: `Your invoice has been exported successfully as PDF!`,
			});
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An error occurred.',
				description: `Couldn't export to PDF. Please try again.`,
			});
			console.error(error);
		} finally {
			setExporting(false);
		}
	};

	return (
		<PageWrapper>
			<Section className='mx-auto max-w-screen-sm'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-16'>
						{/* Invoice Reference */}
						<div className='space-y-4'>
							<div className='flex items-center gap-2'>
								<H3>Invoice Reference</H3>
								<span className='text-sm text-muted-foreground'>(Auto-generated)</span>
							</div>
							<div className='text-lg font-mono font-bold text-primary'>
								{invoiceData.ref || 'Generating...'}
							</div>
						</div>

						{/* Recepient */}
						<div className='space-y-8'>
							<H3 className='mb-6'>Recepient Information</H3>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Recepient</FormLabel>
										<FormControl>
											<Input placeholder='Customer Name' {...field} value={field.value ?? ''} />
										</FormControl>
										<FormDescription>This is the name for the recepient of the invoice. First name and last name is recommended.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='address'
								render={({ field }) => (
									<FormItem>
										<FormLabel>(Optional) Recepient Address</FormLabel>
										<FormControl>
											<Textarea placeholder='Customer Address' {...field} value={field.value ?? ''} />
										</FormControl>
										<FormDescription>This is the physical address for the recepient of the invoice. Use commas to separate the parts of the address.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>(Optional) Recepient Email</FormLabel>
										<FormControl>
											<Input placeholder='Customer Email' {...field} value={field.value ?? ''} />
										</FormControl>
										<FormDescription>This is the email address for the recepient of the invoice.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='phone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>(Optional) Recepient Phone</FormLabel>
										<FormControl>
											<Input placeholder='Customer Phone' {...field} value={field.value ?? ''} />
										</FormControl>
										<FormDescription>This is the contact number for the recepient of the invoice.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Items */}
						<div className='space-y-4'>
							<H3 className='mb-6'>Invoice Items</H3>
							{fields.map((field, index) => (
								<div key={field.id}>
									<div key={field.id} className='grid grid-cols-2 gap-4 lg:grid-cols-[4fr_1fr_2fr_auto_auto]'>
										<FormField
											control={form.control}
											name={`items.${index}.description`}
											render={({ field }) => (
												<FormItem className='col-span-2 lg:col-span-1'>
													<FormControl>
														<Input placeholder='Description' {...field} value={field.value ?? ''} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`items.${index}.quantity`}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															type='number'
															placeholder='Qty'
															{...field}
															value={field.value ?? ''}
															onChange={(e) => field.onChange(e.target.value ? +e.target.value : 0)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`items.${index}.amount`}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<PrefixedInput
															prefix={userData?.currency ?? 'LKR'}
															type='number'
															placeholder='Unit Price'
															step={0.01}
															{...field}
															value={field.value ?? ''}
															onChange={(e) => field.onChange(e.target.value ? +e.target.value : 0)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<span className='flex h-10 items-center gap-2'>
											<span className='text-muted-foreground'>{userData?.currency ?? 'LKR'}</span>
											<span>{((invoiceData.items[index]?.quantity ?? 0) * (invoiceData.items[index]?.amount ?? 0)).toFixed(2)}</span>
										</span>
										<Button type='button' variant='outline' className='col-start-2 lg:col-start-auto' onClick={() => remove(index)}>
											<DeleteIcon className='size-5' />
										</Button>
									</div>
								</div>
							))}

							<div>
								<IconButton type='button' icon={<CirclePlusIcon />} variant='outline' onClick={addNewItem}>
									Add Item
								</IconButton>
							</div>
						</div>

						<div>
							<H3 className='mb-6'>Taxes and Discounts</H3>
							<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4'>
								<FormField
									control={form.control}
									name='tax'
									render={({ field }) => (
										<FormItem>
											<FormLabel>(Optional) Tax</FormLabel>
											<FormControl>
												<Input
													type='number'
													placeholder='Tax (%)'
													{...field}
													value={field.value ?? ''}
													onChange={(e) => field.onChange(e.target.value ? +e.target.value : 0)}
												/>
											</FormControl>
											<FormDescription>This is the tax for the invoice. Only add if applicable.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='discount'
									render={({ field }) => (
										<FormItem>
											<FormLabel>(Optional) Discount</FormLabel>
											<FormControl>
												<Input
													type='number'
													placeholder='Discount (%)'
													{...field}
													value={field.value ?? ''}
													onChange={(e) => field.onChange(e.target.value ? +e.target.value : 0)}
												/>
											</FormControl>
											<FormDescription>This is the discount for the invoice.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Additional Charges */}
						<div className='space-y-4'>
							<H3 className='mb-6'>Additional Charges</H3>
							{chargeFields.map((field, index) => (
								<div key={field.id}>
									<div key={field.id} className='grid grid-cols-2 gap-4 lg:grid-cols-[4fr_2fr_1fr_auto]'>
										<FormField
											control={form.control}
											name={`additionalCharges.${index}.description`}
											render={({ field }) => (
												<FormItem className='col-span-2 lg:col-span-1'>
													<FormControl>
														<Input placeholder='Description (e.g., Courier charges)' {...field} value={field.value ?? ''} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`additionalCharges.${index}.amount`}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<PrefixedInput
															prefix={userData?.currency ?? 'LKR'}
															type='number'
															placeholder='Amount'
															step={0.01}
															{...field}
															value={field.value ?? ''}
															onChange={(e) => field.onChange(e.target.value ? +e.target.value : 0)}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`additionalCharges.${index}.type`}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<select 
															{...field} 
															value={field.value ?? 'expense'}
															onChange={(e) => field.onChange(e.target.value)}
															className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
														>
															<option value='income'>Income</option>
															<option value='expense'>Expense</option>
														</select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button type='button' variant='outline' onClick={() => removeCharge(index)}>
											<DeleteIcon className='size-5' />
										</Button>
									</div>
								</div>
							))}

							<div>
								<IconButton type='button' icon={<CirclePlusIcon />} variant='outline' onClick={() => appendCharge({ description: '', amount: 0, type: 'expense' })}>
									Add Charge
								</IconButton>
							</div>
						</div>

						<div className='space-y-2'>
							<div className='flex justify-between'>
								<span className='font-medium'>Subtotal:</span>
								<span>
									{userData?.currency ?? 'USD'} {invoiceData.items.reduce((acc, item) => acc + (item.quantity ?? 0) * (item.amount ?? 0), 0).toFixed(2)}
								</span>
							</div>
							{(() => {
								const discountValue = form.watch('discount');
								const discount = typeof discountValue === 'string' ? parseFloat(discountValue) || 0 : discountValue || 0;
								if (discount > 0) {
									const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity ?? 0) * (item.amount ?? 0), 0);
									const discountAmount = subtotal * discount / 100;
									const subtotalAfterDiscount = subtotal - discountAmount;
									return (
										<>
											<div className='flex justify-between text-sm text-muted-foreground'>
												<span>Discount ({discount}%):</span>
												<span>
													-{userData?.currency ?? 'USD'} {discountAmount.toFixed(2)}
												</span>
											</div>
											<div className='flex justify-between border-t pt-2 mt-2'>
												<span className='font-medium'>Subtotal After Discount:</span>
												<span className='font-medium'>
													{userData?.currency ?? 'USD'} {subtotalAfterDiscount.toFixed(2)}
												</span>
											</div>
										</>
									);
								}
								return null;
							})()}
							{(() => {
								const taxValue = form.watch('tax');
								const tax = typeof taxValue === 'string' ? parseFloat(taxValue) || 0 : taxValue || 0;
								if (tax > 0) {
									const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity ?? 0) * (item.amount ?? 0), 0);
									const discountValue = form.watch('discount');
									const discount = typeof discountValue === 'string' ? parseFloat(discountValue) || 0 : discountValue || 0;
									const discountAmount = subtotal * discount / 100;
									const subtotalAfterDiscount = subtotal - discountAmount;
									const taxAmount = subtotalAfterDiscount * tax / 100;
									const itemsTotal = subtotalAfterDiscount + taxAmount;
									return (
										<>
											<div className='flex justify-between text-sm text-muted-foreground'>
												<span>Tax ({tax}%):</span>
												<span>
													{userData?.currency ?? 'USD'} {taxAmount.toFixed(2)}
												</span>
											</div>
											<div className='flex justify-between border-t pt-2 mt-2'>
												<span className='font-semibold'>Items Total:</span>
												<span className='font-semibold'>
													{userData?.currency ?? 'USD'} {itemsTotal.toFixed(2)}
												</span>
											</div>
										</>
									);
								}
								return null;
							})()}
							{(() => {
								const additionalCharges = invoiceData.additionalCharges || [];
								if (additionalCharges.length > 0) {
									const additionalChargesTotal = additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
									return (
										<>
											<div className='mt-4 pt-4 border-t'>
												<div className='font-medium mb-2'>Additional Charges</div>
												<div className='border-b pb-2 mb-2'>
													<div className='border-b pb-2 mb-2'></div>
													{additionalCharges.map((charge, index) => (
														<div key={index} className='flex justify-between text-sm text-muted-foreground'>
															<span>{charge.description}:</span>
															<span>
																{userData?.currency ?? 'USD'} {charge.amount.toFixed(2)}
															</span>
														</div>
													))}
													<div className='border-t pt-2 mt-2'>
														<div className='flex justify-between font-medium'>
															<span>Additional Charges Total:</span>
															<span>
																{userData?.currency ?? 'USD'} {additionalChargesTotal.toFixed(2)}
															</span>
														</div>
													</div>
												</div>
											</div>
										</>
									);
								}
								return null;
							})()}
							<div className='flex justify-between border-t pt-2 mt-4'>
								<span className='font-bold text-lg'>Grand Total:</span>
								<span className='font-bold text-lg'>
									{userData?.currency ?? 'USD'} {(() => {
										const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity ?? 0) * (item.amount ?? 0), 0);
										const taxValue = form.watch('tax');
										const discountValue = form.watch('discount');
										const tax = typeof taxValue === 'string' ? parseFloat(taxValue) || 0 : taxValue || 0;
										const discount = typeof discountValue === 'string' ? parseFloat(discountValue) || 0 : discountValue || 0;
										const discountAmount = subtotal * discount / 100;
										const subtotalAfterDiscount = subtotal - discountAmount;
										const taxAmount = subtotalAfterDiscount * tax / 100;
										const itemsTotal = subtotalAfterDiscount + taxAmount;
										const additionalChargesTotal = (invoiceData.additionalCharges || []).reduce((sum, charge) => sum + charge.amount, 0);
										const grandTotal = itemsTotal + additionalChargesTotal;
										return grandTotal.toFixed(2);
									})()}
								</span>
							</div>
						</div>

						<div className='flex flex-col items-center gap-4 md:flex-row'>
							<IconButton type='submit' size='lg' icon={loading ? <Loader2Icon className='animate-spin' /> : <RocketIcon />} disabled={loading}>
								Create Invoice
							</IconButton>

							<Button className='flex items-center gap-2' type='button' size='lg' variant='ghost' onClick={() => handleExportPDF()} disabled={exporting}>
								{exporting && <Loader2Icon className='animate-spin' />}
								Download as PDF
							</Button>

							<Button
								type='button'
								size='lg'
								variant='ghost'
								onClick={() => {
									form.reset();
									resetInvoiceData();
								}}>
								Reset Form
							</Button>
						</div>
					</form>
				</Form>
			</Section>
		</PageWrapper>
	);
}
