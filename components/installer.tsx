'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { IconButton } from './ui/icon-button';
import { HardDriveDownloadIcon } from 'lucide-react';
import { motion } from 'motion/react';

export function Installer() {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [showBanner, setShowBanner] = useState(false);

	useEffect(() => {
		const neverShow = localStorage.getItem('hyperbooks-pwa-never-show');
		if (neverShow === 'true') return;

		const handler = (e: any) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setShowBanner(true);
		};

		window.addEventListener('beforeinstallprompt', handler);

		return () => {
			window.removeEventListener('beforeinstallprompt', handler);
		};
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			setDeferredPrompt(null);
			setShowBanner(false);
		}
	};

	const handleDismiss = () => {
		setShowBanner(false);
	};

	const handleDontAskAgain = () => {
		localStorage.setItem('hyperbooks-pwa-never-show', 'true');
		setShowBanner(false);
	};

	if (!showBanner) return null;

	return (
		<motion.div
			className='fixed bottom-4 left-4 right-4 z-[100] rounded-lg border bg-background p-4 shadow-lg md:left-auto md:right-4 md:w-96'
			initial={{ opacity: 0, x: '100%' }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, y: '100%' }}
			transition={{ duration: 0.75, delay: 2, ease: 'backInOut' }}>
			<h3 className='mb-2 flex flex-row items-center gap-2 font-semibold'>
				<HardDriveDownloadIcon className='size-4' />
				Install hyperbooks.
			</h3>
			<p className='mb-4 text-sm text-muted-foreground'>Install hyperbooks on your device for quick and easy access to your bookkeeping.</p>
			<div className='flex justify-end gap-2'>
				<Button variant='ghost' onClick={handleDontAskAgain}>
					Don&apos;t ask again
				</Button>
				<Button variant='ghost' onClick={handleDismiss}>
					Not now
				</Button>
				<IconButton icon={<HardDriveDownloadIcon />} onClick={handleInstallClick}>
					Install
				</IconButton>
			</div>
		</motion.div>
	);
}
