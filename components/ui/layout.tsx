'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

function PageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<motion.main
			initial={{ opacity: 0, y: 25 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
			className={cn('max-w-screen-2xl w-full mx-auto px-4 2xl:px-0 min-h-svh', className)}>
			{children}
		</motion.main>
	);
}

function Section({ children, className, variant = 'normal', ref }: { children: React.ReactNode; className?: string; variant?: 'normal' | 'main'; ref?: React.Ref<HTMLDivElement> }) {
	const variants = {
		normal: 'py-16',
		main: 'py-0',
	}[variant];
	return (
		<section ref={ref} className={cn(variants, className)}>
			{children}
		</section>
	);
}

export { PageWrapper, Section };
