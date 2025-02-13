import * as React from 'react';
import { cn } from '@/lib/utils';

interface PrefixedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
	prefix?: React.ReactNode; // Prop to accept a currency symbol, SVG, or anything else
}

const PrefixedInput = React.forwardRef<HTMLInputElement, PrefixedInputProps>(({ className, type, prefix, ...props }, ref) => {
	return (
		<span className='flex items-center space-x-2'>
			{prefix && <span className='text-muted-foreground'>{prefix}</span>}
			<input
				type={type}
				className={cn(
					'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
					className
				)}
				ref={ref}
				{...props}
			/>
		</span>
	);
});

PrefixedInput.displayName = 'PrefixedInput';

export { PrefixedInput };
