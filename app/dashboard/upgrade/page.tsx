'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { H1, P, H3 } from '@/components/ui/typography';
import { TextShimmer } from '@/components/ui/text-shimmer';
import {} from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import FlickeringGrid from '@/components/ui/flickering-grid';
import { MagicCard } from '@/components/ui/magic-card';
import { CheckCircle2Icon, CircleXIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';

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
			<Section className='mx-auto flex h-full w-full max-w-screen-lg flex-col items-center justify-center'>
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
							<H3 className='mb-2 mt-6 text-2xl md:text-3xl'>Free</H3>
							<P variant='sm'>Free forever. No credit card required.</P>
							<P className='pt-8'>Essentials to get started,</P>
							<ul className='ml-4 space-y-2 py-4'>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>10 invoices per month</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>Access to all templates</P>
								</li>
								<li className='flex items-center gap-2'>
									<CircleXIcon className='size-5' />
									<P>&apos;hyperbooks.&apos; branding</P>
								</li>
							</ul>
						</div>
					</MagicCard>
					<MagicCard className='flex h-full cursor-pointer flex-col items-center justify-between' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
						<div className='h-full p-8'>
							<Badge>Pro</Badge>
							<H3 className='mb-2 mt-6 text-2xl md:text-3xl'>
								LKR 700 <span className='text-base'>per month</span>
							</H3>
							<P variant='sm'>For small and medium businesses.</P>
							<P className='pt-8'>Everything from Starter, plus</P>
							<ul className='ml-4 space-y-2 py-4'>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>100 records/month</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>No &apos;hyperbooks.&apos; branding</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>1 custom template</P>
								</li>
							</ul>
							<div className='flex flex-col items-center justify-end pt-4'>
								<Button onClick={() => handleCheckout({ priceId: 'pri_01jkctkft82s247d8y3w6px2zj', plan: 'pro' })}>Upgrade to Pro</Button>
							</div>
						</div>
						<FlickeringGrid
							className='pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(circle_at_50%_50%,white_0,transparent_80%)]'
							squareSize={4}
							gridGap={8}
							color='#8db8a4'
							maxOpacity={0.3}
							flickerChance={0.2}
							width={1000}
							height={1000}
						/>
					</MagicCard>
					<MagicCard className='cursor-pointer flex-col items-center justify-between' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
						<div className='p-8'>
							<Badge>Ultimate</Badge>
							<H3 className='mb-2 mt-6 text-2xl md:text-3xl'>
								LKR 2400 <span className='text-base'>per month</span>
							</H3>
							<P variant='sm'>Ultimate control over your transactions.</P>
							<P className='pt-8'>Everything from Pro, plus</P>
							<ul className='ml-4 space-y-2 py-4'>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>Unlimited records/month</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>3 custom templates</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>Premium 24/7 support</P>
								</li>
							</ul>
							<div className='flex items-center justify-center pt-4'>
								<Button onClick={() => handleCheckout({ priceId: 'pri_01jmcmeb4pwkj8ajfsmd1ks9w3', plan: 'ultimate' })}>Upgrade to Ultimate</Button>
							</div>
						</div>
					</MagicCard>
				</div>

				<div>
					<P variant='sm' className='text-muted-foreground'>
						* Prices are in Sri Lankan Rupees (LKR).
					</P>
				</div>
			</Section>
		</PageWrapper>
	);
}
