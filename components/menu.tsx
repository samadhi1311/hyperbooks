import { CloudUploadIcon, DownloadIcon, FilePlus2Icon, MenuIcon, ViewIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import Link from 'next/link';
import { useInvoiceStore } from '@/store/use-invoice';
import { Document, pdf } from '@react-pdf/renderer';
import templates, { TemplateKey } from '@/templates';
import { useTemplateStore } from '@/store/use-templates';
import { useToast } from '@/hooks/use-toast';

export default function Menu() {
	const { invoiceData, resetInvoiceData } = useInvoiceStore();
	const { selectedTemplate } = useTemplateStore();
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
				title: 'Successfully exported.',
				description: `You can find the invoice in your downloads folder.`,
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
						<DropdownMenuItem className='flex cursor-pointer items-center gap-3'>
							<CloudUploadIcon />
							Save to cloud
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
