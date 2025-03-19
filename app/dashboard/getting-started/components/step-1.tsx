'use client';

import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { H2, P } from '@/components/ui/typography';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { auth } from '@/firebase.config';
import { updateProfile, User } from 'firebase/auth';
import { avatars } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { IconButton } from '@/components/ui/icon-button';
import { ArrowRightIcon, Loader2Icon } from 'lucide-react';

export default function Step1({ handleNext, formAnimations }: { handleNext: () => void; formAnimations: object }) {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		if (auth.currentUser) {
			auth.currentUser.reload();
			setCurrentUser(auth.currentUser);
		}
	}, []);

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

	useEffect(() => {
		if (currentUser) {
			form.reset({
				username: currentUser.displayName || '',
				avatar: currentUser.photoURL ? avatars.findIndex((avatar) => avatar.url === currentUser.photoURL) + 1 : 1,
			});
		}
	}, [currentUser, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
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
			handleNext();
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
		<motion.div {...formAnimations} className='w-full space-y-12'>
			<div className='space-y-2'>
				<H2>Welcome to hyperbooks.</H2>
				<P>We have sent a confirmation email to you. Please check your inbox.</P>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
												className={`flex size-20 items-center justify-center rounded-full transition-all border duration-200 ${
													field.value === avatar.id ? 'border-accent-foreground bg-muted' : 'border-input bg-transparent'
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

					<IconButton type='submit' icon={updating ? <Loader2Icon className='animate-spin' /> : <ArrowRightIcon />}>
						{updating ? 'Updating...' : 'Continue'}
					</IconButton>
				</form>
			</Form>
		</motion.div>
	);
}
