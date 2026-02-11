'use client';

import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { Section } from '@/components/ui/layout';

export default function Payment() {
	const [paddle, setPaddle] = useState<Paddle>();
	const { theme } = useTheme();
	const { user } = useAuth();

	useEffect(() => {
		initializePaddle({
			environment: 'sandbox',
			token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
		}).then((paddle) => setPaddle(paddle));
	}, []);

	const handleCheckout = () => {
		if (!paddle || !user?.email) return alert('Paddle not initialized');

		paddle.Checkout.open({
			items: [{ priceId: 'pri_01jkctkft82s247d8y3w6px2zj', quantity: 1 }],
			customer: {
				email: user.email,
			},
			settings: {
				allowLogout: false,
				displayMode: 'overlay',
				theme: theme === 'dark' ? 'dark' : 'light',
				variant: 'multi-page',
				successUrl: 'http://localhost:3000/dashboard/profile/subscribe/thank-you',
			},
			customData: {
				user_id: user.uid,
				email: user.email,
			},
		});
	};

	return (
		<Section>
			<Button onClick={handleCheckout}>Subscribe</Button>
		</Section>
	);
}
