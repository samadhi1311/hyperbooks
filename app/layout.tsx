import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import Splash from '@/components/splash';
import CookieConsent from '@/components/cookie-consent';
import { ReactScan } from '@/components/react-scan';

const sans = Inter({
	variable: '--font-sans',
	subsets: ['latin'],
	preload: true,
});

const display = Bricolage_Grotesque({
	variable: '--font-display',
	subsets: ['latin'],
	preload: true,
});

export const metadata: Metadata = {
	title: 'hyperbooks. | Smart, simple & stress-free bookkeeping.',
	description: 'Simplify your bookkeeping with real-time insights, secure data storage, and professional invoicing. Access your finances anytime, anywhere.',
	keywords: ['bookkeeping', 'income tracking', 'expense management', 'AI financial insights', 'invoice generation', 'cash flow analytics'],
	authors: [
		{
			name: 'Samadhi Gunasinghe',
			url: 'https://samadhi-gunasinghe.com',
		},
		{
			name: 'Nipuni Gamage',
			url: 'https://nipuni.is-a.dev',
		},
		{
			name: 'hyperreal',
			url: 'https://hyperreal.cloud',
		},
	],
	robots: {
		index: true,
		follow: true,
	},
	appleWebApp: {
		capable: true,
		startupImage: 'https://hyperbooks.app/logo-512.png',
		statusBarStyle: 'black-translucent',
		title: 'hyperbooks. | Smart, simple & stress-free bookkeeping.',
	},
	openGraph: {
		title: 'hyperbooks. | Smart, simple & stress-free bookkeeping.',
		description: 'Simplify your bookkeeping with real-time insights, secure data storage, and professional invoicing. Access your finances anytime, anywhere.',
		type: 'website',
		url: 'https://hyperbooks.app',
		images: [
			{
				url: 'https://hyperbooks.app/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Bookkeeping Dashboard Preview',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'hyperbooks. | Smart, simple & stress-free bookkeeping.',
		description: 'Simplify your bookkeeping with real-time insights, secure data storage, and professional invoicing. Access your finances anytime, anywhere.',
		images: ['https://hyperbooks.app/og-image.jpng'],
	},
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en'>
			<ReactScan />
			<body className={`${sans.className} ${display.variable} antialiased`}>
				<ThemeProvider attribute='class' defaultTheme='dark'>
					<Splash />
					{children}
					<CookieConsent />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
