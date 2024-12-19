'use client';

import { Section } from '@/components/layout';
import { A, H1, P } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

export default function Hero() {
	return (
		<Section className='relative grid h-svh w-full place-items-center'>
			<div className='space-y-16 text-center'>
				<div className='space-y-8'>
					<Badge>Early Access</Badge>
					<H1 variant='hero'>Your Invoicing, Simplified.</H1>
					<P variant='lg' className='mx-auto max-w-md'>
						Create, manage, and export professional invoices in seconds—anytime, anywhere.
					</P>
				</div>

				<div className='mt-8 space-x-4 md:space-x-8'>
					<Button>
						<ArrowRightIcon />
						Get Started for Free
					</Button>
					<A href='#'>Learn more</A>
				</div>
			</div>

			<img className='absolute top-0 -z-50 -translate-y-1/2' src={'https://farmui.vercel.app/bg-back.png'} width={1000} height={1000} alt='back bg' />
			<div className='absolute inset-0 -z-50 h-[600px] w-full bg-transparent bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-10 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]' />
		</Section>
	);
}
