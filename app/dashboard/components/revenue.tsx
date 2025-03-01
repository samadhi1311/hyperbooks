'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/store/use-analytics';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/use-user';

export default function Revenue() {
	const { analytics } = useAnalyticsStore();
	const { userData } = useUserStore();
	const [revenue, setRevenue] = useState(0);
	const [outstanding, setOutstanding] = useState(0);
	const [outstandingCount, setOutstandingCount] = useState(0);

	useEffect(() => {
		setTimeout(() => {
			setRevenue((analytics?.totalIncome ?? 0) - (analytics?.totalOutstandingAmount ?? 0));
			setOutstanding(analytics?.totalOutstandingAmount ?? 0);
			setOutstandingCount(analytics?.totalOutstandingCount ?? 0);
		}, 500);
	}, [analytics?.totalIncome, analytics?.totalOutstandingAmount, analytics?.totalOutstandingCount]);

	return (
		<Card
			className={cn('relative z-10 bg-background/60 shadow-none sm:shadow-md backdrop-blur-none sm:backdrop-blur-sm', outstandingCount > 1 ? 'border-orange-300 dark:border-orange-300/30' : '')}>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-0 md:pb-2'>
				<CardTitle className='text-xs font-medium md:text-sm'>Revenue</CardTitle>
				<DollarSign className='size-3 md:size-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<NumberFlow className='text-base font-bold md:text-2xl' format={{ style: 'currency', currency: 'LKR' }} value={revenue} />
				<span className='flex items-center gap-2 text-xs text-muted-foreground md:text-sm'>
					Outstanding: {userData?.currency + ' ' + outstanding.toFixed(2)}
					{outstandingCount > 1 ? <TrendingUpIcon className='size-3 md:size-4 text-muted-foreground' /> : <TrendingDownIcon className='size-3 md:size-4 text-muted-foreground' />}
				</span>
			</CardContent>
		</Card>
	);
}
