'use client';

import { cn } from '@/lib/utils';

function PageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
	return <main className={cn('max-w-screen-2xl w-full mx-auto px-8 2xl:px-0 min-h-svh', className)}>{children}</main>;
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
