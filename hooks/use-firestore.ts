import { useState } from 'react';
import { doc, setDoc, collection, WithFieldValue, DocumentData, getDoc, Timestamp, writeBatch, increment, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProfileData, UserData } from '@/lib/types';
import { useProfileStore } from '@/store/use-profile';
import { useUserStore } from '@/store/use-user';

export const useFirestoreAdd = <T extends WithFieldValue<DocumentData>>() => {
	const { user } = useAuth();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const { setProfile } = useProfileStore();
	const { setUser } = useUserStore();

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

			// Get today's date
			const today = new Date();
			const dateKey = today.toISOString().split('T')[0]; // "2025-02-01"
			const monthKey = today.toISOString().slice(0, 7); // "2025-02"

			// Add the invoice
			const dataWithTimestamp = { ...data, complete: false, createdAt: Timestamp.now() };
			const invoiceRef = customDocId ? doc(userInvoicesRef, customDocId) : doc(userInvoicesRef);
			batch.set(invoiceRef, dataWithTimestamp);

			// Update user stats
			batch.update(userDocRef, {
				totalInvoiceCount: increment(1),
				totalIncome: increment(data.total),
			});

			// Fetch existing analytics data
			const userDocSnap = await getDoc(userDocRef);
			const userData = userDocSnap.exists() ? userDocSnap.data() : {};

			// Update last 30 days income
			const last30DaysData = userData.last30DaysInvoices || {};
			last30DaysData[dateKey] = (last30DaysData[dateKey] || 0) + data.total;

			// Keep only the last 30 days
			const sortedKeys = Object.keys(last30DaysData).sort();
			if (sortedKeys.length > 30) delete last30DaysData[sortedKeys[0]];

			// Update all-time monthly income
			const monthlyIncomeData = userData.monthlyIncome || {};
			monthlyIncomeData[monthKey] = (monthlyIncomeData[monthKey] || 0) + data.total;

			// Save updated data
			await updateDoc(userDocRef, {
				last30DaysInvoices: last30DaysData,
				monthlyIncome: monthlyIncomeData,
			});

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

	const getProfile = async () => {
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
			const userDocRef = doc(db, 'users', user.uid, 'profile', user.uid);
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

	const updateProfile = async (profileData: T) => {
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
			const userDocRef = doc(db, 'users', user.uid, 'profile', user.uid);

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

	const getUser = async () => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to get User data.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const userDocRef = doc(db, 'users', user.uid);
			const userDoc = await getDoc(userDocRef);

			if (userDoc.exists()) {
				const userData = userDoc.data() as UserData;
				setUser(userData);
				return userData;
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

	const updateStatus = async (invoiceId: string, status: boolean) => {
		try {
			if (!user) {
				toast({
					variant: 'destructive',
					title: 'Authentication Error',
					description: 'You must be logged in to get User data.',
				});
				return null;
			}

			if (user.uid) {
				const invoiceRef = doc(collection(db, 'users', user.uid, 'invoices'), invoiceId);
				updateDoc(invoiceRef, {
					complete: status,
				});
				toast({
					variant: 'default',
					title: 'Status Updated!',
					description: `Invoice status has been updated as ${status ? 'completed' : 'incomplete'}.`,
				});
			}
		} catch (error) {
			console.error('Error updating status:', error);
			toast({
				variant: 'destructive',
				title: 'An error occurred.',
				description: error as string,
			});
		}
	};

	const deleteInvoice = async (invoiceId: string) => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to delete invoice.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const invoiceDocRef = doc(db, 'users', user.uid, 'invoices', invoiceId);

			await deleteDoc(invoiceDocRef);

			toast({
				variant: 'success',
				title: 'Invoice Deleted',
				description: 'Invoice successfully deleted from Firestore.',
			});
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Deleting Invoice',
				description: error.message,
			});
		} finally {
			setLoading(false);
		}
	};

	return { addInvoice, getProfile, updateProfile, getUser, deleteInvoice, updateStatus, loading, error };
};
