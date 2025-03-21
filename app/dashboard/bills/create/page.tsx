'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader2Icon, SendHorizonalIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { BillData } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { H3, P } from '@/components/ui/typography';
import { Textarea } from '@/components/ui/textarea';
import { PrefixedInput } from '@/components/prefixed-input';
import { useBillStore } from '@/store/use-bill';
import { useFirestore } from '@/hooks/use-firestore';
import { IconButton } from '@/components/ui/icon-button';
import { expenseCategories } from '@/lib/constants';

const FormSchema = z.object({
	description: z
		.string({
			required_error: 'Description is required',
		})
		.max(255, 'Description must be at most 100 characters long'),
	category: z.string({
		required_error: 'Please select a Category.',
	}),
	amount: z.coerce.number().min(0, 'Amount must be at least 0').optional(),
});

export default function CreateBill() {
	const isMobile = useIsMobile();
	const [open, setOpen] = useState(false);
	const { bill, clearBill, setBill } = useBillStore();
	const { addBill, loading } = useFirestore();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			description: bill?.description ?? '',
			category: bill?.category ?? '',
			//@ts-expect-error Type 'string | undefined' is not assignable to type 'string'.
			amount: bill?.amount ?? '',
		},
	});

	useEffect(() => {
		const subscription = form.watch((values) => {
			if (!form.formState.isSubmitting && !form.formState.isValidating) {
				setBill({ ...values } as BillData);
			}
		});
		return () => subscription.unsubscribe();
	}, [form]);

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			await addBill(data);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<PageWrapper>
			<Section className='relative mx-auto max-w-screen-sm'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
						<H3 className='mb-6'>Expense Information</H3>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder='Expense description' {...field} value={field.value ?? ''} />
									</FormControl>
									<FormDescription>Enter a description for the expense.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='amount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<PrefixedInput prefix='LKR' type='number' placeholder='Expense amount' {...field} value={field.value ?? ''} />
									</FormControl>
									<FormDescription>Enter the amount of the expense</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='category'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>Category</FormLabel>
									{isMobile ? (
										<Drawer open={open} onOpenChange={setOpen}>
											<DrawerTrigger asChild>
												<Button variant='outline' className='justify-between'>
													{field.value ? expenseCategories.find((c) => c.value === field.value)?.label : 'Select category'}
													<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
												</Button>
											</DrawerTrigger>
											<DrawerContent>
												<CategoryList setOpen={setOpen} form={form} />
											</DrawerContent>
										</Drawer>
									) : (
										<Popover open={open} onOpenChange={setOpen}>
											<PopoverTrigger asChild>
												<Button variant='outline' className='w-full justify-between'>
													{field.value ? expenseCategories.find((c) => c.value === field.value)?.label : 'Select category'}
													<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
												</Button>
											</PopoverTrigger>

											<PopoverContent className='max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width]'>
												<CategoryList setOpen={setOpen} form={form} />
											</PopoverContent>
										</Popover>
									)}
									<FormDescription>Select the most appropriate category of the expense. Else select `Other`.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className='flex flex-col items-center gap-4 pt-8 md:flex-row'>
							<IconButton type='submit' size='lg' icon={loading ? <Loader2Icon className='animate-spin' /> : <SendHorizonalIcon />} disabled={loading}>
								Create Expense
							</IconButton>

							<Button
								type='button'
								size='lg'
								variant='ghost'
								onClick={() => {
									form.reset({
										description: '',
										category: '',
										amount: undefined,
									});
									clearBill();
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

function CategoryList({ setOpen, form }: { setOpen: (open: boolean) => void; form: any }) {
	return (
		<Command>
			<CommandInput placeholder='Search category...' />
			<CommandList>
				<CommandEmpty>No category found.</CommandEmpty>
				<CommandGroup>
					{expenseCategories.map((category) => (
						<CommandItem
							className='my-1'
							key={category.value}
							value={category.value}
							onSelect={() => {
								form.setValue('category', category.value);
								setOpen(false);
							}}>
							<span className='flex w-full flex-col'>
								<P>{category.label}</P>
								<P variant='sm' className='text-muted-foreground'>
									{category.description}
								</P>
							</span>
							<Check className={cn('ml-auto', category.value === form.getValues('category') ? 'opacity-100' : 'opacity-0')} />
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
