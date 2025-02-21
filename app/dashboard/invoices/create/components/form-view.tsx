'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { H3 } from '@/components/ui/typography';
import { CirclePlusIcon, DeleteIcon, DownloadIcon, RocketIcon, UndoDotIcon } from 'lucide-react';
import { useFirestore } from '@/hooks/use-firestore';
import { useInvoiceStore } from '@/store/use-invoice';
import { useEffect } from 'react';
import { InvoiceData, ProfileData } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { PrefixedInput } from '@/components/prefixed-input';
import { useUserStore } from '@/store/use-user';
import { useTemplateStore } from '@/store/use-templates';
import { useProfileStore } from '@/store/use-profile';
import { useToast } from '@/hooks/use-toast';
import { Document, pdf } from '@react-pdf/renderer';
import templates, { TemplateKey } from '@/templates';

export default function FormView() {
	const { addInvoice } = useFirestore();
	const { invoiceData, updateInvoiceData, updateBilledToData, resetInvoiceData } = useInvoiceStore();
	const { userData } = useUserStore();
	const { selectedTemplate } = useTemplateStore();
	const { profile } = useProfileStore();
	const { toast } = useToast();

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
				discount: values.discount as number,
				tax: values.tax as number,
			});
		});

		return () => subscription.unsubscribe();
	}, [form.watch, updateInvoiceData, updateBilledToData]);

	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });

	const addNewItem = () => {
		append({ description: '', quantity: '' as unknown as number, amount: '' as unknown as number });
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const subtotal = values.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.amount || 0), 0);
			const afterTax = subtotal + (subtotal * ((values.tax as number) ?? 0)) / 100;
			const total = parseFloat((afterTax - (afterTax * ((values.discount as number) ?? 0)) / 100).toFixed(2));
			const formattedAddress = values.address ? values.address.split(', ') : [''];

			const formData = {
				billedTo: {
					name: values.name,
					address: formattedAddress ?? [''],
					email: values.email ?? '',
					phone: values.phone ?? '',
				},
				items: values.items,
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
		try {
			const SelectedRenderer = templates[selectedTemplate as TemplateKey].render;
			const pdfDoc = <Document>{SelectedRenderer(invoicePayload)}</Document>;

			const blob = await pdf(pdfDoc).toBlob();

			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'invoice.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
			toast({
				variant: 'default',
				title: 'Invoice Ready to Share!',
				description: `PDF created successfully! You're just one step away from getting paid.`,
			});
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An error occurred.',
				description: error as string,
			});
			console.error('PDF Export Error:', error);
		}
	};

	return (
		<PageWrapper>
			<Section className='mx-auto max-w-screen-sm'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-16'>
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
															prefix={userData?.currency}
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
											<span className='text-muted-foreground'>{userData?.currency}</span>
											<span>{((invoiceData.items[index]?.quantity ?? 0) * (invoiceData.items[index]?.amount ?? 0)).toFixed(2)}</span>
										</span>
										<Button type='button' variant='outline' className='col-start-2 lg:col-start-auto' onClick={() => remove(index)}>
											<DeleteIcon className='size-5' />
										</Button>
									</div>
								</div>
							))}

							<div>
								<Button type='button' variant='outline' onClick={addNewItem}>
									<CirclePlusIcon />
									Add Item
								</Button>
							</div>
						</div>

						<div>
							<H3 className='mb-6'>Tax</H3>
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

						<div>
							<span>
								<H3 className='flex items-center gap-2'>
									Subtotal:
									<span className='font-normal'>{userData?.currency}</span>
									<span className='font-normal'>{invoiceData.items.reduce((acc, item) => acc + (item.quantity ?? 0) * (item.amount ?? 0), 0).toFixed(2)}</span>
								</H3>
							</span>
						</div>

						<div className='flex items-center gap-4'>
							<Button type='submit' size='lg' className='flex items-center gap-2'>
								<RocketIcon />
								Create Invoice
							</Button>

							<Button type='button' size='lg' variant='ghost' onClick={() => handleExportPDF()}>
								<DownloadIcon />
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
								<UndoDotIcon />
								Reset Form
							</Button>
						</div>
					</form>
				</Form>
			</Section>
		</PageWrapper>
	);
}
