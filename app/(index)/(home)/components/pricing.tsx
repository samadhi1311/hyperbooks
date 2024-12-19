'use client';

import { Section } from '@/components/ui/layout';
import { H2, H3, P } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import FlickeringGrid from '@/components/ui/flickering-grid';
import { MagicCard } from '@/components/ui/magic-card';
import { CheckCircle2Icon, CircleXIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Pricing() {
	const { theme } = useTheme();
	return (
		<Section>
			<div className='flex flex-col items-center gap-4 py-8' id='pricing'>
				<H2>Flexible Plans to Fit Every Business.</H2>
				<P className='max-w-2xl text-center text-neutral-600 dark:text-neutral-400'>
					Plans that grow with you! Start free, upgrade when you&apos;re ready, and get all the tools to keep your business thriving.
				</P>
			</div>

			<div className='grid w-full grid-cols-1 gap-8 py-16 lg:grid-cols-3'>
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
				<MagicCard className='cursor-pointer flex-col items-center justify-center' gradientColor={theme === 'dark' ? '#202020' : '#dfdfdf'}>
					<div className='p-8'>
						<Badge>Pro</Badge>
						<H3 className='mb-2 mt-6 text-2xl md:text-3xl'>
							LKR 700 <span className='text-base'>per month</span>
						</H3>
						<P variant='sm'>For small and medium businesses.</P>
						<P className='pt-8'>Everything from Starter plus,</P>
						<ul className='ml-4 space-y-2 py-4'>
							<li className='flex items-center gap-2'>
								<CheckCircle2Icon className='size-5 text-emerald-500' />
								<P>1000 invoices per month</P>
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
						<Badge>Enterprise</Badge>
						<H3 className='mb-2 mt-6 text-2xl md:text-3xl'>
							LKR 2400 <span className='text-base'>per month</span>
						</H3>
						<P variant='sm'>Take the ultimate control over your invoices.</P>
						<P className='pt-8'>Everything from Pro plus,</P>
						<ul className='ml-4 space-y-2 py-4'>
							<li className='flex items-center gap-2'>
								<CheckCircle2Icon className='size-5 text-emerald-500' />
								<P>Unlimited invoices per month</P>
							</li>
							<li className='flex items-center gap-2'>
								<CheckCircle2Icon className='size-5 text-emerald-500' />
								<P>Unlimited Custom templates</P>
							</li>
							<li className='flex items-center gap-2'>
								<CheckCircle2Icon className='size-5 text-emerald-500' />
								<P>Premium 24/7 support</P>
							</li>
						</ul>
					</div>
				</MagicCard>
			</div>
		</Section>
	);
}
