'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageWrapper, Section } from '@/components/ui/layout';
import { H2, H3, P } from '@/components/ui/typography';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { avatars } from '@/lib/types';
import { updateProfile, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '@/firebase.config';
import { CircleAlertIcon, KeySquareIcon, Loader2Icon, SaveIcon, SendHorizonalIcon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import { useUserStore } from '@/store/use-user';
import Link from 'next/link';
import { IconButton } from '@/components/ui/icon-button';

export default function Settings() {
	const currentUser = auth.currentUser;
	const { updateUser, loading } = useFirestore();
	const { userData } = useUserStore();

	const [updating, setUpdating] = useState(false);
	const [fetchingLink, setFetchingLink] = useState(false);
	const [customCurrency, setCustomCurrency] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

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

	async function accOnSubmit(values: z.infer<typeof accSchema>) {
		setUpdating(true);
		try {
			if (currentUser) {
				await updateProfile(currentUser, { displayName: values.username, photoURL: avatars[values.avatar - 1].url });
				currentUser.reload();
				toast({
					variant: 'success',
					title: 'Account details updated.',
					description: 'Your account details have been updated successfully.',
				});
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An error occured.',
				description: 'Something went wrong. Please try again.',
			});
			console.error(error);
		} finally {
			setUpdating(false);
		}
	}

	async function appOnSubmit(values: z.infer<typeof appSchema>) {
		await updateUser({ currency: values.currency });
	}

	async function getPortalLink() {
		setFetchingLink(true);

		if (!userData) return;

		const portalLink = await fetch('https://hyperbooks-api.hyperreal.cloud/customer-portal', {
			method: 'POST',
			body: JSON.stringify({ customer_id: userData.customer_id }),
		});

		const response = await portalLink.json();

		window.open(response.url, '_blank');

		setFetchingLink(false);
	}

	async function sendEmail() {
		try {
			await sendEmailVerification(currentUser!);
			toast({
				variant: 'success',
				title: 'Email verification sent.',
				description: 'Please check your email inbox and verify your email.',
			});
			setEmailSent(true);
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An error occured.',
				description: 'Something went wrong. Please try again.',
			});
			console.error(error);
		}
	}

	if (!currentUser) return null;

	return (
		<PageWrapper>
			<Section className='mx-auto max-w-screen-sm space-y-16'>
				<div className='w-full space-y-8'>
					<H2>Account Settings</H2>
					{!currentUser.emailVerified ||
						(emailSent && (
							<div className='my-4 space-y-2 rounded-lg border border-border bg-muted/60 p-4'>
								<P variant='sm' className='flex items-center gap-2 text-destructive'>
									<CircleAlertIcon className='size-4' />
									Your email is not verified yet. Please check your email inbox.
								</P>
								<IconButton type='button' variant='outline' icon={<SendHorizonalIcon />} onClick={sendEmail}>
									Resend email
								</IconButton>
							</div>
						))}
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
											<div {...field} className='grid grid-cols-3 place-items-center gap-6 md:grid-cols-6'>
												{avatars.map((avatar) => (
													<div
														key={avatar.id}
														onClick={() => field.onChange(avatar.id)}
														className={`flex aspect-square size-12 md:size-20 items-center justify-center rounded-full transition-all border-2 duration-200 ${
															field.value === avatar.id ? 'border-sidebar-ring bg-foreground' : 'border-input bg-transparent'
														}`}>
														<img src={avatar.url} alt={`Avatar ${avatar.id}`} className='size-8 object-contain md:size-16' />
													</div>
												))}
											</div>
										</FormControl>
										<FormDescription>Choose your avatar.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<IconButton type='submit' icon={updating ? <Loader2Icon className='animate-spin' /> : <SendHorizonalIcon />} disabled={updating}>
								{updating ? 'Updating' : 'Update details'}
							</IconButton>
						</form>
					</Form>
				</div>

				<div className='flex flex-col gap-3 md:gap-4'>
					<H3 className='mb-1'>Change Password</H3>
					<IconButton icon={<KeySquareIcon />} onClick={() => sendPasswordResetEmail(auth, currentUser.email!)}>
						Reset Password
					</IconButton>
					<Label className='text-muted-foreground'>To update/reset your current password, click the button above and follow the instructions.</Label>
				</div>

				<>
					{userData?.subscription_status === 'active' ? (
						<div className='flex flex-col gap-3 md:gap-4'>
							<H3 className='mb-1'>Manage Subscription</H3>
							<IconButton icon={fetchingLink ? <Loader2Icon className='animate-spin' /> : <ShoppingCartIcon />} onClick={getPortalLink} disabled={fetchingLink}>
								{fetchingLink ? 'Loading' : 'Open Customer Portal'}
							</IconButton>
							<Label className='text-muted-foreground'>To manage your current subscription, click the button above and follow the instructions.</Label>
						</div>
					) : (
						<div className='flex flex-col gap-3 md:gap-4'>
							<H3 className='mb-1'>Upgrade to Pro or Ultimate</H3>
							<Link href='/dashboard/upgrade'>
								<IconButton icon={<ShoppingCartIcon />} className='flex max-w-fit items-center gap-2'>
									View Plans
								</IconButton>
							</Link>
							<Label className='text-muted-foreground'>Upgrade your plan and receive more features.</Label>
						</div>
					)}
				</>

				<div className='flex flex-col gap-3 md:gap-4'>
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

							<IconButton icon={loading ? <Loader2Icon className='animate-spin' /> : <SaveIcon />} disabled={loading} type='submit'>
								{loading ? 'Updating' : 'Apply Settings'}
							</IconButton>
						</form>
					</Form>
				</div>
			</Section>
		</PageWrapper>
	);
}
