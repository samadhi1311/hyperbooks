'use client';

import { PageWrapper } from '@/components/ui/layout';
import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import Pricing from '@/components/home/pricing';
import CTA from '@/components/home/cta';

export default function Home() {
	return (
		<div className='relative w-screen overflow-hidden'>
			<PageWrapper>
				<Hero />
				<div
					className='hyperbooks-gradient-blob-1 pointer-events-none absolute left-0 -z-50 hidden aspect-square w-2/3 max-w-5xl -translate-x-1/2 opacity-20 dark:opacity-5 md:block'
					aria-hidden
				/>
				<Features />
				<div
					className='hyperbooks-gradient-blob-2 pointer-events-none absolute right-0 -z-50 hidden aspect-square w-2/3 max-w-5xl translate-x-1/2 translate-y-1/2 opacity-30 dark:opacity-15 md:block'
					aria-hidden
				/>
				<Pricing />
				<CTA />
			</PageWrapper>
		</div>
	);
}
