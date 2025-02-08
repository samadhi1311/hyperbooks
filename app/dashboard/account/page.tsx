'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageWrapper, Section } from '@/components/ui/layout';
import { H2, H3 } from '@/components/ui/typography';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { avatars } from '@/lib/types';
import { updateProfile } from 'firebase/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '@/firebase.config';
import { Loader2Icon, SendHorizonalIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
	const currentUser = auth.currentUser;

	const [updating, setUpdating] = useState(false);

	const formSchema = z.object({
		username: z.string().min(2, {
			message: 'Username must be at least 2 characters.',
		}),
		avatar: z.number().min(1).max(6),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: currentUser?.displayName || '',
			avatar: currentUser?.photoURL ? avatars.findIndex((avatar) => avatar.url === currentUser.photoURL) + 1 : 1,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
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

	if (!currentUser) return null;
	return (
		<PageWrapper>
			<Section className='mx-auto max-w-screen-sm space-y-16'>
				<div className='w-full space-y-8'>
					<H2>Account Settings</H2>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<FormField
								control={form.control}
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
								control={form.control}
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
														className={`flex size-20 items-center justify-center rounded-full transition-all border border-input duration-300 ${
															field.value === avatar.id ? 'border-accent-foreground bg-muted' : ''
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
					<Button className='max-w-fit'>Reset Password</Button>
					<Label className='text-muted-foreground'>To update/reset your current password, click the button above and follow the instructions.</Label>
				</div>

				<div className='flex flex-col gap-4'>
					<H3 className='mb-1'>Manage Subscription</H3>
					<Button className='max-w-fit'>Open Customer Portal</Button>
					<Label className='text-muted-foreground'>To manage your current subscription, click the button above and follow the instructions.</Label>
				</div>
			</Section>
		</PageWrapper>
	);
}
