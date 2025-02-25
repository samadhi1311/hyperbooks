'use client';

import { Section } from '@/components/ui/layout';
import { H2, P } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { PaletteIcon, PaintbrushIcon, CloudUploadIcon, Share2Icon, MonitorSmartphoneIcon, SparklesIcon } from 'lucide-react';

export default function Features() {
	const Feature = ({ title, description, icon, index }: { title: string; description: string; icon: React.ReactNode; index: number }) => {
		return (
			<div
				className={cn(
					'flex flex-col lg:border-r py-16 relative group/feature dark:border-neutral-800',
					(index === 0 || index === 3) && 'lg:border-l dark:border-neutral-800',
					index < 3 && 'lg:border-b dark:border-neutral-800'
				)}>
				{index < 3 && (
					<div className='pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-200/50 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800/30' />
				)}
				{index >= 3 && (
					<div className='pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-200/50 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800/30' />
				)}
				<div className='relative z-10 mb-4 px-8 text-muted-foreground'>{icon}</div>
				<div className='relative z-10 mb-4 px-8 text-lg font-medium text-foreground'>
					<div className='absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-violet-500 dark:bg-neutral-700' />
					<h3 className='font-display inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100'>{title}</h3>
				</div>
				<p className='relative z-10 px-8 text-sm text-muted-foreground'>{description}</p>
			</div>
		);
	};

	const features = [
		{
			title: 'Beautifully designed templates',
			description: 'Choose from dozens of professionally designed templates',
			icon: <PaletteIcon />,
		},
		{
			title: 'Make it yours',
			description: 'Build your own templates from blocks to match your unique style and business needs.',
			icon: <PaintbrushIcon />,
		},
		{
			title: 'Save to Cloud',
			description: 'Save invoices securely to the cloud and access them anytime, from anywhere.',
			icon: <CloudUploadIcon />,
		},
		{
			title: 'Export and Share',
			description: 'Generate and download invoices in high-quality PDF format with a single click.',
			icon: <Share2Icon />,
		},
		{
			title: 'Multi-Platform Access',
			description: 'Access and edit your invoices across devices – desktop, tablet, or mobile.',
			icon: <MonitorSmartphoneIcon />,
		},
		{
			title: 'Get Started for Free',
			description: 'Create and export invoices for free. No credit card required.',
			icon: <SparklesIcon />,
		},
	];

	return (
		<Section>
			<div className='flex scroll-my-16 flex-col items-center gap-4 py-8' id='features'>
				<H2>Everything You Need to Create Professional Invoices.</H2>
				<P className='max-w-2xl text-center text-muted-foreground'>
					Say goodbye to boring invoices! With customizable templates, cloud storage, and more, we make invoicing fun and effortless—just the way it should be.
				</P>
			</div>
			<div className='relative z-10 mx-auto grid grid-cols-1 py-16 md:grid-cols-2 lg:grid-cols-3'>
				{features.map((feature, index) => (
					<Feature key={feature.title} {...feature} index={index} />
				))}
			</div>
		</Section>
	);
}
