import { Section } from '@/components/ui/layout';
import Dashboard from './components/dashboard';

export default function Page() {
	/*
    1. Personal Greeting, total revenue, issued invoices, Outstanding invoices
    2. Revenue trend as a graph
    3. Most Recent invoices and shortcut to invoice history
    */
	return (
		<Section variant='main'>
			<Dashboard />
		</Section>
	);
}
