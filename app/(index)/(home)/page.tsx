'use client';

import { Page } from '@/components/layout';
import Hero from './components/hero';
import Features from './components/features';
import Pricing from './components/pricing';

export default function Home() {
	return (
		<Page>
			<Hero />
			<Features />
			<Pricing />
		</Page>
	);
}
