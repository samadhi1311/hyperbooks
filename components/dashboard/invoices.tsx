import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollTextIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { useEffect, useState } from 'react';
import { useAnalyticsStore } from '@/store/use-analytics';

export default function Invoices() {
	const { analytics } = useAnalyticsStore();
	const [count, setCount] = useState(0);
	const [outstanding, setOutstanding] = useState(0);

	useEffect(() => {
		setTimeout(() => {
			setCount(analytics?.totalInvoiceCount ?? 0);
			setOutstanding(analytics?.totalOutstandingCount ?? 0);
		}, 500);
	}, [analytics?.totalInvoiceCount, analytics?.totalOutstandingCount]);
	return (
		<Card className='relative z-10 bg-background/60 shadow-none sm:shadow-md backdrop-blur-none sm:backdrop-blur-sm'>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-0 md:pb-2'>
				<CardTitle className='text-xs font-medium md:text-sm'>Completed Invoices</CardTitle>
				<ScrollTextIcon className='size-3 text-muted-foreground md:size-4' />
			</CardHeader>
			<CardContent>
				<NumberFlow className='text-base font-bold md:text-2xl' value={count - outstanding} />
				<span className='flex items-center gap-2 text-xs text-muted-foreground md:text-sm'>
					Total Invoices: <p className='text-sm text-muted-foreground'>{count}</p>
					{outstanding > 1 ? <TrendingDownIcon className='size-3 md:size-4 text-muted-foreground' /> : <TrendingUpIcon className='size-3 md:size-4 text-muted-foreground' />}
				</span>
			</CardContent>
		</Card>
	);
}
