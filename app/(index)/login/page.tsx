'use client';

import { Input } from '@/components/ui/input';
import { PageWrapper, Section } from '@/components/ui/layout';
import { Label } from '@/components/ui/label';
import { H2, P } from '@/components/ui/typography';
import GridPattern from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { IconButton } from '@/components/ui/icon-button';
import { LogInIcon } from 'lucide-react';

export default function Login() {
	return (
		<PageWrapper>
			<Section variant='main' className='relative grid h-svh w-full place-items-center'>
				<form className='mx-auto flex w-full max-w-md flex-col gap-16 rounded-lg border border-border bg-background/50 p-12 shadow backdrop-blur'>
					<div className='flex flex-col items-center gap-2 text-center'>
						<P className='text-balance text-muted-foreground'>Welcome back.</P>
						<H2>Login to your account</H2>
					</div>
					<div className='grid gap-6'>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input id='email' type='email' placeholder='name@example.com' required />
						</div>
						<div className='grid gap-2'>
							<div className='flex items-center'>
								<Label htmlFor='password'>Password</Label>
								<a href='#' className='ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline'>
									Forgot your password?
								</a>
							</div>
							<Input id='password' type='password' required />
						</div>
						<div className='mt-4 flex w-full items-center justify-center'>
							<IconButton type='submit' variant='secondary' icon={<LogInIcon />}>
								Sign Up
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

				<img className='absolute top-0 -z-50 -translate-y-1/2 saturate-150 dark:saturate-100' src='/bg-gradient.png' width={1000} height={1000} alt='back bg' />

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
