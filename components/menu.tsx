import { CloudUploadIcon, DownloadIcon, FilePlus2Icon, Loader2Icon, MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useInvoiceStore } from '@/store/use-invoice';
import { Document, pdf } from '@react-pdf/renderer';
import templates, { TemplateKey } from '@/templates';
import { useTemplateStore } from '@/store/use-templates';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import { InvoiceData, ProfileData } from '@/lib/types';
import { useProfileStore } from '@/store/use-profile';

export default function Menu() {
	const { invoiceData, resetInvoiceData } = useInvoiceStore();
	const { selectedTemplate } = useTemplateStore();
	const { profile } = useProfileStore();
	const { addInvoice, loading, error } = useFirestore<Partial<InvoiceData>>();
	const { toast } = useToast();

	const invoicePayload = {
		data: invoiceData,
		profile: profile as ProfileData,
	};

	const handleExportPDF = async () => {
		try {
			const SelectedRenderer = templates[selectedTemplate as TemplateKey].render;
			const pdfDoc = <Document>{SelectedRenderer(invoicePayload)}</Document>;

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
				description: `PDF created successfully! You're just one step away from getting paid.`,
			});
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An error occurred.',
				description: error as string,
			});
			console.error('PDF Export Error:', error);
		}
	};

	const handleUpload = async () => {
		const docRef = await addInvoice(invoiceData);

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
