'use client';

import { Section } from '@/components/ui/layout';
import { H1, P } from '@/components/ui/typography';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import GridPattern from '@/components/ui/grid-pattern';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { cn } from '@/lib/utils';
import { FlaskConicalIcon, MousePointerClickIcon } from 'lucide-react';

export default function Hero() {
	return (
		<Section className='relative grid h-svh w-full place-items-center'>
			<div className='space-y-16 text-center'>
				<div className='space-y-8'>
					<div className='mx-auto w-fit rounded-full border border-border bg-background px-2 py-1 text-sm'>
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

				<div className='group mt-8 flex flex-col items-center gap-8'>
					<RainbowButton className='w-fit'>
						Get Started
						<MousePointerClickIcon className='ml-2 size-5' />
					</RainbowButton>
					<span>
						<P variant='sm' className='font-normal text-neutral-400 dark:text-neutral-600'>
							No credit card required.
						</P>
					</span>
				</div>
			</div>

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
	);
}
