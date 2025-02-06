'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import NumberFlow from '@number-flow/react';

export default function Chart() {
	const { user } = useAuth();
	const [chartData, setChartData] = useState<any[]>([]);

	useEffect(() => {
		if (!user) return;
		const getLast30DaysInvoices = async () => {
			const userDocRef = doc(db, 'users', user.uid);
			const userSnap = await getDoc(userDocRef);

			if (userSnap.exists()) {
				const last30DaysInvoices = userSnap.data().last30DaysInvoices || {};

				// Convert Firestore data into chart format
				const formattedData = Array.from({ length: 30 }, (_, i) => {
					const currentDay = new Date();
					const targetDay = subDays(currentDay, 29 - i); // Get the exact date for this index
					const dateKey = format(targetDay, 'yyyy-MM-dd'); // Use targetDay here

					// Ensure data is placed on the right date
					return {
						date: format(targetDay, 'MMM dd'), // Format the date as 'MMM dd' (e.g., Feb 07)
						revenue: last30DaysInvoices[dateKey] || 0,
					};
				});

				setChartData(formattedData);
			}
		};

		getLast30DaysInvoices();
	}, [user]);

	const chartConfig = {
		revenue: {
			label: 'Revenue',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	return (
		<Card className='h-full'>
			<CardHeader>
				<CardTitle>Statistics</CardTitle>
				<CardDescription>Your revenue in the last 30 days</CardDescription>
			</CardHeader>
			<CardContent className='h-full'>
				{chartData.length > 0 ? (
					<ChartContainer config={chartConfig}>
						<BarChart accessibilityLayer data={chartData}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey='date' tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value} />
							<ChartTooltip
								cursor={false}
								formatter={(value) => <NumberFlow value={value as number} className='text-base' prefix='LKR ' />}
								labelClassName='text-base font-medium'
								content={<ChartTooltipContent className='px-4 py-2' nameKey='revenue' />}
							/>
							<Bar dataKey='revenue' fill='var(--color-revenue)' radius={0} />
						</BarChart>
					</ChartContainer>
				) : (
					<div className='flex h-full items-center justify-center'>
						<p className='text-sm text-muted-foreground'>No data available for the last 30 days.</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
