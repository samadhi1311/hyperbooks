import { CloudUploadIcon, DownloadIcon, FilePlus2Icon, FullscreenIcon, Loader2Icon, MenuIcon, RocketIcon } from 'lucide-react';
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
import { useViewStore } from '@/store/use-view';

export default function Menu() {
	const { invoiceData, resetInvoiceData } = useInvoiceStore();
	const { selectedTemplate, selectedPageSize } = useTemplateStore();
	const { profile } = useProfileStore();
	const { addInvoice, loading, incrementExportCount } = useFirestore<Partial<InvoiceData>>();
	const { toast } = useToast();
	const { view, setView } = useViewStore();

	const handleView = () => {
		setView(view === 'form' ? 'invoice' : 'form');
	};

	const invoicePayload = {
		data: invoiceData,
		profile: profile as ProfileData,
	};

	const handleSaveExportAndReset = async () => {
        try {
            toast({
				variant: 'default',
				title: 'Please',
				description: `Your invoice is being processed.`,
            });
            
			// Step 1: Save to cloud
			await addInvoice(invoiceData);
			
			// Step 2: Export to PDF
			const canExport = await incrementExportCount();
			if (!canExport) return;

			const SelectedRenderer = templates[selectedTemplate as TemplateKey].render;
			const pdfDoc = <Document title="Invoice">{SelectedRenderer({ ...invoicePayload, pageSize: selectedPageSize })}</Document>;

			const blob = await pdf(pdfDoc).toBlob();

			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			const recipientName = invoiceData.billedTo.name || 'Unknown';
			const invoiceRef = invoiceData.ref || 'INV';
			link.download = `${recipientName} - ${invoiceRef}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
			
			// Step 3: Reset for new invoice
			resetInvoiceData();
			
			// Show success message
			toast({
				variant: 'default',
				title: 'Invoice saved, exported, and ready for new entry!',
				description: `Your invoice has been saved to cloud, exported as PDF, and a new invoice form is ready.`,
			});
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'An error occurred.',
				description: `Couldn't complete the save, export, and reset process. Please try again.`,
			});
			console.error(error);
		}
	};

	return (
		<div className='sticky top-10 lg:top-8 z-50'>
			<DropdownMenu modal>
				<DropdownMenuTrigger asChild>
					<Button variant='default' className='flex items-center gap-3'>
						<MenuIcon />
						Options
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start' side='bottom'>
					<div className='grid gap-1'>
						<DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={handleView}>
							<FullscreenIcon />
							Switch View
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={resetInvoiceData}>
							<FilePlus2Icon />
							New Invoice
						</DropdownMenuItem>

						<DropdownMenuItem className='flex cursor-pointer items-center gap-3' onClick={handleSaveExportAndReset}>
							{loading ? (
								<>
									<Loader2Icon className='animate-spin' />
									Processing...
								</>
							) : (
								<>
									<RocketIcon />
									Save & Export
								</>
							)}
						</DropdownMenuItem>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
