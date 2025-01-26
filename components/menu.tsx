import { CloudUploadIcon, DownloadIcon, FilePlus2Icon, Loader2Icon, MenuIcon, ViewIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/use-invoice';
import { Document, pdf } from '@react-pdf/renderer';
import templates, { TemplateKey } from '@/templates';
import { useTemplateStore } from '@/store/use-templates';
import { useToast } from '@/hooks/use-toast';
import { useFirestoreAdd } from '@/hooks/use-firestore';
import { InvoiceData } from '@/lib/types';

export default function Menu() {
	const { invoiceData, resetInvoiceData } = useInvoiceStore();
	const { selectedTemplate } = useTemplateStore();
	const { addDocument, loading, error } = useFirestoreAdd<Partial<InvoiceData>>();
	const { toast } = useToast();

	const handleExportPDF = async () => {
		try {
			const SelectedRenderer = templates[selectedTemplate as TemplateKey].render;
			const pdfDoc = <Document>{SelectedRenderer(invoiceData)}</Document>;

			const blob = await pdf(pdfDoc).toBlob();

			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = 'invoice.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
			toast({
				variant: 'default',
				title: 'Invoice Ready to Share!',
				description: `PDF created successfully! You're one step closer to getting paid.`,
			});
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An error occurred.',
				description: 'Couldn&apos;t export to a PDF. Please try again.',
			});
			console.error('PDF Export Error:', error);
		}
	};

	const handleUpload = async () => {
		const docRef = await addDocument(invoiceData);

		if (docRef) {
			toast({
				variant: 'default',
				title: 'Great Job on the Sale!',
				description: `Your latest invoice is now securely saved in the cloud. Keep the momentum going!`,
			});
		}

		if (error) {
			toast({
				variant: 'destructive',
				title: 'An error occurred.',
				description: error.message,
			});
		}
	};

	return (
		<div className='mb-4'>
			<DropdownMenu modal>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' className='flex items-center gap-3'>
						<MenuIcon />
						Options
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start' side='bottom'>
					<div className='grid gap-1'>
						<DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={resetInvoiceData}>
							<FilePlus2Icon />
							New Invoice
						</DropdownMenuItem>
						<DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={handleUpload}>
							{loading ? (
								<>
									<Loader2Icon className='animate-spin' />
									Uploading
								</>
							) : (
								<>
									<CloudUploadIcon />
									Save to cloud
								</>
							)}
						</DropdownMenuItem>
						<DropdownMenuItem className='flex cursor-pointer'>
							<Link href='create/preview' className='flex cursor-pointer items-center gap-3'>
								<ViewIcon />
								Preview
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={handleExportPDF}>
							<DownloadIcon />
							Export to PDF
						</DropdownMenuItem>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
