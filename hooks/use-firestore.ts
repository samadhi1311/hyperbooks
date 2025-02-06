import { useState } from 'react';
import { doc, setDoc, collection, WithFieldValue, DocumentData, getDoc, Timestamp, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProfileData, UserData } from '@/lib/types';
import { useProfileStore } from '@/store/use-profile';
import { useUserStore } from '@/store/use-user';

export const useFirestore = <T extends WithFieldValue<DocumentData>>() => {
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
			const userDocRef = doc(db, 'users', user.uid);
			const userInvoicesRef = collection(db, 'users', user.uid, 'invoices');

			// Get today's date
			const today = new Date();
			const dateKey = today.toISOString().split('T')[0];
			const monthKey = today.toISOString().slice(0, 7);

			// Fetch existing analytics data before batch
			const userDocSnap = await getDoc(userDocRef);
			const userData = userDocSnap.exists() ? userDocSnap.data() : {};

			// Prepare invoice data
			const dataWithTimestamp = { ...data, complete: false, createdAt: Timestamp.now() };
			const invoiceRef = customDocId ? doc(userInvoicesRef, customDocId) : doc(userInvoicesRef);

			// Prepare updated analytics data
			const last30DaysData = { ...(userData.last30DaysInvoices || {}) };
			last30DaysData[dateKey] = (last30DaysData[dateKey] || 0) + data.total;

			// Keep only the last 30 days
			const sortedKeys = Object.keys(last30DaysData).sort();
			if (sortedKeys.length > 30) delete last30DaysData[sortedKeys[0]];

			const monthlyIncomeData = { ...(userData.monthlyIncome || {}) };
			monthlyIncomeData[monthKey] = (monthlyIncomeData[monthKey] || 0) + data.total;

			// Start batch
			const batch = writeBatch(db);
			batch.set(invoiceRef, dataWithTimestamp);
			batch.update(userDocRef, {
				totalInvoiceCount: increment(1),
				totalIncome: increment(data.total),
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
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to update the invoice status.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const userDocRef = doc(db, 'users', user.uid);
			const invoiceRef = doc(db, 'users', user.uid, 'invoices', invoiceId);

			// Fetch the invoice data
			const invoiceSnap = await getDoc(invoiceRef);
			if (!invoiceSnap.exists()) throw new Error('Invoice not found.');

			const invoiceData = invoiceSnap.data();
			const invoiceTotal = invoiceData.total;
			const currentStatus = invoiceData.complete; // Previous status

			if (currentStatus === status) {
				// No change needed
				toast({
					variant: 'default',
					title: 'No Update Needed',
					description: 'Invoice status is already set to the selected value.',
				});
				return null;
			}

			// Start batch
			const batch = writeBatch(db);

			// Update invoice status
			batch.update(invoiceRef, { complete: status });

			// Update user financials
			if (status) {
				// Marking invoice as complete
				batch.update(userDocRef, {
					totalRevenue: increment(invoiceTotal),
					totalOutstandingCount: increment(-1),
					totalOutstandingAmount: increment(-invoiceTotal),
				});
			} else {
				// Marking invoice as incomplete
				batch.update(userDocRef, {
					totalRevenue: increment(-invoiceTotal),
					totalOutstandingCount: increment(1),
					totalOutstandingAmount: increment(invoiceTotal),
				});
			}

			// Commit batch
			await batch.commit();

			toast({
				variant: 'default',
				title: 'Status Updated!',
				description: `Invoice status has been updated to ${status ? 'completed' : 'incomplete'}.`,
			});
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Updating Status',
				description: error.message,
			});
		} finally {
			setLoading(false);
		}
	};

	const deleteInvoice = async (invoiceId: string) => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to delete an invoice.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const userDocRef = doc(db, 'users', user.uid);
			const invoiceDocRef = doc(db, 'users', user.uid, 'invoices', invoiceId);

			// Fetch the invoice data before deletion
			const invoiceSnap = await getDoc(invoiceDocRef);
			if (!invoiceSnap.exists()) throw new Error('Invoice not found.');

			const invoiceData = invoiceSnap.data();
			const invoiceTotal = invoiceData.total;
			const createdAt = invoiceData.createdAt.toDate();
			const dateKey = createdAt.toISOString().split('T')[0];
			const monthKey = createdAt.toISOString().slice(0, 7);

			// Fetch user analytics data
			const userDocSnap = await getDoc(userDocRef);
			const userData = userDocSnap.exists() ? userDocSnap.data() : {};

			// Update last 30 days income
			const last30DaysData = { ...(userData.last30DaysInvoices || {}) };
			if (last30DaysData[dateKey]) {
				last30DaysData[dateKey] -= invoiceTotal;
				if (last30DaysData[dateKey] <= 0) delete last30DaysData[dateKey];
			}

			// Update monthly income
			const monthlyIncomeData = { ...(userData.monthlyIncome || {}) };
			if (monthlyIncomeData[monthKey]) {
				monthlyIncomeData[monthKey] -= invoiceTotal;
				if (monthlyIncomeData[monthKey] <= 0) delete monthlyIncomeData[monthKey];
			}

			// Start batch
			const batch = writeBatch(db);
			batch.delete(invoiceDocRef);
			batch.update(userDocRef, {
				totalInvoiceCount: increment(-1),
				totalIncome: increment(-invoiceTotal),
				last30DaysInvoices: last30DaysData,
				monthlyIncome: monthlyIncomeData,
			});

			// Commit batch
			await batch.commit();

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
