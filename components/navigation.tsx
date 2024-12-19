'use client';

import { User2Icon } from 'lucide-react';
import { ModeToggle } from './theme-toggle';
import Link from 'next/link';
import { A } from './typography';
import { Button } from './ui/button';

export default function Navigation() {
	return (
		<header className='fixed top-0 z-50 w-full px-8 py-4 backdrop-blur-md'>
			<nav className='mx-auto flex max-w-screen-2xl items-center justify-between gap-4'>
				<span>
					<A href='#'>Home</A>
				</span>

				<span className='space-x-12'>
					<A href='#'>Templates</A>
					<A href='#'>Features</A>
					<A href='#'>Pricing</A>
				</span>

				<span className='flex items-center gap-4'>
					<ModeToggle />
					<Link href='#'>
						<Button>
							<User2Icon className='size-5' />
							Login
						</Button>
					</Link>
				</span>
			</nav>
		</header>
	);
}
