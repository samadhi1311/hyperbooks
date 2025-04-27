'use client';

import { P } from '@/components/ui/typography';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import GridPattern from '@/components/ui/grid-pattern';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { cn } from '@/lib/utils';
import { MousePointerClickIcon, PackagePlusIcon } from 'lucide-react';
import { stagger, useAnimate } from 'motion/react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Hero() {
	const [scope, animate] = useAnimate();
	const { theme } = useTheme();
	const dashboardRef = useRef<HTMLDivElement>(null);
	const description = 'Smart, simple & stress-free bookkeeping.';
	const isMobile = useIsMobile();

	useEffect(() => {
		const hasAnimated = sessionStorage.getItem('heroAnimated');

		function intro() {
			animate('.hyperreal-hero-bg', { opacity: [0, 1] }, { duration: 1, delay: 1 });
			animate('.hyperbooks-hero', { opacity: [0, 1] }, { duration: 1, ease: [0, 0, 0.2, 1], delay: 1.5 });
			animate('.hyperbooks-hero-title', { y: [15, 0], opacity: [0, 1] }, { duration: 1, ease: [0.215, 0.61, 0.355, 1], delay: stagger(0.05) });
			sessionStorage.setItem('heroAnimated', 'true');
		}

		setTimeout(
			() => {
				if (hasAnimated === null) {
					intro();
				} else {
					// Immediately show elements without animation
					animate('.hyperreal-hero-bg', { opacity: 1 }, { duration: 1 });
					animate('.hyperbooks-hero', { opacity: 1 }, { duration: 1 });
					animate('.hyperbooks-hero-title', { y: 0, opacity: 1 }, { duration: 1 });
				}
			},
			hasAnimated ? 0 : 2000
		);
	}, []);

	useEffect(() => {
		const element = dashboardRef.current;
		if (!element) return;

		// Set initial skew
		element.style.transform = 'perspective(1000px) translateZ(0) skewY(3deg)';

		const handleMouseMove = (e: MouseEvent) => {
			const rect = element.getBoundingClientRect();
			const padding = 100;

			const x = Math.min(Math.max(e.clientX - (rect.left - padding), 0), rect.width + padding * 2);
			const y = Math.min(Math.max(e.clientY - (rect.top - padding), 0), rect.height + padding * 2);

			const xPercent = (x / (rect.width + padding * 2) - 0.5) * 2;
			const yPercent = (y / (rect.height + padding * 2) - 0.5) * 2;

			element.style.transform = `perspective(1000px) translateZ(0) rotateX(${yPercent * -3}deg) rotateY(${xPercent * 3}deg)`;
		};

		const handleMouseLeave = () => {
			element.style.transform = 'perspective(1000px) translateZ(0) skewY(3deg)';
		};

		element.addEventListener('mousemove', handleMouseMove);
		element.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			element.removeEventListener('mousemove', handleMouseMove);
			element.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, []);

	return (
		<section ref={scope} className='relative grid w-full place-items-center pb-8 md:pb-12 lg:pb-16'>
			<div className='mt-24 flex flex-col gap-8 text-center md:mt-32'>
				<div className='mx-auto flex max-w-screen-lg flex-col gap-8'>
					<div className='hyperbooks-hero mx-auto w-fit transform-gpu rounded-full border border-border bg-card text-sm opacity-0 will-change-transform md:px-2 md:py-1'>
						<AnimatedShinyText shimmerWidth={200} className='inline-flex items-center justify-center gap-1 px-2 py-1 text-xs md:gap-2 md:px-4'>
							<span>
								<PackagePlusIcon className='size-4' />
							</span>
							<hr className='mx-2 h-4 w-px shrink-0 bg-muted-foreground' />
							v1.0.2 - Newly added Azure and Midnight Themes
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
						Whether you&apos;re a freelancer, business owner, or just someone trying to get your finances in order, <span className='font-semibold'>hyperbooks</span> makes tracking your
						money easy — and even enjoyable.
					</P>
				</div>

				<div className='hyperbooks-hero group flex flex-col items-center gap-8 opacity-0 md:mt-8'>
					<Link href='/dashboard' className='group flex items-center pb-4 md:overflow-hidden md:pb-10'>
						<RainbowButton className='w-auto overflow-x-clip text-sm font-semibold md:text-base'>
							<MousePointerClickIcon className='mr-3 size-6 scale-x-[-1] transition-transform duration-200 group-hover:translate-x-1' />
							Get Started
						</RainbowButton>
					</Link>

					{isMobile ? (
						<div
							ref={dashboardRef}
							className='relative aspect-auto transform-gpu overflow-hidden rounded-lg border border-border transition-transform duration-300 ease-out will-change-transform'>
							<img
								className='transform-gpu will-change-transform'
								src={theme === 'dark' ? 'dashboard-mobile-dark.png' : 'dashboard-mobile-light.png'}
								alt='hyperbooks mobile dashboard'
							/>
							<div className='absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-background via-transparent to-transparent' />
						</div>
					) : (
						<div ref={dashboardRef} className='aspect-video transform-gpu overflow-hidden rounded-lg border border-border transition-transform duration-300 ease-out will-change-transform'>
							<img className='block h-auto w-full' src={theme === 'dark' ? 'dashboard-desktop-dark.png' : 'dashboard-desktop-light.png'} alt='hyperbooks desktop dashboard' />
						</div>
					)}
				</div>
			</div>

			<img className='hyperreal-hero-bg absolute top-0 -z-50 -translate-y-1/2 opacity-0 blur-3xl' src='/bg-gradient.png' width={1024} height={1024} alt='Gradient background' aria-hidden />

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
		</section>
	);
}
