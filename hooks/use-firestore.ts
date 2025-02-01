import { useState } from 'react';
import { doc, setDoc, collection, WithFieldValue, DocumentData, getDoc, Timestamp, writeBatch, increment, getDocs, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
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

	const cleanupOldRecords = async (userId: string) => {
		const last30DaysRef = collection(db, 'users', userId, 'last30DaysInvoices');

		// Query all records ordered by date
		const snapshot = await getDocs(query(last30DaysRef, orderBy('date'), limit(31)));

		if (snapshot.docs.length > 30) {
			// Get the oldest record (31st)
			const oldestDoc = snapshot.docs[0];

			// Delete the oldest document
			await deleteDoc(oldestDoc.ref);
		}
	};

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
			const userStatsRef = doc(db, 'users', user.uid);

			// Get today's date as YYYY-MM-DD
			const today = new Date();
			const dateKey = today.toISOString().split('T')[0]; // e.g., "2025-02-01"

			// Reference for today's total in last30DaysInvoices
			const todayTotalRef = doc(db, 'users', user.uid, 'last30DaysInvoices', dateKey);

			// Add the invoice to invoices collection
			const dataWithTimestamp = { ...data, createdAt: Timestamp.now() };
			const invoiceRef = customDocId ? doc(userInvoicesRef, customDocId) : doc(userInvoicesRef);
			batch.set(invoiceRef, dataWithTimestamp);

			// Update user stats
			batch.update(userStatsRef, {
				totalInvoiceCount: increment(1),
				totalIncome: increment(data.total),
			});

			// Update daily total in last30DaysInvoices
			const todayTotalSnap = await getDoc(todayTotalRef);
			if (todayTotalSnap.exists()) {
				// If today's total exists, increment it
				batch.update(todayTotalRef, {
					totalAmount: increment(data.total),
				});
			} else {
				// Otherwise, create a new entry
				batch.set(todayTotalRef, {
					date: dateKey,
					totalAmount: data.total,
				});
			}

			// Commit batch updates
			await batch.commit();

			// Step 3: Maintain only 30 days of data (Cleanup Old Data)
			await cleanupOldRecords(user.uid);

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
