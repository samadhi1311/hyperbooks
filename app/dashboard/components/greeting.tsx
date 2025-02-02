'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfileStore } from '@/store/use-profile';
import { HeartHandshakeIcon } from 'lucide-react';

export default function Greeting() {
	const { profile } = useProfileStore();
	const hour = new Date().getHours();
	let greeting = '';

	if (hour > 0 && hour < 12) {
		greeting = 'Good Morning!';
	} else if (hour > 12 && hour < 16) {
		greeting = 'Good Afternoon!';
	} else if (hour > 16 && hour < 21) {
		greeting = 'Good Evening!';
	} else {
		greeting = 'Good Night!';
	}

	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>Hello {profile?.name},</CardTitle>
				<HeartHandshakeIcon className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{greeting}</div>
			</CardContent>
		</Card>
	);
}
