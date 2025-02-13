'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/use-user';

export default function Revenue() {
	const { userData } = useUserStore();
	const [amount, setAmount] = useState(0);
	const [revenue, setRevenue] = useState(0);

	useEffect(() => {
		setTimeout(() => {
			setAmount(userData?.totalIncome ?? 0);
			setRevenue(userData?.totalRevenue ?? 0);
		}, 500);
	}, [userData?.totalIncome, userData?.totalRevenue]);

	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>Revenue</CardTitle>
				<DollarSign className='h-4 w-4 text-muted-foreground' />
			</CardHeader>
			<CardContent>
				<NumberFlow className='text-2xl font-bold' format={{ notation: 'standard', style: 'currency', currency: 'LKR' }} value={revenue} />
				<span className='flex items-center gap-2 text-sm text-muted-foreground'>
					Total Invoiced: <NumberFlow className='text-sm text-muted-foreground' format={{ notation: 'standard', style: 'currency', currency: 'LKR' }} value={amount} />
					{amount === revenue ? <TrendingUpIcon className='h-4 w-4 text-muted-foreground' /> : <TrendingDownIcon className='h-4 w-4 text-muted-foreground' />}
				</span>
			</CardContent>
		</Card>
	);
}
