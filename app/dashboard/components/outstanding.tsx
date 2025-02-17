import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangleIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/store/use-analytics';
import { cn } from '@/lib/utils';

export default function Outstanding() {
	const { analytics } = useAnalyticsStore();
	const [count, setCount] = useState(0);
	const [amount, setAmount] = useState(0);

	useEffect(() => {
		setTimeout(() => {
			setCount(analytics?.totalOutstandingCount ?? 0);
			setAmount(analytics?.totalOutstandingAmount ?? 0);
		}, 500);
	}, [analytics?.totalOutstandingCount, analytics?.totalOutstandingAmount]);
	return (
		<Card className={cn('relative z-10 bg-background/60 shadow-xl backdrop-blur-sm', count > 1 ? 'border-orange-300 dark:border-orange-300/30' : '')}>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>Outstandings</CardTitle>
				<AlertTriangleIcon className={count > 1 ? 'h-4 w-4 text-orange-500 dark:text-orange-300/50' : 'h-4 w-4 text-muted-foreground'} />
			</CardHeader>
			<CardContent>
				<NumberFlow className='text-2xl font-bold' format={{ notation: 'standard', style: 'currency', currency: 'LKR' }} value={amount} />
				<span className='flex items-center gap-2 text-sm text-muted-foreground'>
					Outstanding Invoices: <NumberFlow className='text-sm text-muted-foreground' value={count} />
					{count > 1 ? <TrendingDownIcon className='h-4 w-4 text-muted-foreground' /> : <TrendingUpIcon className='h-4 w-4 text-muted-foreground' />}
				</span>
			</CardContent>
		</Card>
	);
}
