'use client';

import { User2Icon, ChevronsUpDown, LogOut, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { ModeToggle } from './theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/use-user';
import { Badge } from './ui/badge';
import { TextShimmer } from './ui/text-shimmer';

export function UserMenu() {
	const { isMobile } = useSidebar();
	const { user, logout } = useAuth();
	const { userData } = useUserStore();
	const router = useRouter();
	if (!user) return null;
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
							<Avatar className='flex size-8 items-center justify-center rounded-full border border-muted-foreground bg-muted'>
								<AvatarImage className='size-6 object-contain' src={user.photoURL!} alt={user.displayName!} />
								<AvatarFallback className='rounded-lg'>{user.displayName?.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>{user.displayName}</span>
								<span className='truncate text-xs'>{user.email}</span>
							</div>
							<ChevronsUpDown className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-muted/10 backdrop-blur-none sm:backdrop-blur-md'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex justify-end p-1'>
								<Badge className='capitalize' variant='secondary'>
									<TextShimmer duration={3}>{userData?.plan?.toString() || ''}</TextShimmer>
								</Badge>
							</div>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='flex size-8 items-center justify-center rounded-full border border-muted-foreground bg-muted'>
									<AvatarImage className='size-6 object-contain' src={user.photoURL!} alt={user.displayName!} />
									<AvatarFallback className='rounded-lg'>{user.displayName?.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>{user.displayName}</span>
									<span className='truncate text-xs'>{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						{userData?.plan === 'starter' && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem onClick={() => router.push('/dashboard/upgrade')}>
										<Sparkles />
										Upgrade to Pro
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</>
						)}
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => router.push('/dashboard/account')}>
								<User2Icon />
								Account settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<ModeToggle variant='secondary' />
						</DropdownMenuItem>
						<DropdownMenuItem onClick={logout}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
