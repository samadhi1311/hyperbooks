'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PageWrapper, Section } from '@/components/ui/layout';
import { H2, P } from '@/components/ui/typography';
import GridPattern from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { IconButton } from '@/components/ui/icon-button';
import { Loader2Icon, LogInIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { PasswordInput } from '@/components/ui/password-input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTheme } from 'next-themes';

export default function Login() {
	const { login, authLoading } = useAuth();
	const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!;
	const { theme } = useTheme();

	const formSchema = z.object({
		email: z.string().email().min(1, { message: 'Email is required' }).max(64, { message: 'Email must be at most 64 characters' }),
		password: z.string().min(8, { message: 'Password must be at least 8 characters' }).max(32, { message: 'Password must be at most 32 characters' }),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		login(values.email, values.password);
	}

	return (
		<PageWrapper>
			<Section variant='main' className='relative grid h-svh w-full place-items-center'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='mx-auto flex w-full max-w-md flex-col gap-16 rounded-lg border border-border bg-background/50 p-12 shadow backdrop-blur'>
						<div className='flex flex-col items-center gap-2 text-center'>
							<P className='text-balance text-muted-foreground'>Welcome back.</P>
							<H2>Login to your account</H2>
						</div>
						<div className='grid gap-6'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='name@example.com' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<PasswordInput placeholder='••••••••' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Link href='#' className='mb-2 ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline'>
								Forgot your password?
							</Link>

							<div className='cf-turnstile *:border-none' data-sitekey={siteKey} data-theme={theme === 'dark' ? 'dark' : 'light'} data-size='flexible' />

							<div className='mt-4 flex w-full items-center justify-center'>
								<IconButton type='submit' variant='secondary' icon={authLoading ? <Loader2Icon className='animate-spin' /> : <LogInIcon />}>
									Log In
								</IconButton>
							</div>
						</div>
						<div className='text-center text-sm text-muted-foreground'>
							Don&apos;t have an account?{' '}
							<Link href='/signup' className='underline underline-offset-4'>
								Sign up
							</Link>
						</div>
					</form>
				</Form>

				<img className='absolute top-0 -z-50 -translate-y-1/2 blur-lg saturate-150 dark:saturate-100' src='/bg-gradient.png' width={1000} height={1000} alt='back bg' />

				<GridPattern
					squares={[
						[6, 3],
						[8, 8],
						[12, 10],
						[15, 3],
						[25, 10],
						[20, 5],
					]}
					width={48}
					height={48}
					x={-1}
					y={-1}
					className={cn('-z-50 [mask-image:radial-gradient(circle_at_50%_0,white_0,transparent_50%)] skew-y-12')}
				/>
			</Section>
		</PageWrapper>
	);
}
