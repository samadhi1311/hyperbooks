'use client';

import { Page } from '@/components/ui/layout';
import Hero from './components/hero';
import Features from './components/features';
import Pricing from './components/pricing';
import CTA from './components/cta';

export default function Home() {
	return (
		<Page>
			<Hero />
			<Features />
			<Pricing />
			<CTA />
		</Page>
	);
}
