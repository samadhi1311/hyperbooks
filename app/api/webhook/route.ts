import { NextRequest } from 'next/server';
import admin from 'firebase-admin';
import { Environment, LogLevel, Paddle, PaddleOptions, SubscriptionActivatedEvent } from '@paddle/paddle-node-sdk';
import { CustomerCreatedEvent, CustomerUpdatedEvent, EventEntity, EventName, SubscriptionCreatedEvent, SubscriptionUpdatedEvent } from '@paddle/paddle-node-sdk';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		}),
	});
} else {
	admin.app();
}

function getPaddleInstance() {
	const paddleOptions: PaddleOptions = {
		environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as Environment) ?? Environment.sandbox,
		logLevel: LogLevel.error,
	};

	if (!process.env.PADDLE_API_KEY) {
		console.error('Paddle API key is missing');
	}

	return new Paddle(process.env.PADDLE_API_KEY!, paddleOptions);
}

class ProcessWebhook {
	private firestore = getFirestore();

	async processEvent(eventData: EventEntity) {
		console.log(`Processing Event: ${eventData.eventType}`);

		switch (eventData.eventType) {
			case EventName.SubscriptionCreated:
			case EventName.SubscriptionUpdated:
			case EventName.SubscriptionActivated:
				await this.updateSubscriptionData(eventData);
				break;
			case EventName.CustomerCreated:
			case EventName.CustomerUpdated:
				await this.updateCustomerData(eventData);
				break;
			default:
				console.warn(`Unhandled event type: ${eventData.eventType}`);
		}
	}

	private async updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent | SubscriptionActivatedEvent) {
		try {
			if (!eventData.data) {
				throw new Error('Missing eventData.data in webhook payload');
			}

			console.log('Updating subscription:', eventData.data.id);

			const subscriptionRef = this.firestore.collection('subscriptions').doc((eventData.data.customData as { email: string; user_id: string }).user_id.toString());

			await subscriptionRef.set(
				{
					subscription_status: eventData.data.status,
					price_id: eventData.data.items?.[0]?.price?.id ?? '',
					product_id: eventData.data.items?.[0]?.price?.productId ?? '',
					scheduled_change: eventData.data.scheduledChange?.effectiveAt ?? null,
					customer_id: eventData.data.customerId,
					updated_at: new Date(),
					email: (eventData.data.customData as { email: string; user_id: string }).email,
					user_id: (eventData.data.customData as { email: string; user_id: string }).user_id,
				},
				{ merge: true }
			);

			console.log('Subscription updated in Firestore.');
		} catch (e) {
			console.error('Error updating subscription:', e);
		}
	}

	private async updateCustomerData(eventData: CustomerCreatedEvent | CustomerUpdatedEvent) {
		try {
			if (!eventData.data) {
				throw new Error('Missing eventData.data in webhook payload');
			}

			console.log('Updating customer:', eventData.data.id);

			const customerRef = this.firestore.collection('customers').doc(eventData.data.id.toString());

			await customerRef.set(
				{
					email: eventData.data.email ?? '',
					updated_at: new Date(),
				},
				{ merge: true }
			);

			console.log('Customer data updated in Firestore.');
		} catch (e) {
			console.error('Error updating customer data:', e);
		}
	}
}

const webhookProcessor = new ProcessWebhook();

export async function POST(request: NextRequest) {
	const signature = request.headers.get('paddle-signature') || '';
	const rawRequestBody = await request.text();
	const privateKey = process.env['PADDLE_NOTIFICATION_WEBHOOK_SECRET'] || '';

	console.log('Received Webhook: ', rawRequestBody);
	console.log('Signature:', signature);

	let status, eventName;
	try {
		if (signature && rawRequestBody) {
			const paddle = getPaddleInstance();
			const eventData = await paddle.webhooks.unmarshal(rawRequestBody, privateKey, signature);

			console.log('Unmarshalled Event:', JSON.stringify(eventData, null, 2));

			status = 200;
			eventName = eventData?.eventType ?? 'Unknown event';

			if (eventData) {
				console.log('Received Webhook Payload:', JSON.stringify(eventData, null, 2));
				await webhookProcessor.processEvent(eventData);
			}
		} else {
			status = 400;
			console.log('Missing signature or raw request body');
		}
	} catch (e) {
		status = 500;
		console.error('Error processing webhook:', e);
	}
	return Response.json({ status, eventName });
}
