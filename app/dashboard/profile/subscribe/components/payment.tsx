'use client';

import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function Payment() {
	const [paddle, setPaddle] = useState<Paddle>();
	const { theme } = useTheme();

	useEffect(() => {
		initializePaddle({
			environment: 'sandbox',
			token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
		}).then((paddle) => setPaddle(paddle));
	}, []);

	const handleCheckout = () => {
		if (!paddle) return alert('Paddle not initialized');

		paddle.Checkout.open({
			items: [{ priceId: 'pri_01jkctkft82s247d8y3w6px2zj', quantity: 1 }],
			settings: {
				displayMode: 'overlay',
				theme: theme === 'dark' ? 'dark' : 'light',
				successUrl: 'http://localhost:3000/dashboard/profile/subscribe/thank-you',
			},
		});
	};

	return (
		<>
			<Button onClick={handleCheckout}>Subscribe</Button>
		</>
	);
}
