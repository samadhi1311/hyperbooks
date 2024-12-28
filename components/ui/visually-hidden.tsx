'use client';

import * as Hidden from '@radix-ui/react-visually-hidden';

function VisuallyHidden({ children }: { children: React.ReactNode }) {
	return <Hidden.Root>{children}</Hidden.Root>;
}

export { VisuallyHidden };
