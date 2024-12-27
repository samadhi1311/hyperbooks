'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const active = pathname.replace('/app', '');
	const path = active.split('/');
	console.log(path);
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center gap-2'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
						<Separator orientation='vertical' className='mr-2 h-4' />
						<Breadcrumb>
							<BreadcrumbList>
								{path.map((item, index) => (
									<span key={index} className={path[index] === '' ? 'hidden' : 'flex items-center justify-center gap-2'}>
										<BreadcrumbItem>
											<BreadcrumbLink href={index === 1 ? '/app' : `/app${path.slice(0, index + 1).join('/')}`} className='capitalize'>
												{item}
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator className={index === path.length - 1 ? 'hidden' : 'hidden md:block'} style={path.length < 1 ? { opacity: 0 } : { opacity: 1 }} />
									</span>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
