'use client';

import { Section } from '@/components/ui/layout';
import { H2, P } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { CloudUploadIcon, SaveAllIcon, ChartNoAxesCombinedIcon, EarthIcon, ScrollTextIcon, BrainCircuitIcon } from 'lucide-react';

export default function Features() {
	const Feature = ({ title, description, icon, index }: { title: string; description: string; icon: React.ReactNode; index: number }) => {
		return (
			<div
				className={cn(
					'flex flex-col lg:border-r py-4 md:py-8 lg:py-16 relative group/feature dark:border-neutral-800',
					(index === 0 || index === 3) && 'lg:border-l dark:border-neutral-800',
					index < 3 && 'lg:border-b dark:border-neutral-800'
				)}>
				{index < 3 && (
					<div className='pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-200/50 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800/30' />
				)}
				{index >= 3 && (
					<div className='pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-200/50 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800/30' />
				)}
				<div className='relative z-10 mb-3 px-8 text-muted-foreground md:mb-4'>{icon}</div>
				<div className='relative z-10 mb-3 px-8 text-lg font-medium text-foreground md:mb-4'>
					<div className='absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-violet-500 dark:bg-neutral-700' />
					<h3 className='font-display inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100'>{title}</h3>
				</div>
				<p className='relative z-10 px-8 text-sm text-muted-foreground'>{description}</p>
			</div>
		);
	};

	const features = [
		{
			title: 'Track income & expenses in just a few taps',
			description: 'Log your earnings and expenses fast, intuitive, and accurately. Stay on top of your finances without the hassle.',
			icon: <SaveAllIcon />,
		},
		{
			title: 'See your cash flow at a glance',
			description: 'See the bigger picture at a glance with real-time daily and monthly summaries. Know exactly where your money is going and make smarter financial decisions.',
			icon: <ChartNoAxesCombinedIcon />,
		},
		{
			title: 'Keep data always safe & backed up',
			description: 'Your financial data is protected with top-tier security and automatic backups. No worries, no data loss—just peace of mind.',
			icon: <CloudUploadIcon />,
		},
		{
			title: 'Access from any device — anywhere',
			description: `Whether you're at the office, home, or on the move, access your financial records anytime with our cloud-based platform. Stay in control, wherever you are.`,
			icon: <EarthIcon />,
		},
		{
			title: 'Professional Invoicing Made Simple',
			description: 'Create stunning, customizable invoices in seconds. Generate detailed PDF reports with ease and impress clients with a seamless billing experience.',
			icon: <ScrollTextIcon />,
		},
		{
			title: 'AI-Powered insights and suggestions (Coming soon.)',
			description: 'Unlock smarter insights with AI-driven analytics and suggestions. Detect patterns, optimize cash flow, and get proactive recommendations tailored to your business.',
			icon: <BrainCircuitIcon />,
		},
	];

	return (
		<Section>
			<div className='flex scroll-my-16 flex-col items-center gap-4 py-8 text-center lg:py-16' id='features'>
				<H2>Stay organized, stay in control.</H2>
				<P className='max-w-2xl text-muted-foreground'>
					Track finances effortlessly, access records anywhere, and keep data secure. Create invoices easily and gain AI-driven insights for smarter decisions.
				</P>
			</div>
			<div className='relative z-10 mx-auto grid grid-cols-1 py-4 md:grid-cols-2 md:py-8 lg:grid-cols-3 lg:py-16'>
				{features.map((feature, index) => (
					<Feature key={feature.title} {...feature} index={index} />
				))}
			</div>
		</Section>
	);
}
