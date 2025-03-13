'use client';

import { Section } from '@/components/ui/layout';
import { H2, H3, P } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { MagicCard } from '@/components/ui/magic-card';
import { CheckCircle2Icon, CircleXIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Pricing() {
	const { theme } = useTheme();
	const starterPerks = [
		'Total of 10 records per month',
		'Select any free templates from the library',
		'20 invoice exports per month',
		'Daily analytics for the last 30 days.',
		'Monthly analytics for all time.',
		'hyperbooks branding.',
		'No AI Powered Insights.',
	];

	const proPerks = [
		'Total of 50 records per month',
		'Unlimited invoice exports',
		'Daily analytics for the last 90 days',
		'Monthly analytics for all time',
		'AI-Powered Insights',
		'Custom-made invoice template',
		'No hyperreal banding',
	];

	const ultimatePerks = [
		'Total of 1000 records per month',
		'Unlimited invoice exports',
		'Daily analytics for the last 365 days',
		'Monthly analytics for all time',
		'AI-Powered Insights',
		'Custom-made invoice template',
		'No hyperreal banding',
	];

	return (
		<Section>
			<div className='flex scroll-my-16 flex-col items-center gap-4 py-8 text-center lg:py-16' id='pricing'>
				<H2>Flexible Plans to Fit Every Business.</H2>
				<P className='max-w-2xl text-muted-foreground'>Plans that grow with you! Start free, upgrade when you&apos;re ready, and get all the tools to keep your business thriving.</P>
			</div>

			<div className='md: grid w-full grid-cols-1 gap-4 py-8 md:grid-cols-3 lg:grid-cols-3 lg:gap-8 lg:py-16'>
				<MagicCard className='flex-col items-center justify-center' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
					<div className='relative flex flex-col gap-8 p-8'>
						<div className='flex-1 space-y-4'>
							<Badge>Starter</Badge>

							<H3 className='mt-4 flex items-baseline'>
								<span className='text-2xl font-semibold tracking-tight md:text-3xl'>$0</span>
								<span className='ml-1 text-base font-semibold md:text-xl'>/month</span>
							</H3>
							<p className='mt-6 text-sm text-muted-foreground md:text-base'>Free forever. No credit card required.</p>

							<ul role='list' className='mt-6 space-y-6 border-t border-border pt-6'>
								<span className='text-sm font-semibold text-muted-foreground md:text-base'>What&apos;s included?</span>

								{starterPerks.map((perk, index) => (
									<li className='flex' key={index}>
										<div className='inline-flex items-center'>
											{index < starterPerks.length - 2 ? <CheckCircle2Icon className='size-4 md:size-6' /> : <CircleXIcon className='size-4 text-muted-foreground md:size-6' />}
										</div>
										<p className='ml-3 text-sm md:text-base'>{perk}</p>
									</li>
								))}
							</ul>
						</div>
					</div>
				</MagicCard>
				<MagicCard className='flex-col items-center justify-center border-2 border-border bg-muted dark:bg-muted' gradientColor={theme === 'dark' ? '#353535' : '#cfcfcf'}>
					<div className='relative flex flex-col gap-8 p-8 text-foreground dark:text-foreground'>
						<div className='flex-1 space-y-4'>
							<Badge>Pro</Badge>

							<H3 className='mt-4 flex items-baseline'>
								<span className='text-2xl font-semibold tracking-tight md:text-3xl'>$3.99</span>
								<span className='ml-1 text-base font-semibold md:text-xl'>/month</span>
							</H3>
							<p className='mt-6 text-sm text-muted-foreground md:text-base'>The essentials for freelancers.</p>

							<ul role='list' className='mt-6 space-y-6 border-t border-muted-foreground pt-6 dark:border-muted-foreground'>
								<span className='text-sm font-semibold text-muted-foreground md:text-base'>What&apos;s included?</span>

								{proPerks.map((perk, index) => (
									<li className='flex' key={index}>
										<div className='inline-flex items-center'>
											<CheckCircle2Icon className='size-4 md:size-6' />
										</div>
										<P className='ml-3 text-sm md:text-base'>{perk}</P>
									</li>
								))}
							</ul>
						</div>
					</div>
				</MagicCard>
				<MagicCard className='flex-col items-center justify-center' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
					<div className='relative flex flex-col gap-8 p-8'>
						<div className='flex-1 space-y-4'>
							<Badge>Ultimate</Badge>

							<H3 className='mt-4 flex items-baseline'>
								<span className='text-2xl font-semibold tracking-tight md:text-3xl'>$9.99</span>
								<span className='ml-1 text-base font-semibold md:text-xl'>/month</span>
							</H3>
							<p className='mt-6 text-sm text-muted-foreground md:text-base'>The Ultimate control over your transactions.</p>

							<ul role='list' className='mt-6 space-y-6 border-t border-border pt-6'>
								<span className='text-sm font-semibold text-muted-foreground md:text-base'>What&apos;s included?</span>

								{ultimatePerks.map((perk, index) => (
									<li className='flex' key={index}>
										<div className='inline-flex items-center'>
											<CheckCircle2Icon className='size-4 md:size-6' />
										</div>
										<P className='ml-3 text-sm md:text-base'>{perk}</P>
									</li>
								))}
							</ul>
						</div>
					</div>
				</MagicCard>
			</div>
		</Section>
	);
}
