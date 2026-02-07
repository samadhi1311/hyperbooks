'use client';

import { A, H3 } from './ui/typography';

export default function Footer() {
	return (
		<footer className='border-t border-border bg-background px-4 2xl:px-0'>
			<div className='mx-auto grid w-full max-w-screen-2xl gap-6 py-8 md:py-16'>
				<div className='grid place-items-center gap-6'>
					<A href='/' className='flex flex-row items-center gap-2'>
						<img src='/logo.svg' alt='Logo' width={64} height={64} className='size-8 transition-all hover:opacity-75' />
						<H3>hyperbooks.</H3>
					</A>
					<div className='mb-6 flex flex-col items-center gap-4 text-sm text-muted-foreground underline underline-offset-4 md:mb-0 md:flex-row'>
						<A href='/#features'>Features</A>
						<A href='/#pricing'>Pricing</A>
						<A href='/privacy-policy'>Privacy Policy</A>
						<A href='/terms-and-conditions'>Terms & Conditions</A>
					</div>
					<p>
						&copy; 2026{' '}
						<A href='https://hyperreal.cloud' className='bg-gradient-to-tr from-violet-700 to-orange-400 bg-clip-text font-medium text-transparent dark:from-violet-600 dark:to-orange-500'>
							hyperreal
						</A>
						, All Rights Reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
