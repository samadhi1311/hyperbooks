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
		<Card className='relative z-10 bg-background/60 shadow-none backdrop-blur-none sm:shadow-md sm:backdrop-blur-sm'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-0 md:pb-2'>
				<CardTitle className='text-xs font-medium md:text-sm'>{greeting}</CardTitle>
				<HeartHandshakeIcon className='size-3 text-muted-foreground md:size-4' />
			</CardHeader>
			<CardContent>
				<div className='bg-gradient-to-r from-violet-500 to-orange-400 bg-clip-text text-base font-bold text-transparent dark:to-orange-300 md:text-2xl'>{user?.displayName}</div>
				<p className='text-xs text-muted-foreground md:text-sm'>Welcome to your hyperbooks dashboard.</p>
			</CardContent>
		</Card>
	);
}
