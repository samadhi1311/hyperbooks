'use client';

import { cn } from '@/lib/utils';

function PageWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
	return <main className={cn('max-w-screen-2xl mx-auto px-8 min-h-svh', className)}>{children}</main>;
}

function Section({ children, className, variant = 'normal' }: { children: React.ReactNode; className?: string; variant?: 'normal' | 'main' }) {
	const variants = {
		normal: 'py-16',
		main: 'py-0',
	}[variant];
	return <section className={cn(variants, className)}>{children}</section>;
}

export { PageWrapper, Section };
