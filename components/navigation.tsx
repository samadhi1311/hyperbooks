'use client';

import { MenuIcon, User2Icon } from 'lucide-react';
import { ModeToggle } from './theme-toggle';
import Link from 'next/link';
import { A } from './typography';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from './ui/badge';

export default function Navigation() {
	return (
		<header className='fixed top-0 z-50 w-full px-8 py-4 backdrop-blur-md'>
			<nav className='mx-auto flex max-w-screen-2xl items-center justify-between gap-4'>
				<span>
					<A href='#'>Home</A>
				</span>

				<span className='hidden space-x-12 md:inline'>
					<A href='#'>Templates</A>
					<A href='#'>Features</A>
					<A href='#'>Pricing</A>
				</span>

				<span className='hidden items-center gap-4 md:flex'>
					<ModeToggle />
					<Link href='#'>
						<Button size='sm'>
							<User2Icon className='size-5' />
							Login
						</Button>
					</Link>
				</span>

				<span className='inline md:hidden'>
					<Sheet>
						<SheetTrigger asChild>
							<Button variant='outline' size='icon'>
								<MenuIcon className='size-5' />
							</Button>
						</SheetTrigger>
						<SheetContent className='flex flex-col items-center justify-around'>
							<SheetHeader>
								<SheetTitle className='flex flex-col items-center gap-2'>
									<Badge className='w-fit'>Early Access</Badge>
									Invoice Generator
								</SheetTitle>
								<SheetDescription asChild></SheetDescription>
							</SheetHeader>

							<div className='flex flex-col items-center gap-8'>
								<A href='#'>Templates</A>
								<A href='#'>Features</A>
								<A href='#'>Pricing</A>
							</div>

							<div className='flex flex-col gap-8'></div>

							<SheetFooter>
								<div className='flex w-full flex-col gap-8'>
									<Link href='#'>
										<Button size='sm' className='w-full'>
											<User2Icon className='size-5' />
											Login
										</Button>
									</Link>
									<ModeToggle />
								</div>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</span>
			</nav>
		</header>
	);
}
