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
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>Completed Invoices</CardTitle>
				<ScrollTextIcon className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<NumberFlow className='text-2xl font-bold' value={count - outstanding} />
				<span className='flex items-center gap-2 text-sm text-muted-foreground'>
					Total Invoices: <NumberFlow className='text-sm text-muted-foreground' value={count} />
					{outstanding > 1 ? <TrendingDownIcon className='h-4 w-4 text-muted-foreground' /> : <TrendingUpIcon className='h-4 w-4 text-muted-foreground' />}
				</span>
			</CardContent>
		</Card>
	);
}
