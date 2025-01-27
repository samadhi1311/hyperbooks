'use client';

import { Section } from '@/components/ui/layout';
import { P } from '@/components/ui/typography';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import GridPattern from '@/components/ui/grid-pattern';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { cn } from '@/lib/utils';
import { FlaskConicalIcon, MousePointerClickIcon } from 'lucide-react';
import { stagger, useAnimate } from 'motion/react';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
	const [scope, animate] = useAnimate();
	const description = 'Your Invoicing, Simplified.'.split('');

	useEffect(() => {
		const hasAnimated = sessionStorage.getItem('heroAnimated');

		function intro() {
			animate('.hyperreal-hero-bg', { opacity: [0, 1] }, { duration: 1 });
			animate('.hyperbooks-hero', { opacity: [0, 1] }, { duration: 2, delay: 1.5 });
			animate('.hyperbooks-hero-title', { y: [75, 0], opacity: [0, 1] }, { duration: 0.8, ease: [0.215, 0.61, 0.355, 1], delay: stagger(0.035) });
			sessionStorage.setItem('heroAnimated', 'true');
		}

		setTimeout(
			() => {
				if (!hasAnimated) {
					intro();
				} else {
					// Immediately show elements without animation
					animate('.hyperreal-hero-bg', { opacity: 1 }, { duration: 1 });
					animate('.hyperbooks-hero', { opacity: 1 }, { duration: 1 });
					animate('.hyperbooks-hero-title', { y: 0, opacity: 1 }, { duration: 1 });
				}
			},
			hasAnimated ? 0 : 3000
		);
	}, []);

	return (
		<Section ref={scope} className='relative grid h-svh w-full place-items-center'>
			<div className='space-y-16 text-center'>
				<div className='flex flex-col gap-8'>
					<div className='hyperbooks-hero mx-auto w-fit rounded-full border border-border bg-background px-2 py-1 text-sm opacity-0'>
						<AnimatedShinyText className='inline-flex items-center justify-center gap-2 px-4 py-1'>
							<span>
								<FlaskConicalIcon className='size-4 text-muted-foreground/70' />
							</span>
							<hr className='mx-2 h-4 w-px shrink-0 bg-muted-foreground/50' />
							Early Access
						</AnimatedShinyText>
					</div>

					<h1 className='overflow-clip text-5xl font-semibold leading-none tracking-tighter text-foreground md:text-7xl'>
						{description.map((char, index) => (
							<span key={index} className='hyperbooks-hero-title inline-block overflow-clip whitespace-pre py-1.5 opacity-0'>
								{char}
							</span>
						))}
					</h1>
					<P variant='lg' className='hyperbooks-hero mx-auto max-w-md text-muted-foreground opacity-0'>
						Create, manage, and export professional invoices in seconds—anytime, anywhere.
					</P>
				</div>

				<div className='hyperbooks-hero group mt-8 flex flex-col items-center gap-8 opacity-0'>
					<Link href='/dashboard'>
						<RainbowButton className='w-fit'>
							Get Started
							<MousePointerClickIcon className='ml-2 size-5' />
						</RainbowButton>
					</Link>
					<span>
						<P variant='sm' className='font-normal text-muted-foreground'>
							No credit card required.
						</P>
					</span>
				</div>
			</div>

			<img className='hyperreal-hero-bg absolute top-0 -z-50 -translate-y-1/2 opacity-0 saturate-150 dark:saturate-100' src='/bg-gradient.png' width={1000} height={1000} alt='back bg' />

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
				className={cn('-z-50 hyperreal-hero-bg [mask-image:radial-gradient(circle_at_50%_0,white_0,transparent_50%)] skew-y-12 opacity-0')}
			/>
		</Section>
	);
}
