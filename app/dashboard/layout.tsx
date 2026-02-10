'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { ProtectedRoute } from '@/components/protected-route';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Installer } from '@/components/installer';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/hooks/use-firestore';
import { useEffect } from 'react';
import { useUserStore } from '@/store/use-user';
import { useProfileStore } from '@/store/use-profile';
import { useAnalyticsStore } from '@/store/use-analytics';
import { toast } from '@/hooks/use-toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const path = pathname.split('/');
	const router = useRouter();

	const { user, authLoading } = useAuth();
	const { getUser, getProfile, getAnalytics } = useFirestore();
	const { userData } = useUserStore();
	const { profile, setProfile } = useProfileStore();
	const { analytics } = useAnalyticsStore();

	useEffect(() => {
		async function fetchData() {
			if (user?.uid) {
				if (!user.emailVerified) {
					toast({
						variant: 'default',
						title: 'Email is not verified yet.',
						description: 'Please check your email inbox for verification email.',
					});
				}
				if (!analytics) {
					await getAnalytics();
				}

				if (!userData) {
					await getUser();
				}

				if (!profile) {
					const profileData = await getProfile();
					if (profileData?.name) {
						setProfile(profileData);
					} else {
						router.replace('/dashboard/getting-started');
					}
				}
			}
		}

		fetchData();
	}, [user, authLoading]);

	return (
		<ProtectedRoute>
			<SidebarProvider className='relative min-h-svh overflow-hidden'>
				<AppSidebar variant='floating' collapsible='offcanvas' />
				<SidebarInset>
					<header className='fixed lg:static top-0 z-50 flex w-full h-10 shrink-0 items-center gap-2 border-b bg-sidebar/50 backdrop-blur-md'>
						<div className='flex items-center gap-2 px-4'>
							<SidebarTrigger className='-ml-1' />
							<Separator orientation='vertical' className='mr-2 h-4' />
							<Breadcrumb>
								<BreadcrumbList>
									{path.map((item, index) => (
										<span key={index} className={path[index] === '' ? 'hidden' : 'flex items-center justify-center gap-2'}>
											<BreadcrumbItem>
												<BreadcrumbLink asChild>
													<Link href={`${path.slice(0, index + 1).join('/')}`} className='capitalize text-xs'>
														{item}
													</Link>
												</BreadcrumbLink>
											</BreadcrumbItem>
											<BreadcrumbSeparator className={index === path.length - 1 ? 'hidden' : 'block'} style={path.length < 1 ? { opacity: 0 } : { opacity: 1 }} />
										</span>
									))}
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
					<div className='pt-10 lg:pt-4 max-w-[100svw]'>
						<Installer />
						{children}
					</div>
				</SidebarInset>
				<div className='hyperbooks-gradient-blob-1 pointer-events-none absolute right-0 top-0 aspect-square w-1/2 opacity-100 dark:opacity-10 md:left-0 md:w-1/3 md:opacity-20 z-0' aria-hidden />
				<div
					className='hyperbooks-gradient-blob-2 pointer-events-none absolute -bottom-1/3 -left-1/2 aspect-square w-1/3 rounded-full opacity-100 dark:opacity-20 md:-right-1/4 md:left-auto md:w-1/2 md:opacity-20 z-0'
					aria-hidden
				/>
			</SidebarProvider>
		</ProtectedRoute>
	);
}
