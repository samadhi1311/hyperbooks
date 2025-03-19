'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { H1, P, H3 } from '@/components/ui/typography';
import { TextShimmer } from '@/components/ui/text-shimmer';
import {} from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { MagicCard } from '@/components/ui/magic-card';
import { CheckCircle2Icon, CircleXIcon, SparkleIcon, SparklesIcon } from 'lucide-react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { IconButton } from '@/components/ui/icon-button';
import { starterPerks, proPerks, ultimatePerks } from '@/lib/constants';

export default function Upgrade() {
	const [paddle, setPaddle] = useState<Paddle>();
	const { theme } = useTheme();
	const { user } = useAuth();
	useEffect(() => {
		initializePaddle({
			environment: process.env.NEXT_PUBLIC_PADDLE_ENV! as 'production' | 'sandbox',
			token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
		}).then((paddle) => setPaddle(paddle));
	}, []);

	const handleCheckout = ({ priceId, plan }: { priceId: string; plan: string }) => {
		if (!paddle || !user) return alert('Paddle not initialized');
		paddle.Checkout.open({
			items: [
				{
					priceId: priceId,
					quantity: 1,
				},
			],
			settings: {
				displayMode: 'overlay',
				theme: theme === 'dark' ? 'dark' : 'light',
				successUrl: 'http://localhost:3000/dashboard/plan-upgraded',
				variant: 'multi-page',
				allowLogout: false,
			},
			customData: {
				user_id: user.uid,
				plan: plan,
			},
			customer: {
				email: user.email!,
			},
		});
	};

	return (
		<PageWrapper>
			<Section className='mx-auto flex h-full w-full flex-col items-center justify-center'>
				<div className='space-y-4 text-center'>
					<H1>
						<TextShimmer className='py-1.5' duration={3}>
							Upgrade Your Plan
						</TextShimmer>
					</H1>
					<P className='text-muted-foreground'>Upgrade now and unlock the full potential of hyperbooks.</P>
				</div>

				<div className='grid w-full grid-cols-1 gap-8 py-16 md:grid-cols-3'>
					<MagicCard className='cursor-pointer flex-col items-center justify-center' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
						<div className='p-8'>
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
					</MagicCard>
					<MagicCard className='flex h-full cursor-pointer flex-col items-center justify-between' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
						<div className='h-full p-8'>
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
							<div className='flex flex-col items-center justify-center pt-8'>
								<IconButton icon={<SparkleIcon />} onClick={() => handleCheckout({ priceId: 'pri_01jnn26q26hsz815nwa7fdzke1', plan: 'pro' })}>
									Upgrade to Pro
								</IconButton>
							</div>
						</div>
					</MagicCard>
					<MagicCard className='cursor-pointer flex-col items-center justify-between' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
						<div className='p-8'>
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

							<div className='flex items-center justify-center pt-8'>
								<IconButton icon={<SparklesIcon />} onClick={() => handleCheckout({ priceId: 'pri_01jnn28fcbdyda07k4k0rm1yx2', plan: 'ultimate' })}>
									Upgrade to Ultimate
								</IconButton>
							</div>
						</div>
					</MagicCard>
				</div>

				<div>
					<P variant='sm' className='text-muted-foreground'>
						* Prices are in United States Dollar (USD).
					</P>
				</div>
			</Section>
		</PageWrapper>
	);
}
