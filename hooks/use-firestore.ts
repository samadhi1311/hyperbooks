import { useState } from 'react';
import { doc, setDoc, collection, WithFieldValue, DocumentData, getDoc, Timestamp, writeBatch, increment, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProfileData } from '@/lib/types';
import { useProfileStore } from '@/store/use-profile';

export const useFirestoreAdd = <T extends WithFieldValue<DocumentData>>() => {
	const { user } = useAuth();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const { setProfile } = useProfileStore();

	const addInvoice = async (data: T, customDocId?: string) => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to add an invoice.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const batch = writeBatch(db);
			const userInvoicesRef = collection(db, 'users', user.uid, 'invoices');
			const userDocRef = doc(db, 'users', user.uid);

			// Get today's date as YYYY-MM-DD
			const today = new Date();
			const dateKey = today.toISOString().split('T')[0]; // Example: "2025-02-01"

			// Add the invoice
			const dataWithTimestamp = { ...data, createdAt: Timestamp.now() };
			const invoiceRef = customDocId ? doc(userInvoicesRef, customDocId) : doc(userInvoicesRef);
			batch.set(invoiceRef, dataWithTimestamp);

			// Update user stats
			batch.update(userDocRef, {
				totalInvoiceCount: increment(1),
				totalIncome: increment(data.total),
			});

			// Fetch the last 30 days data
			const userDocSnap = await getDoc(userDocRef);
			const last30DaysData = userDocSnap.exists() ? userDocSnap.data()?.last30DaysInvoices || {} : {};

			// Update today's total
			last30DaysData[dateKey] = (last30DaysData[dateKey] || 0) + data.total;

			// Ensure only the latest 30 days are stored
			const sortedKeys = Object.keys(last30DaysData).sort();
			if (sortedKeys.length > 30) {
				delete last30DaysData[sortedKeys[0]]; // Remove the oldest day
			}

			// Save the updated last30DaysInvoices object
			await updateDoc(userDocRef, { last30DaysInvoices: last30DaysData });

			// Commit batch updates
			await batch.commit();

			toast({
				variant: 'success',
				title: 'Invoice Added',
				description: 'Invoice successfully added to Firestore.',
			});

			return invoiceRef;
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Adding Invoice',
				description: error.message,
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	const getUserProfile = async () => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to get profile data.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const userDocRef = doc(db, 'users', user.uid);
			const userDoc = await getDoc(userDocRef);

			if (userDoc.exists()) {
				const profileData = userDoc.data() as ProfileData;
				setProfile(profileData);
				return profileData;
			}
			return null;
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Getting Profile',
				description: error.message,
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	const updateUserProfile = async (profileData: T) => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to update profile.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const userDocRef = doc(db, 'users', user.uid);

			await setDoc(userDocRef, profileData, { merge: true });

			toast({
				variant: 'success',
				title: 'Profile Updated',
				description: 'Profile successfully updated in Firestore.',
			});

			return userDocRef;
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Updating Profile',
				description: error.message,
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { addInvoice, getUserProfile, updateUserProfile, loading, error };
};
