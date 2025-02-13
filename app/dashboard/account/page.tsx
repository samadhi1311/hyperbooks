'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageWrapper, Section } from '@/components/ui/layout';
import { H2, H3 } from '@/components/ui/typography';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { avatars } from '@/lib/types';
import { updateProfile } from 'firebase/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '@/firebase.config';
import { KeySquareIcon, Loader2Icon, SaveIcon, SendHorizonalIcon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import { useUserStore } from '@/store/use-user';

export default function Settings() {
	const currentUser = auth.currentUser;
	const { updateUser, getUser } = useFirestore();
	const { userData } = useUserStore();

	const [updating, setUpdating] = useState(false);
	const [customCurrency, setCustomCurrency] = useState(false);
	const [accUpdated, setAccUpdated] = useState(false);

	const accSchema = z.object({
		username: z.string().min(2, {
			message: 'Username must be at least 2 characters.',
		}),
		avatar: z.number().min(1).max(6),
	});

	const appSchema = z.object({
		currency: z.union([z.enum(['USD', 'LKR', 'EUR', 'INR']), z.string().length(3, 'Currency must be a 3-letter code').toUpperCase()]),
	});

	const accForm = useForm<z.infer<typeof accSchema>>({
		resolver: zodResolver(accSchema),
		defaultValues: {
			username: currentUser?.displayName || '',
			avatar: currentUser?.photoURL ? avatars.findIndex((avatar) => avatar.url === currentUser.photoURL) + 1 : 1,
		},
	});

	const appForm = useForm<z.infer<typeof appSchema>>({
		resolver: zodResolver(appSchema),
		defaultValues: {
			currency: userData?.currency || 'USD',
		},
	});

	function accOnSubmit(values: z.infer<typeof accSchema>) {
		setUpdating(true);
		try {
			if (currentUser) {
				updateProfile(currentUser, { displayName: values.username, photoURL: avatars[values.avatar - 1].url });
				currentUser.reload();
				toast({
					variant: 'success',
					title: 'Account updated.',
					description: 'Your account details have been updated successfully.',
				});
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An error occured.',
				description: `Couldn't update your account details. Please try again.`,
			});
			console.error(error);
		} finally {
			setUpdating(false);
		}
	}

	function appOnSubmit(values: z.infer<typeof appSchema>) {
		setUpdating(true);
		try {
			updateUser({ currency: values.currency })
				.then(() => getUser())
				.then(() => setUpdating(false))
				.then(() => setAccUpdated(true));
		} catch {
			toast({
				variant: 'destructive',
				title: 'An error occured.',
				description: `Couldn't update your app settings. Please try again.`,
			});
		} finally {
			setUpdating(false);
		}
	}

	if (!currentUser) return null;
	return (
		<PageWrapper>
			<Section className='mx-auto max-w-screen-sm space-y-16'>
				<div className='w-full space-y-8'>
					<H2>Account Settings</H2>

					<Form {...accForm}>
						<form onSubmit={accForm.handleSubmit(accOnSubmit)} className='space-y-6'>
							<FormField
								control={accForm.control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder='Your Name' {...field} />
										</FormControl>
										<FormDescription>This is your public display name which we call you by.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={accForm.control}
								name='avatar'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Avatar</FormLabel>
										<FormControl>
											<div {...field} className='grid-col-3 grid gap-2 md:grid-cols-6'>
												{avatars.map((avatar) => (
													<div
														key={avatar.id}
														onClick={() => field.onChange(avatar.id)}
														className={`flex size-20 items-center justify-center rounded-full transition-all border-2 duration-200 ${
															field.value === avatar.id ? 'border-sidebar-ring bg-foreground' : 'border-input bg-transparent'
														}`}>
														<img src={avatar.url} alt={`Avatar ${avatar.id}`} className='size-16 object-contain' />
													</div>
												))}
											</div>
										</FormControl>
										<FormDescription>Choose your avatar.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type='submit' className='flex items-center gap-2'>
								{updating ? (
									<>
										<Loader2Icon className='animate-spin' />
										Updating
									</>
								) : (
									<>
										<SendHorizonalIcon />
										Update details
									</>
								)}
							</Button>
						</form>
					</Form>
				</div>

				<div className='flex flex-col gap-4'>
					<H3 className='mb-1'>Change Password</H3>
					<Button className='flex max-w-fit items-center gap-2'>
						<KeySquareIcon />
						Reset Password
					</Button>
					<Label className='text-muted-foreground'>To update/reset your current password, click the button above and follow the instructions.</Label>
				</div>

				<div className='flex flex-col gap-4'>
					<H3 className='mb-1'>Manage Subscription</H3>
					<Button className='flex max-w-fit items-center gap-2'>
						<ShoppingCartIcon />
						Open Customer Portal
					</Button>
					<Label className='text-muted-foreground'>To manage your current subscription, click the button above and follow the instructions.</Label>
				</div>

				<div className='flex flex-col gap-4'>
					<H3 className='mb-1'>App Settings</H3>
					<Form {...appForm}>
						<form onSubmit={appForm.handleSubmit(appOnSubmit)} className='space-y-4'>
							{/* Currency Selection */}
							<FormField
								control={appForm.control}
								name='currency'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Currency</FormLabel>
										{customCurrency ? (
											<Input placeholder='Enter 3-letter currency code' maxLength={3} onChange={(e) => field.onChange(e.target.value)} />
										) : (
											<Select
												onValueChange={(value) => {
													if (value === 'custom') {
														setCustomCurrency(true);
														appForm.setValue('currency', ''); // Reset the field for custom input
													} else {
														field.onChange(value);
													}
												}}
												defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Select a currency' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='LKR'>LKR</SelectItem>
													<SelectItem value='INR'>INR</SelectItem>
													<SelectItem value='USD'>USD</SelectItem>
													<SelectItem value='EUR'>EUR</SelectItem>
													<SelectItem value='custom'>Other (Enter manually)</SelectItem>
												</SelectContent>
											</Select>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button className='flex max-w-fit items-center gap-2' type='submit'>
								{updating ? (
									<>
										<Loader2Icon className='animate-spin' />
										Updating
									</>
								) : accUpdated ? (
									<>
										<SaveIcon />
										Updated
									</>
								) : (
									<>
										<SaveIcon />
										Apply Settings
									</>
								)}
							</Button>
						</form>
					</Form>
				</div>
			</Section>
		</PageWrapper>
	);
}
