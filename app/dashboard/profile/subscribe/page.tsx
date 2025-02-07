'use client';

import { Section } from '@/components/ui/layout';
import { useEffect } from 'react';
import Payment from './components/payment';

export default function Subscription() {
	useEffect(() => {}, []);
	return (
		<Section>
			<Payment />
		</Section>
	);
}
