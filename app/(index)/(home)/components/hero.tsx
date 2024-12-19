'use client';

import { Section } from '@/components/layout';
import { H1, P } from '@/components/typography';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { ArrowRightIcon, FlaskConicalIcon } from 'lucide-react';

export default function Hero() {
	return (
		<Section className='relative grid h-svh w-full place-items-center'>
			<div className='space-y-16 text-center'>
				<div className='space-y-8'>
					<div className='mx-auto w-fit rounded-full border border-border px-2 py-1 text-sm'>
						<AnimatedShinyText className='inline-flex items-center justify-center gap-2 px-4 py-1'>
							<span>
								<FlaskConicalIcon className='size-4 text-neutral-600/70 dark:text-neutral-400/70' />
							</span>
							<hr className='mx-2 h-4 w-px shrink-0 bg-neutral-400/70 dark:bg-neutral-700/70' />
							Early Access
						</AnimatedShinyText>
					</div>
					<H1 variant='hero'>Your Invoicing, Simplified.</H1>
					<P variant='lg' className='mx-auto max-w-md'>
						Create, manage, and export professional invoices in seconds—anytime, anywhere.
					</P>
				</div>

				<div className='mt-8 flex flex-col items-center gap-8'>
					<RainbowButton className='w-fit'>
						<ArrowRightIcon className='mr-2' />
						Get Started for Free
					</RainbowButton>
				</div>
			</div>

			<img className='absolute top-0 -z-50 -translate-y-1/2' src={'https://farmui.vercel.app/bg-back.png'} width={1000} height={1000} alt='back bg' />
			<div className='absolute inset-0 -z-50 h-[600px] w-full bg-transparent bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-10 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]' />
		</Section>
	);
}
