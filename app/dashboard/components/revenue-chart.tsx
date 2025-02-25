'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { ChartColumnIncreasingIcon, Loader2Icon } from 'lucide-react';
import { useAnalyticsStore } from '@/store/use-analytics';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Chart() {
	const [selectedPeriod, setSelectedPeriod] = useState('lastMonth');
	const [chartData, setChartData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const { analytics } = useAnalyticsStore();

	useEffect(() => {
		if (!analytics) return;
		setLoading(true);

		let data: any[] = [];
		const now = new Date();

		if (selectedPeriod === 'lastWeek') {
			data = Array.from({ length: 7 }, (_, i) => {
				const targetDay = subDays(now, 6 - i);
				const dateKey = format(targetDay, 'yyyy-MM-dd');
				return {
					date: format(targetDay, 'MMM dd'),
					income: analytics.last30DaysInvoices?.[dateKey] || 0,
					expense: analytics.last30DaysExpenses?.[dateKey] || 0,
				};
			});
		} else if (selectedPeriod === 'lastTwoWeeks') {
			data = Array.from({ length: 14 }, (_, i) => {
				const targetDay = subDays(now, 13 - i);
				const dateKey = format(targetDay, 'yyyy-MM-dd');
				return {
					date: format(targetDay, 'MMM dd'),
					income: analytics.last30DaysInvoices?.[dateKey] || 0,
					expense: analytics.last30DaysExpenses?.[dateKey] || 0,
				};
			});
		} else if (selectedPeriod === 'lastMonth') {
			data = Array.from({ length: 30 }, (_, i) => {
				const targetDay = subDays(now, 29 - i);
				const dateKey = format(targetDay, 'yyyy-MM-dd');
				return {
					date: format(targetDay, 'MMM dd'),
					income: analytics.last30DaysInvoices?.[dateKey] || 0,
					expense: analytics.last30DaysExpenses?.[dateKey] || 0,
				};
			});
		} else if (selectedPeriod === 'allTime') {
			const monthlyData = Object.keys(analytics.monthlyIncome || {}).map((month) => ({
				date: month,
				income: analytics.monthlyIncome[month] || 0,
				expense: analytics.monthlyExpenses?.[month] || 0,
			}));

			if (monthlyData.length === 1) {
				const firstMonth = monthlyData[0].date;
				const previousMonth = format(subDays(new Date(`${firstMonth}-01`), 1), 'yyyy-MM');
				monthlyData.unshift({
					date: previousMonth,
					income: 0,
					expense: 0,
				});
			}

			data = monthlyData;
		}

		setChartData(data);
		setLoading(false);
	}, [analytics, selectedPeriod]);

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
		<div className='h-full rounded-lg bg-gradient-to-br from-orange-200/20 via-muted/80 to-violet-300/20 p-px'>
			<div className='z-10 flex h-full min-h-[300px] w-full flex-col justify-between overflow-hidden rounded-lg bg-background/90 p-4 shadow-xl md:p-6 lg:p-8'>
				<div className='mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row'>
					<div className='space-y-2'>
						<div className='flex items-center gap-3 text-xl font-medium'>
							<ChartColumnIncreasingIcon className='size-5' />
							Statistics
						</div>
						<div className='text-sm text-muted-foreground'>
							Your income and expenses in the
							{selectedPeriod === 'lastWeek' ? ' last week' : ''}
							{selectedPeriod === 'lastTwoWeeks' ? ' last two weeks' : ''}
							{selectedPeriod === 'lastMonth' ? ' last month' : ''}
							{selectedPeriod === 'allTime' ? ' all time' : ''}
						</div>
					</div>
					<div>
						<Select onValueChange={(value) => setSelectedPeriod(value)}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Time period' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='lastWeek'>Last week</SelectItem>
								<SelectItem value='lastTwoWeeks'>Last two weeks</SelectItem>
								<SelectItem value='lastMonth'>Last month</SelectItem>
								<SelectItem value='allTime'>All time</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className='relative'>
					<ChartContainer config={chartConfig} className='h-full min-h-[400px] w-full'>
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
							<ChartLegend content={<ChartLegendContent />} />
						</AreaChart>
					</ChartContainer>
					{loading && chartData.length === 0 && (
						<div className='absolute inset-0 flex items-center justify-center bg-transparent'>
							<Loader2Icon className='animate-spin text-muted-foreground' />
						</div>
					)}

					{chartData.length === 0 && !loading && (
						<div className='absolute inset-0 flex items-center justify-center bg-transparent'>
							<p className='text-sm text-muted-foreground'>No data available.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
