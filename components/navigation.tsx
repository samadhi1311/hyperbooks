'use client';

import { Loader2Icon, MenuIcon, SquareDashedMousePointerIcon, User2Icon } from 'lucide-react';
import { ModeToggle } from './theme-toggle';
import Link from 'next/link';
import { A } from './ui/typography';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { useAuth } from '@/hooks/use-auth';

export default function Navigation() {
	const hasAnimated = sessionStorage.getItem('navAnimated');

	const handleAnimationComplete = () => {
		sessionStorage.setItem('navAnimated', 'true');
	};

	const { user, authLoading } = useAuth();

	const AuthButton = () => {
		if (authLoading) {
			return (
				<Button variant='outline' className='flex items-center gap-3'>
					<Loader2Icon className='animate-spin' />
					Loading
				</Button>
			);
		}
		if (!authLoading && !user) {
			return (
				<Link href='/login'>
					<Button variant='outline' className='flex items-center gap-3'>
						<User2Icon />
						Login
					</Button>
				</Link>
			);
		} else {
			return (
				<Link href='/app'>
					<Button variant='outline' className='flex items-center gap-3'>
						<SquareDashedMousePointerIcon className='scale-x-[-1]' />
						Dashboard
					</Button>
				</Link>
			);
		}
	};

	return (
		<motion.header
			className='fixed top-0 z-50 w-full border-b border-border px-8 py-4 opacity-0 backdrop-blur-md'
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1], delay: hasAnimated ? 0 : 1.5 }}
			onAnimationComplete={handleAnimationComplete}>
			<nav className='mx-auto flex max-w-screen-2xl items-center justify-between gap-4'>
				<span>
					<A href='/' className='flex items-center gap-2'>
						<img src='/logo.svg' className='size-5' alt='hyperbooks Logo' />
						hyperbooks.
					</A>
				</span>

				<span className='hidden space-x-12 md:inline'>
					<A href='/#'>Templates</A>
					<A href='/#features'>Features</A>
					<A href='/#pricing'>Pricing</A>
				</span>

				<span className='hidden items-center gap-4 md:flex'>
					<ModeToggle />
					<AuthButton />
				</span>

				<span className='inline md:hidden'>
					<Sheet>
						<SheetTrigger asChild>
							<Button variant='outline' size='icon'>
								<MenuIcon className='size-5' />
							</Button>
						</SheetTrigger>
						<SheetContent side='left' className='flex flex-col items-center justify-around'>
							<SheetHeader>
								<SheetTitle className='flex flex-col items-center gap-2'>
									<Badge className='w-fit'>Early Access</Badge>
									Invoice Generator
								</SheetTitle>
								<SheetDescription asChild></SheetDescription>
							</SheetHeader>

							<div className='flex flex-col items-center gap-8'>
								<A href='/#'>Templates</A>
								<A href='/#'>Features</A>
								<A href='/#'>Pricing</A>
							</div>

							<div className='flex flex-col gap-8'></div>

							<SheetFooter>
								<div className='flex w-full flex-col gap-8'>
									<AuthButton />
									<ModeToggle />
								</div>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</span>
			</nav>
		</motion.header>
	);
}
