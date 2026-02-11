'use client';

import { PageWrapper, Section } from '@/components/ui/layout';
import { AnimatePresence } from 'motion/react';
import { useState } from 'react';
import Step1 from '@/components/getting-started/step-1';
import Step2 from '@/components/getting-started/step-2';

export default function GettingStarted() {
	const [currentStep, setCurrentStep] = useState(0);

	const formAnimations = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 20 },
		transition: { duration: 0.5 },
	};

	const handleNext = () => {
		setCurrentStep(1);
	};

	const handlePrevious = () => {
		setCurrentStep(0);
	};

	return (
		<PageWrapper>
			<Section className='mx-auto flex h-full w-full max-w-screen-sm items-center justify-center'>
				<AnimatePresence mode='wait'>
					{currentStep === 0 ? <Step1 handleNext={handleNext} formAnimations={formAnimations} /> : <Step2 handlePrevious={handlePrevious} formAnimations={formAnimations} />}
				</AnimatePresence>
			</Section>
		</PageWrapper>
	);
}
