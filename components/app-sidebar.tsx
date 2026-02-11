'use client';

import { BriefcaseBusinessIcon, LayoutListIcon, PlusCircleIcon, RocketIcon, SwatchBookIcon } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserMenu } from './user-menu';
import { P } from './ui/typography';
import { Card, CardContent } from './ui/card';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const { setOpenMobile } = useSidebar();

	return (
		<Sidebar {...props}>
			<SidebarHeader className='hidden md:block'>
				<SidebarMenu>
					<SidebarMenuItem>
						<Card className='sm:pt-4 md:pt-6'>
							<CardContent className='flex h-full w-full flex-col items-center justify-center gap-4'>
								<img src='/logo.svg' alt='hyperreal logo' className='mr-2 size-5' />
								<P className='font-medium tracking-tight text-muted-foreground'>hyperbooks.</P>
							</CardContent>
						</Card>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel></SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								className={pathname === '/dashboard' ? 'bg-gradient-to-r from-muted-foreground/20 dark:from-muted-foreground/15 to-muted-foreground/5 dark:to-muted-foreground/5' : ''}
								asChild>
								<Link href='/dashboard' className='flex h-full items-center gap-3' onClick={() => setOpenMobile(false)}>
									<RocketIcon />
									Dashboard
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Income</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								className={
									pathname === '/dashboard/invoices/create'
										? 'bg-gradient-to-r from-muted-foreground/20 dark:from-muted-foreground/15 to-muted-foreground/5 dark:to-muted-foreground/5'
										: ''
								}
								asChild>
								<Link href='/dashboard/invoices/create' className='flex h-full items-center gap-3' onClick={() => setOpenMobile(false)}>
									<PlusCircleIcon />
									Create a new Invoice
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								className={
									pathname === '/dashboard/invoices/history'
										? 'bg-gradient-to-r from-muted-foreground/20 dark:from-muted-foreground/15 to-muted-foreground/5 dark:to-muted-foreground/5'
										: ''
								}
								asChild>
								<Link href='/dashboard/invoices/history' className='flex h-full items-center gap-3' onClick={() => setOpenMobile(false)}>
									<LayoutListIcon />
									Invoice History
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Expense</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								className={
									pathname === '/dashboard/bills/create'
										? 'bg-gradient-to-r from-muted-foreground/20 dark:from-muted-foreground/15 to-muted-foreground/5 dark:to-muted-foreground/5'
										: ''
								}
								asChild>
								<Link href='/dashboard/bills/create' className='flex h-full items-center gap-3' onClick={() => setOpenMobile(false)}>
									<PlusCircleIcon />
									Create a new Bill
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								className={
									pathname === '/dashboard/bills/history'
										? 'bg-gradient-to-r from-muted-foreground/20 dark:from-muted-foreground/15 to-muted-foreground/5 dark:to-muted-foreground/5'
										: ''
								}
								asChild>
								<Link href='/dashboard/bills/history' className='flex h-full items-center gap-3' onClick={() => setOpenMobile(false)}>
									<LayoutListIcon />
									Bill History
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Settings</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								className={
									pathname === '/dashboard/templates'
										? 'bg-gradient-to-r from-muted-foreground/20 dark:from-muted-foreground/15 to-muted-foreground/5 dark:to-muted-foreground/5'
										: ''
								}
								asChild>
								<Link href='/dashboard/templates' className='flex h-full items-center gap-3' onClick={() => setOpenMobile(false)}>
									<SwatchBookIcon />
									Templates
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								className={
									pathname === '/dashboard/profile' ? 'bg-gradient-to-r from-muted-foreground/20 dark:from-muted-foreground/15 to-muted-foreground/5 dark:to-muted-foreground/5' : ''
								}
								asChild>
								<Link href='/dashboard/profile' className='flex h-full items-center gap-3' onClick={() => setOpenMobile(false)}>
									<BriefcaseBusinessIcon />
									Business Profile
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className='mb-4 sm:mb-0'>
				<UserMenu />
			</SidebarFooter>
		</Sidebar>
	);
}
