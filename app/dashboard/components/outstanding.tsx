import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangleIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/use-user';

export default function Outstanding() {
	const { userData } = useUserStore();
	const [count, setCount] = useState(0);
	const [amount, setAmount] = useState(0);

	useEffect(() => {
		setTimeout(() => {
			setCount(userData?.totalOutstandingCount ?? 0);
			setAmount(userData?.totalOutstandingAmount ?? 0);
		}, 500);
	}, [userData?.totalOutstandingCount, userData?.totalOutstandingAmount]);
	return (
		<Card className={count > 1 ? 'border-orange-300 dark:border-orange-300/30' : ''}>
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
