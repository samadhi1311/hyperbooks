'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { A } from './ui/typography';

const CookieConsent = () => {
	const [showBanner, setShowBanner] = useState(false);

	useEffect(() => {
		const consent = localStorage.getItem('cookie-consent');
		if (!consent) setShowBanner(true);
	}, []);

	const acceptCookies = () => {
		localStorage.setItem('cookie-consent', 'true');
		setShowBanner(false);
	};

	if (!showBanner) return null;

	return (
		<div className='fixed bottom-0 z-50 flex w-full items-center justify-between border-t border-border px-8 py-4 backdrop-blur-md'>
			<p className='text-sm'>
				We use cookies and local storage for core functionality. Hence cannot be disabled. <A href='/privacy-policy'>Learn more</A>.
			</p>
			<Button onClick={acceptCookies} variant='secondary'>
				OK
			</Button>
		</div>
	);
};

export default CookieConsent;
