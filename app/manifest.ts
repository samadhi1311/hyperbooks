import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
	return {
		id: '/dashboard/?source=manifest',
		name: 'hyperbooks',
		short_name: 'hyperbooks',
		description: 'Smart, simple & stress-free bookkeeping.',
		start_url: '/dashboard',
		scope: '/',
		lang: 'en',
		display: 'standalone',
		background_color: '#252525',
		theme_color: '#252525',
		icons: [
			{
				src: '/favicon.ico',
				sizes: '64x64',
				type: 'image/x-icon',
			},
			{
				src: '/logo-192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/logo-512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
		dir: 'ltr',
		orientation: 'portrait-primary',
		display_override: ['standalone', 'fullscreen', 'window-controls-overlay', 'minimal-ui', 'browser'],
		categories: ['finance', 'productivity'],
		screenshots: [
			{
				src: '/dashboard-desktop-dark.png',
				platform: 'windows',
				type: 'image/png',
				sizes: '1920x1080',
				label: 'Main dashboard',
			},
			{
				src: '/dashboard-desktop-dark.png',
				platform: 'macos',
				type: 'image/png',
				sizes: '1920x1080',
				label: 'Main dashboard',
			},
			{
				src: '/dashboard-mobile-dark.png',
				platform: 'android',
				type: 'image/png',
				sizes: '850x1572',
				label: 'Main dashboard',
			},
			{
				src: '/dashboard-mobile-dark.png',
				platform: 'ios',
				type: 'image/png',
				sizes: '850x1572',
				label: 'Main dashboard',
			},
		],
	};
}
