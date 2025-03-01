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
import { useTheme } from 'next-themes';

export default function Hero() {
	const [scope, animate] = useAnimate();
	const { theme } = useTheme();
	const description = 'Smart, simple and stress-free bookkeeping.';

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
		<Section ref={scope} className='relative grid w-full place-items-center'>
			<div className='mt-8 space-y-16 text-center sm:mt-32'>
				<div className='mx-auto flex max-w-screen-lg flex-col gap-6 md:gap-8'>
					<div className='hyperbooks-hero mx-auto w-fit rounded-full border border-border bg-foreground/5 px-2 py-1 text-sm opacity-0 backdrop-blur-md'>
						<AnimatedShinyText className='inline-flex items-center justify-center gap-2 px-4 py-1 text-sm text-muted-foreground md:text-base'>
							<span>
								<FlaskConicalIcon className='size-4' />
							</span>
							<hr className='mx-2 h-4 w-px shrink-0 bg-muted-foreground' />
							Early Access
						</AnimatedShinyText>
					</div>

					<h1 className='font-display text-3xl font-light tracking-tighter text-foreground md:text-5xl xl:text-7xl'>
						{description.split(' ').map((char, index) => (
							<span key={index} className='hyperbooks-hero-title inline-block whitespace-pre opacity-0'>
								{char + ' '}
							</span>
						))}
					</h1>
					<P className='hyperbooks-hero mx-auto max-w-screen-sm text-sm text-muted-foreground opacity-0 md:text-base'>
						Whether you’re an individual, freelancer, a business owner, or just need a better way to track your money, hyperbooks make it effortless.
					</P>
				</div>

				<div className='hyperbooks-hero group mt-8 flex flex-col items-center gap-16 opacity-0'>
					<Link href='/dashboard' className='group flex items-center pb-4 md:overflow-hidden md:pb-10'>
						<RainbowButton className='w-auto overflow-x-clip text-sm font-semibold md:text-base'>
							<MousePointerClickIcon className='mr-3 size-6 scale-x-[-1] transition-transform duration-200 group-hover:translate-x-1' />
							Get Started
						</RainbowButton>
					</Link>

					<img
						src={theme === 'dark' ? 'dashboard-dark.png' : 'dashboard-light.png'}
						className='skew-y-6 scale-90 transform-gpu rounded-lg border border-border drop-shadow-2xl filter transition-transform duration-300 hover:skew-y-0 hover:scale-100'
						alt='hyperbooks dashboard'
					/>
				</div>
			</div>

			<img className='hyperreal-hero-bg absolute top-0 -z-50 -translate-y-1/2 opacity-0 blur-lg saturate-150 dark:saturate-100' src='/bg-gradient.png' width={1000} height={1000} alt='back bg' />

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
