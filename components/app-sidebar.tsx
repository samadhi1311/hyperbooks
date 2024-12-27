'use client';

import { BookOpen, ChevronRight } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserMenu } from './user-menu';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const user = {
		name: 'Samadhi Gunasinghe',
		email: 'samadhi@example.com',
		avatar: 'https://github.com/samadhi1311.png',
	};

	return (
		<Sidebar variant='inset' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<a href='#'>
								<div className='flex aspect-square size-8 items-center justify-center rounded-md bg-foreground/5 text-sidebar-primary-foreground'>
									<img src='/logo-mono.svg' alt='hyperbooks Logo' width={24} height={24} className='size-5' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate'>hyperbooks.</span>
									<span className='truncate text-xs'>Pro</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarMenu>
						<Collapsible defaultOpen className='group/collapsible'>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton asChild>
										<span>
											<BookOpen />
											Invoices
											<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
											<span className='sr-only'>Toggle</span>
										</span>
									</SidebarMenuButton>
								</CollapsibleTrigger>

								<CollapsibleContent>
									<SidebarMenuSub>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton className={pathname === '/app/invoices/create' ? 'bg-sidebar-accent/50' : ''} asChild>
												<Link href='/app/invoices/create'>Create</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>

										<SidebarMenuSubItem>
											<SidebarMenuSubButton className={pathname === '/app/invoices/recent' ? 'bg-sidebar-accent/50' : ''} asChild>
												<span>Recent</span>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>

						<Collapsible defaultOpen className='group/collapsible mt-4'>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton asChild>
										<span>
											<BookOpen />
											Templates
											<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
											<span className='sr-only'>Toggle</span>
										</span>
									</SidebarMenuButton>
								</CollapsibleTrigger>

								<CollapsibleContent>
									<SidebarMenuSub>
										<SidebarMenuSubItem>
											<SidebarMenuSubButton className={pathname === '/app/templates/create' ? 'bg-sidebar-accent/50' : ''} asChild>
												<Link href='/app/templates/create'>Create</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>

										<SidebarMenuSubItem>
											<SidebarMenuSubButton className={pathname === '/app/templates/my' ? 'bg-sidebar-accent/50' : ''} asChild>
												<span>My designs</span>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>

										<SidebarMenuSubItem>
											<SidebarMenuSubButton className={pathname === '/app/templates/browse' ? 'bg-sidebar-accent/50' : ''} asChild>
												<span>Browse</span>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<UserMenu user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
