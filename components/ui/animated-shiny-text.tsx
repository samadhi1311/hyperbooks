import { CSSProperties, FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface AnimatedShinyTextProps {
	children: ReactNode;
	className?: string;
	shimmerWidth?: number;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({ children, className, shimmerWidth = 100 }) => {
	return (
		<span
			style={
				{
					'--shiny-width': `${shimmerWidth}px`,
				} as CSSProperties
			}
			className={cn(
				'mx-auto max-w-md text-muted-foreground/70',

				// Shine effect
				'animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_2s_cubic-bezier(.6,.6,0,1)_infinite]',

				// Shine gradient
				'bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/100',

				className
			)}>
			{children}
		</span>
	);
};

export default AnimatedShinyText;
