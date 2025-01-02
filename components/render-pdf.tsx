'use client';

import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./pdf-viewer'), {
	ssr: false,
});

export default function PDFRenderer({ children }: any) {
	return (
		<div>
			<PDFViewer style={{ width: '100%', height: '100vh' }}>{children}</PDFViewer>
		</div>
	);
}
