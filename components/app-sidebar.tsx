'use client';

import { BookOpen, ChevronRight, LayoutListIcon, PlusCircleIcon, SwatchBookIcon } from 'lucide-react';
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
import { P } from './ui/typography';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();

	return (
		<Sidebar variant='inset' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<P>hyperbooks.</P>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Invoices</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton className={pathname === '/app/invoices/create' ? 'bg-sidebar-accent/50' : ''} asChild>
								<Link href='/app/invoices/create' className='flex items-center gap-3'>
									<PlusCircleIcon />
									Create
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton className={pathname === '/app/invoices/templates' ? 'bg-sidebar-accent/50' : ''} asChild>
								<Link href='/app/invoices/templates' className='flex items-center gap-3'>
									<SwatchBookIcon />
									Templates
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton className={pathname === '/app/invoices/templates' ? 'bg-sidebar-accent/50' : ''} asChild>
								<Link href='/app/invoices/templates' className='flex items-center gap-3'>
									<LayoutListIcon />
									History
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>

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
				<UserMenu />
			</SidebarFooter>
		</Sidebar>
	);
}
