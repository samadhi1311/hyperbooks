'use client';

import { useState, useEffect } from 'react';
import { A } from './ui/typography';
import { motion, AnimatePresence } from 'motion/react';
import { CookieIcon } from 'lucide-react';
import { IconButton } from './ui/icon-button';

const CookieConsent = () => {
	const [showBanner, setShowBanner] = useState(false);

	useEffect(() => {
		const consent = localStorage.getItem('cookie-consent');
		if (!consent) {
			const timer = setTimeout(() => setShowBanner(true), 5000);
			return () => clearTimeout(timer);
		}
	}, []);

	const acceptCookies = () => {
		localStorage.setItem('cookie-consent', 'true');
		setShowBanner(false);
	};

	return (
		<AnimatePresence>
			{showBanner ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
					className='fixed bottom-0 z-50 flex w-full items-center justify-between border-t border-border px-8 py-4 backdrop-blur-md'>
					<p className='text-sm'>
						We use cookies and local storage for core functionality. <A href='/privacy-policy'>Learn more</A>.
					</p>
					<IconButton icon={<CookieIcon />} onClick={acceptCookies} variant='secondary'>
						OK
					</IconButton>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};

export default CookieConsent;
