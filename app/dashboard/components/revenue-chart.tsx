'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { ChartColumnIncreasingIcon, Loader2Icon } from 'lucide-react';
import { useAnalyticsStore } from '@/store/use-analytics';

export default function Chart() {
	const { user } = useAuth();
	const [chartData, setChartData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const { analytics } = useAnalyticsStore();

	useEffect(() => {
		if (!user) return;
		const getLast30DaysData = async () => {
			setLoading(true);

			const last30DaysInvoices = analytics.last30DaysInvoices;
			const last30DaysExpenses = analytics.last30DaysExpenses;

			const formattedData = Array.from({ length: 30 }, (_, i) => {
				const currentDay = new Date();
				const targetDay = subDays(currentDay, 29 - i);
				const dateKey = format(targetDay, 'yyyy-MM-dd');

				return {
					date: format(targetDay, 'MMM dd'),
					income: last30DaysInvoices[dateKey] || 0,
					expense: last30DaysExpenses[dateKey] || 0,
				};
			});

			setChartData(formattedData);
			setLoading(false);
		};

		getLast30DaysData();
	}, [user]);

	const chartConfig = {
		income: {
			label: 'Income',
			color: 'hsl(var(--chart-2))',
		},
		expense: {
			label: 'Expense',
			color: 'hsl(var(--chart-3))',
		},
	} satisfies ChartConfig;

	return (
		<Card className='h-full min-h-[300px]'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3'>
					<ChartColumnIncreasingIcon className='size-8' />
					Statistics
				</CardTitle>
				<CardDescription>Your income and expenses in the last 30 days</CardDescription>
			</CardHeader>
			<CardContent className=''>
				<ChartContainer config={chartConfig} className='h-full min-h-[300px] w-full'>
					<AreaChart accessibilityLayer data={chartData} className='h-full'>
						<CartesianGrid vertical={false} />
						<XAxis dataKey='date' tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value} />
						<ChartTooltip
							content={
								<ChartTooltipContent
									className='max-w-fit'
									formatter={(value, name) => (
										<>
											<div
												className='h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]'
												style={
													{
														'--color-bg': `var(--color-${name})`,
													} as React.CSSProperties
												}
											/>
											{chartConfig[name as keyof typeof chartConfig]?.label || name}
											<div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
												<span className='font-normal text-muted-foreground'>LKR </span>
												{value}
											</div>
										</>
									)}
								/>
							}
							cursor={false}
							defaultIndex={1}
						/>
						<defs>
							<linearGradient id='fillIncome' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='var(--color-income)' stopOpacity={0.8} />
								<stop offset='95%' stopColor='var(--color-income)' stopOpacity={0.1} />
							</linearGradient>
							<linearGradient id='fillExpense' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='5%' stopColor='var(--color-expense)' stopOpacity={0.8} />
								<stop offset='95%' stopColor='var(--color-expense)' stopOpacity={0.1} />
							</linearGradient>
						</defs>
						<Area dataKey='expense' type='monotone' fill='url(#fillExpense)' fillOpacity={0.4} stroke='var(--color-expense)' stackId='a' />
						<Area dataKey='income' type='monotone' fill='url(#fillIncome)' fillOpacity={0.4} stroke='var(--color-income)' stackId='a' />
					</AreaChart>
				</ChartContainer>
				{loading && (
					<div className='absolute inset-0 flex items-center justify-center bg-background'>
						<Loader2Icon className='animate-spin text-muted-foreground' />
					</div>
				)}

				{chartData.length === 0 && !loading && (
					<div className='absolute inset-0 flex items-center justify-center bg-background'>
						<p className='text-sm text-muted-foreground'>No data available.</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
