'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { HeartHandshakeIcon } from 'lucide-react';

export default function Greeting() {
	const { user } = useAuth();
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
				<CardTitle className='text-sm font-medium'>{greeting}</CardTitle>
				<HeartHandshakeIcon className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<div className='bg-gradient-to-r from-violet-500 to-orange-400 bg-clip-text text-2xl font-bold text-transparent dark:to-orange-300'>{user?.displayName}</div>
				<p className='text-sm text-muted-foreground'>Welcome to your hyperbooks dashboard.</p>
			</CardContent>
		</Card>
	);
}
