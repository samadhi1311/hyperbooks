'use client';

import { cn } from '@/lib/utils';
import { Button } from './button';

function IconButton({
	className,
	children,
	icon,
	onClick,
	type = 'button',
	variant = 'default',
	size = 'default',
}: {
	className?: string;
	children?: React.ReactNode;
	icon?: React.ReactNode;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	size?: 'default' | 'sm' | 'lg' | 'icon';
}) {
	return (
		<Button className={cn('group flex items-center gap-3', className)} size={size} variant={variant} type={type} onClick={onClick}>
			<span className='size-4 transition-all duration-300 group-hover:translate-x-1'>{icon}</span>
			{children}
		</Button>
	);
}

export { IconButton };
