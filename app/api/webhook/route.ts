import { NextRequest } from 'next/server';
import admin from 'firebase-admin';
import { Environment, LogLevel, Paddle, PaddleOptions } from '@paddle/paddle-node-sdk';
import { CustomerCreatedEvent, CustomerUpdatedEvent, EventEntity, EventName, SubscriptionCreatedEvent, SubscriptionUpdatedEvent } from '@paddle/paddle-node-sdk';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			// Firebase Admin SDK credentials (from Firebase Console)
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
		switch (eventData.eventType) {
			case EventName.SubscriptionCreated:
			case EventName.SubscriptionUpdated:
				await this.updateSubscriptionData(eventData);
				break;
			case EventName.CustomerCreated:
			case EventName.CustomerUpdated:
				await this.updateCustomerData(eventData);
				break;
		}
	}

	private async updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
		try {
			const subscriptionRef = this.firestore.collection('subscriptions').doc(eventData.data.id.toString());

			// Upsert subscription data
			await subscriptionRef.set(
				{
					subscription_status: eventData.data.status,
					price_id: eventData.data.items[0].price?.id ?? '',
					product_id: eventData.data.items[0].price?.productId ?? '',
					scheduled_change: eventData.data.scheduledChange?.effectiveAt,
					customer_id: eventData.data.customerId,
					updated_at: new Date(),
				},
				{ merge: true }
			);

			console.log('Subscription data updated in Firestore.');
		} catch (e) {
			console.error('Error updating subscription data in Firestore:', e);
		}
	}

	private async updateCustomerData(eventData: CustomerCreatedEvent | CustomerUpdatedEvent) {
		try {
			const customerRef = this.firestore.collection('customers').doc(eventData.data.id.toString());

			// Upsert customer data
			await customerRef.set(
				{
					email: eventData.data.email,
					updated_at: new Date(),
				},
				{ merge: true }
			);

			console.log('Customer data updated in Firestore.');
		} catch (e) {
			console.error('Error updating customer data in Firestore:', e);
		}
	}
}

const webhookProcessor = new ProcessWebhook();

export async function POST(request: NextRequest) {
	const signature = request.headers.get('paddle-signature') || '';
	const rawRequestBody = await request.text();
	const privateKey = process.env['PADDLE_NOTIFICATION_WEBHOOK_SECRET'] || '';

	let status, eventName;
	try {
		if (signature && rawRequestBody) {
			const paddle = getPaddleInstance();
			const eventData = await paddle.webhooks.unmarshal(rawRequestBody, privateKey, signature);
			status = 200;
			eventName = eventData?.eventType ?? 'Unknown event';
			if (eventData) {
				await webhookProcessor.processEvent(eventData);
			}
		} else {
			status = 400;
			console.log('Missing signature from header');
		}
	} catch (e) {
		// Handle error
		status = 500;
		console.log(e);
	}
	return Response.json({ status, eventName });
}
