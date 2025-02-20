'use client';

import { Section } from '@/components/ui/layout';
import Payment from './components/payment';
import { useUserStore } from '@/store/use-user';
import { Button } from '@/components/ui/button';

export default function Subscription() {
	const { userData } = useUserStore();

	const fetchPortalLink = async () => {
		if (userData?.customer_id) {
			const response = await fetch(`https://hyperbooks-api.hyperreal.cloud/customer-portal`, {
				method: 'POST',
				body: JSON.stringify({ customer_id: userData.customer_id }),
			});

			const result = await response.json();
			console.log(result);
			window.open(result.url, '_blank');
		}
	};

	return (
		<Section>
			<Payment />
			<Button onClick={fetchPortalLink}>Manage Subscription</Button>
		</Section>
	);
}
