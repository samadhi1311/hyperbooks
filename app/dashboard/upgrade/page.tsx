'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { H1, P, H3 } from '@/components/ui/typography';
import { TextShimmer } from '@/components/ui/text-shimmer';
import {} from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import FlickeringGrid from '@/components/ui/flickering-grid';
import { MagicCard } from '@/components/ui/magic-card';
import { CheckCircle2Icon, CircleXIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Upgrade() {
	const { theme } = useTheme();
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
									<P>30 invoices per month</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>Access to all templates</P>
								</li>
								<li className='flex items-center gap-2'>
									<CircleXIcon className='size-5' />
									<P>&apos;hyperbooks.&apos; branding</P>
								</li>
								<li className='flex items-center gap-2'>
									<CircleXIcon className='size-5' />
									<P>No custom styling</P>
								</li>
								<li className='flex items-center gap-2'>
									<CircleXIcon className='size-5' />
									<P>No Custom templates</P>
								</li>
							</ul>
						</div>
					</MagicCard>
					<MagicCard className='flex cursor-pointer flex-col items-center justify-center' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
						<div className='p-8'>
							<Badge>Pro</Badge>
							<H3 className='mb-2 mt-6 text-2xl md:text-3xl'>
								LKR 700 <span className='text-base'>per month</span>
							</H3>
							<P variant='sm'>For small and medium businesses.</P>
							<P className='pt-8'>Everything from Starter, plus</P>
							<ul className='ml-4 space-y-2 py-4'>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>300 invoices per month</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>Custom styles</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>No &apos;hyperbooks.&apos; branding</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>3 Custom templates</P>
								</li>
							</ul>
						</div>
						<FlickeringGrid
							className='absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(circle_at_50%_50%,white_0,transparent_80%)]'
							squareSize={4}
							gridGap={8}
							color='#8db8a4'
							maxOpacity={0.3}
							flickerChance={0.2}
							width={1000}
							height={1000}
						/>
					</MagicCard>
					<MagicCard className='cursor-pointer flex-col items-center justify-center' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
						<div className='p-8'>
							<Badge>Ultimate</Badge>
							<H3 className='mb-2 mt-6 text-2xl md:text-3xl'>
								LKR 2400 <span className='text-base'>per month</span>
							</H3>
							<P variant='sm'>Take the ultimate control over your invoices.</P>
							<P className='pt-8'>Everything from Pro, plus</P>
							<ul className='ml-4 space-y-2 py-4'>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>3000 invoices per month</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>10 Custom templates</P>
								</li>
								<li className='flex items-center gap-2'>
									<CheckCircle2Icon className='size-5 text-emerald-500' />
									<P>Premium 24/7 support</P>
								</li>
							</ul>
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
