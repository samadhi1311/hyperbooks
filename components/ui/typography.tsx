'use client';

import { cn } from '@/lib/utils';
import { default as NextLink } from 'next/link';

function H1({ children, className, variant = 'base' }: Readonly<{ children: React.ReactNode; className?: string; variant?: 'base' | 'hero' }>) {
	const variants = {
		base: 'text-4xl md:text-5xl',
		hero: 'text-5xl md:text-7xl',
	}[variant];
	return <h1 className={cn('font-semibold tracking-tighter leading-none', variants, className)}>{children}</h1>;
}

function H2({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
	return <h2 className={cn('text-2xl md:text-3xl font-semibold tracking-tight leading-none', className)}>{children}</h2>;
}

function H3({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
	return <h3 className={cn('text-lg md:text-xl font-semibold tracking-normal leading-none', className)}>{children}</h3>;
}

function P({ children, className, variant = 'base' }: Readonly<{ children: React.ReactNode; className?: string; variant?: 'sm' | 'base' | 'lg' }>) {
	const variants = {
		sm: 'text-sm',
		base: 'text-base',
		lg: 'text-lg font-medium',
	}[variant];
	return <p className={cn(variants, className)}>{children}</p>;
}

function A({ children, href, className }: Readonly<{ children: React.ReactNode; href: string; className?: string }>) {
	return (
		<NextLink href={href} className={cn('transition-colors duration-300 hover:text-foreground/60', className)}>
			{children}
		</NextLink>
	);
}

export { H1, H2, H3, P, A };