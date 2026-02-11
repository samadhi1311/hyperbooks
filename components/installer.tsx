'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { IconButton } from './ui/icon-button';
import { HardDriveDownloadIcon, Share2Icon } from 'lucide-react';
import { motion } from 'motion/react';

export function Installer() {
	const [deferredPrompt, setDeferredPrompt] = useState(null);
	const [showBanner, setShowBanner] = useState(false);
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		// Check if already installed as PWA
		setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

		// Check if iOS
		// @ts-expect-error (window.MSStream is a property of the window object)
		const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		setIsIOS(iOS);

		// Don't show if user opted out
		const neverShow = localStorage.getItem('hyperbooks-pwa-never-show');
		if (neverShow === 'true' || isStandalone) return;

		// For non-iOS, listen for install prompt
		if (!iOS) {
			const handler = (e: any) => {
				e.preventDefault();
				setDeferredPrompt(e);
				setShowBanner(true);
			};

			window.addEventListener('beforeinstallprompt', handler);
			return () => window.removeEventListener('beforeinstallprompt', handler);
		} else {
			// For iOS, check if in Safari
			const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

			// Only show prompt in Safari and not in standalone mode
			// @ts-expect-error (navigator.standalone is a property of the navigator object)
			if (isSafari && !navigator.standalone) {
				// Delay showing the prompt to avoid immediate dismissal
				const timer = setTimeout(() => setShowBanner(true), 1000);
				return () => clearTimeout(timer);
			}
		}
	}, []);

	const handleInstallClick = async () => {
		if (isIOS) {
			// Can't programmatically trigger install on iOS, just show instructions
			alert('To install: tap the share icon in your browser and select "Add to Home Screen"');
		} else if (deferredPrompt) {
			// @ts-expect-error (deferredPrompt is a property of the window object)
			deferredPrompt.prompt();
			// @ts-expect-error (deferredPrompt is a property of the window object)
			const { outcome } = await deferredPrompt.userChoice;

			if (outcome === 'accepted') {
				setDeferredPrompt(null);
				setShowBanner(false);
			}
		}
	};

	// const handleDismiss = () => {
	// 	setShowBanner(false);
	// };

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
				{isIOS ? <Share2Icon className='size-4' /> : <HardDriveDownloadIcon className='size-4' />}
				Install hyperbooks
			</h3>
			<p className='mb-4 text-sm text-muted-foreground'>
				{isIOS
					? "Add hyperbooks to your home screen for quick access. Tap the share button and select 'Add to Home Screen'."
					: 'Install hyperbooks on your device for quick and easy access to your bookkeeping.'}
			</p>
            <div className='flex flex-col justify-end gap-2'>
                <IconButton icon={isIOS ? <Share2Icon /> : <HardDriveDownloadIcon />} onClick={handleInstallClick}>
					{isIOS ? 'Show me how' : 'Install'}
                </IconButton>
                
				<Button variant='outline' onClick={handleDontAskAgain}>
					Don&apos;t ask again
				</Button>
				{/* <Button variant='ghost' onClick={handleDismiss}>
					Not now
				</Button> */}
				
			</div>
		</motion.div>
	);
}
