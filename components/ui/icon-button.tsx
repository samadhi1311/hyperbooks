'use client';

import { cn } from '@/lib/utils';
import { Button } from './button';
import clsx from 'clsx';

function IconButton({
	className,
	children,
	icon,
	onClick,
	type = 'button',
	variant = 'default',
	size = 'default',
	disabled = false,
	asChild = false,
}: {
	className?: string;
	children?: React.ReactNode;
	icon?: React.ReactNode;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	size?: 'default' | 'sm' | 'lg' | 'icon';
	disabled?: boolean;
	asChild?: boolean;
}) {
	return (
		<Button size={size} variant={variant} type={type} onClick={onClick} disabled={disabled} asChild={asChild}>
			<span className={cn('group flex items-center gap-3', className)}>
				<span className={clsx('size-4 transition-all duration-300', !disabled && 'group-hover:translate-x-1')}>{icon}</span>
				{children}
			</span>
		</Button>
	);
}

export { IconButton };
