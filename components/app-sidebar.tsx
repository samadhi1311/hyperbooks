'use client';

import { LayoutListIcon, PlusCircleIcon, RocketIcon, SwatchBookIcon } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserMenu } from './user-menu';
import { P } from './ui/typography';
import { Card, CardContent } from './ui/card';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();

	return (
		<Sidebar variant='inset' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<Card className=''>
							<CardContent className='flex h-full items-center justify-center p-6'>
								<img src='/logo.svg' alt='hyperreal logo' className='mr-2 size-5' />
								<P className='font-medium tracking-tight'>hyperbooks.</P>
							</CardContent>
						</Card>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Invoices</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton className={pathname === '/dashboard' ? 'bg-sidebar-accent/50' : ''} asChild>
								<Link href='/dashboard/invoices/create' className='flex h-full items-center gap-3'>
									<RocketIcon />
									Dashboard
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton className={pathname === '/dashboard/invoices/create' ? 'bg-sidebar-accent/50' : ''} asChild>
								<Link href='/dashboard/invoices/create' className='flex h-full items-center gap-3'>
									<PlusCircleIcon />
									Create
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton className={pathname === '/dashboard/invoices/templates' ? 'bg-sidebar-accent/50' : ''} asChild>
								<Link href='/dashboard/invoices/templates' className='flex h-full items-center gap-3'>
									<SwatchBookIcon />
									Templates
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton className={pathname === '/dashboard/invoices/templates' ? 'bg-sidebar-accent/50' : ''} asChild>
								<Link href='/dashboard/invoices/templates' className='flex h-full items-center gap-3'>
									<LayoutListIcon />
									History
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<UserMenu />
			</SidebarFooter>
		</Sidebar>
	);
}
