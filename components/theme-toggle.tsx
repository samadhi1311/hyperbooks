'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ModeToggle({ variant = 'default' }: { variant?: 'default' | 'secondary' }) {
	const { theme, setTheme } = useTheme();

	function handleToggle() {
		if (theme === 'dark') {
			setTheme('light');
		} else {
			setTheme('dark');
		}
	}

	if (variant === 'secondary') {
		return (
			<span className='flex h-full w-full items-center gap-2' onClick={handleToggle}>
				<span className='relative flex h-4 w-4 items-center justify-center'>
					<Sun className='size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
					<Moon className='absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
				</span>
				<span className='inline'>Toggle Theme</span>
			</span>
		);
	}

	return (
		<Button variant='outline' className='md:size-10' onClick={handleToggle}>
			<span className='relative flex h-5 w-5 items-center justify-center'>
				<Sun className='size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
				<Moon className='absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
			</span>
			<span className='inline md:sr-only'>Toggle Theme</span>
		</Button>
	);
}
