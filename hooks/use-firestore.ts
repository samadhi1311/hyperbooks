import { useState } from 'react';
import { doc, setDoc, collection, WithFieldValue, DocumentData, getDoc, Timestamp, writeBatch, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProfileData, UserData } from '@/lib/types';
import { useProfileStore } from '@/store/use-profile';
import { useUserStore } from '@/store/use-user';
import useInvoicePagination from './use-invoice-pagination';
import useBillsPagination from './use-bill-pagination';
import { useAnalyticsStore } from '@/store/use-analytics';
import { PLAN_LIMITS } from '@/lib/constants';

export const useFirestore = <T extends WithFieldValue<DocumentData>>() => {
	const { user } = useAuth();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const { setProfile, clearProfile } = useProfileStore();
	const { userData, setUser, clearUser } = useUserStore();
	const { setAnalytics } = useAnalyticsStore();

	const { resetPagination } = useInvoicePagination({ userId: user?.uid || '', pageSize: 10 });
	const { resetPagination: resetBillsPagination } = useBillsPagination({ userId: user?.uid || '', pageSize: 10 });

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
			// Usage reference
			const usageRef = doc(db, 'users', user.uid);
			const usageSnap = await getDoc(usageRef);

			let invoiceCount = 0;
			let lastReset = null;

			if (usageSnap.exists()) {
				const data = usageSnap.data();
				invoiceCount = data.invoiceCount || 0;
				lastReset = data.lastReset?.toDate() || new Date(0);
			}

			const now = new Date();
			const currentMonth = now.getMonth();
			const lastResetMonth = lastReset.getMonth();

			// Check if it's a new month — reset usage if needed
			if (currentMonth !== lastResetMonth) {
				await setDoc(
					usageRef,
					{
						invoiceCount: 0,
						lastReset: serverTimestamp(),
					},
					{ merge: true }
				);
				invoiceCount = 0;
			}

			if (!userData) return null;

			// Plan limits check
			const userPlan = userData?.plan || 'starter';
			const planLimit = PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS].invoicesPerMonth || 0;

			if (invoiceCount >= planLimit) {
				toast({
					title: 'Limit Reached',
					description: `You’ve reached your ${planLimit} invoices per month limit. Upgrade to create more invoices.`,
					variant: 'destructive',
				});
				return null;
			}

			// Continue with invoice creation
			const userInvoicesRef = collection(db, 'users', user.uid, 'invoices');
			const analyticsRef = doc(db, 'users', user.uid, 'analytics', 'income');

			const createdAt = Timestamp.now();
			const createdAtDate = createdAt.toDate();
			const dateKey = createdAtDate.toLocaleDateString('en-CA');
			const monthKey = createdAtDate.toISOString().slice(0, 7);

			// Fetch existing analytics data
			const analyticsSnap = await getDoc(analyticsRef);
			if (!analyticsSnap.exists()) {
				await setDoc(analyticsRef, {
					totalIncome: 0,
					last30DaysInvoices: {},
					monthlyIncome: {},
					totalInvoiceCount: 0,
					totalOutstandingCount: 0,
					totalOutstandingAmount: 0,
				});
			}
			const analyticsData = (await getDoc(analyticsRef)).data() || {};

			const dataWithTimestamp = { ...data, complete: false, createdAt };
			const invoiceRef = customDocId ? doc(userInvoicesRef, customDocId) : doc(userInvoicesRef);
			const roundedTotal = Math.round(data.total * 100) / 100;

			const last30DaysData = { ...(analyticsData.last30DaysInvoices || {}) };
			last30DaysData[dateKey] = (last30DaysData[dateKey] || 0) + roundedTotal;

			const sortedKeys = Object.keys(last30DaysData).sort();
			if (sortedKeys.length > 30) delete last30DaysData[sortedKeys[0]];

			const monthlyIncomeData = { ...(analyticsData.monthlyIncome || {}) };
			monthlyIncomeData[monthKey] = (monthlyIncomeData[monthKey] || 0) + roundedTotal;

			// Start batch
			const batch = writeBatch(db);
			batch.set(invoiceRef, dataWithTimestamp);
			batch.update(analyticsRef, {
				totalIncome: increment(roundedTotal),
				totalInvoiceCount: increment(1),
				totalOutstandingCount: increment(1),
				totalOutstandingAmount: increment(roundedTotal),
				last30DaysInvoices: last30DaysData,
				monthlyIncome: monthlyIncomeData,
			});

			// Increment usage counter
			// Only reset if it's a new month
			if (currentMonth !== lastResetMonth) {
				await setDoc(
					usageRef,
					{
						invoiceCount: 0,
						lastReset: serverTimestamp(),
					},
					{ merge: true }
				);
				invoiceCount = 0;
			}

			// Increment usage counter without updating lastReset every time
			batch.set(
				usageRef,
				{
					invoiceCount: increment(1),
				},
				{ merge: true }
			);

			// Commit batch updates
			await batch.commit();

			clearUser();

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

			clearProfile();

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

			// Fetch both user and subscription data in parallel
			const userDocSnap = await getDoc(userDocRef);

			// Extract user data
			if (userDocSnap.exists()) {
				const userData = userDocSnap.data() as UserData;
				setUser(userData);
			}
			console.log('User Data:', userData);

			return userData;
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Getting User Data',
				description: error.message,
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	const updateUser = async (newUserData: Partial<UserData>) => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to update User data.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const userDocRef = doc(db, 'users', user.uid);
			const updatedUserData = await setDoc(userDocRef, newUserData, { merge: true });

			const cleanData = Object.fromEntries(Object.entries(newUserData).filter(([value]) => value !== undefined)) as Partial<UserData>;

			setUser({
				...userData,
				...cleanData,
			} as UserData);

			return updatedUserData;
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Updaing User Data',
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
			const invoiceRef = doc(db, 'users', user.uid, 'invoices', invoiceId);
			const analyticsRef = doc(db, 'users', user.uid, 'analytics', 'income');

			// Fetch the invoice data
			const invoiceSnap = await getDoc(invoiceRef);
			if (!invoiceSnap.exists()) throw new Error('Invoice not found.');

			const invoiceData = invoiceSnap.data();
			const invoiceTotal = invoiceData.total;
			const currentStatus = invoiceData.complete; // Previous status

			if (currentStatus === status) {
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

			// Update outstanding amounts
			const updates: Record<string, any> = {
				totalOutstandingCount: increment(status ? -1 : 1),
				totalOutstandingAmount: increment(status ? -invoiceTotal : invoiceTotal),
			};

			// Adjust total revenue when marking as complete/incomplete
			if (status) {
				updates.totalRevenue = increment(invoiceTotal);
			} else {
				updates.totalRevenue = increment(-invoiceTotal);
			}

			// Update analytics document
			batch.update(analyticsRef, updates);

			// Commit batch
			await batch.commit();

			resetPagination();
			clearUser();

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
			const invoiceDocRef = doc(db, 'users', user.uid, 'invoices', invoiceId);
			const analyticsRef = doc(db, 'users', user.uid, 'analytics', 'income');

			// Fetch the invoice data before deletion
			const invoiceSnap = await getDoc(invoiceDocRef);
			if (!invoiceSnap.exists()) throw new Error('Invoice not found.');

			const invoiceData = invoiceSnap.data();
			const invoiceTotal = invoiceData.total;
			const createdAt = invoiceData.createdAt.toDate();
			const dateKey = createdAt.toISOString().split('T')[0]; // 'YYYY-MM-DD'
			const monthKey = createdAt.toISOString().slice(0, 7); // 'YYYY-MM'

			// Fetch analytics data
			const analyticsSnap = await getDoc(analyticsRef);
			const analyticsData = analyticsSnap.exists() ? analyticsSnap.data() : {};

			// Update last 30 days income
			const last30DaysData = { ...(analyticsData.last30DaysInvoices || {}) };
			if (last30DaysData[dateKey]) {
				last30DaysData[dateKey] -= invoiceTotal;
				if (last30DaysData[dateKey] <= 0) delete last30DaysData[dateKey];
			}

			// Update monthly income
			const monthlyIncomeData = { ...(analyticsData.monthlyIncome || {}) };
			if (monthlyIncomeData[monthKey]) {
				monthlyIncomeData[monthKey] -= invoiceTotal;
				if (monthlyIncomeData[monthKey] <= 0) delete monthlyIncomeData[monthKey];
			}

			// Start batch
			const batch = writeBatch(db);
			batch.delete(invoiceDocRef);
			batch.update(analyticsRef, {
				totalInvoiceCount: increment(-1),
				totalIncome: increment(-invoiceTotal),
				last30DaysInvoices: last30DaysData,
				monthlyIncome: monthlyIncomeData,
			});

			// Commit batch
			await batch.commit();

			resetPagination();
			clearUser();

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

	const getSubscriptionStatus = async () => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to access your subscription.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const subscriptionDocRef = doc(db, 'users', user.uid);
			const subscriptionDocSnap = await getDoc(subscriptionDocRef);

			if (subscriptionDocSnap.exists()) {
				const subscriptionData = subscriptionDocSnap.data();
				console.log('Subscription Data:', subscriptionData);
				const newUserData = {
					...userData,
					customerId: subscriptionData.customer_id,
					tier: subscriptionData.subscription_status === 'active' ? 'pro' : 'starter',
					subscriptionStatus: subscriptionData.subscription_status,
					productId: subscriptionData.product_id,
					priceId: subscriptionData.price_id,
					validUntil: subscriptionData.scheduled_change,
				} as UserData;
				setUser(newUserData);

				return newUserData;
			}
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

	const addBill = async (data: T, customDocId?: string) => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to add a bill.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			// Usage reference
			const usageRef = doc(db, 'users', user.uid);
			const usageSnap = await getDoc(usageRef);

			let billCount = 0;
			let lastReset = null;

			if (usageSnap.exists()) {
				const data = usageSnap.data();
				billCount = data.billCount || 0;
				lastReset = data.lastReset?.toDate() || new Date(0);
			}

			const now = new Date();
			const currentMonth = now.getMonth();
			const lastResetMonth = lastReset.getMonth();

			// Check if it's a new month — reset usage if needed
			if (currentMonth !== lastResetMonth) {
				await setDoc(
					usageRef,
					{
						billCount: 0,
						lastReset: serverTimestamp(),
					},
					{ merge: true }
				);
				billCount = 0;
			}

			// Plan limits check
			const userPlan = userData?.plan || 'starter';
			const planLimit = PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS].billsPerMonth || 0;

			if (billCount >= planLimit) {
				toast({
					title: 'Limit Reached',
					description: `You’ve reached your ${planLimit} bills per month limit. Upgrade to add more bills.`,
					variant: 'destructive',
				});
				return null;
			}

			const userBillsRef = collection(db, 'users', user.uid, 'bills');
			const analyticsRef = doc(db, 'users', user.uid, 'analytics', 'expenses');

			const createdAt = Timestamp.now();
			const createdAtDate = createdAt.toDate();
			const dateKey = createdAtDate.toLocaleDateString('en-CA');
			const monthKey = createdAtDate.toISOString().slice(0, 7);

			// Fetch existing analytics data
			const analyticsSnap = await getDoc(analyticsRef);
			if (!analyticsSnap.exists()) {
				await setDoc(analyticsRef, {
					totalExpenses: 0,
					last30DaysExpenses: {},
					monthlyExpenses: {},
				});
			}
			const analyticsData = (await getDoc(analyticsRef)).data() || {};

			const dataWithTimestamp = { ...data, createdAt };
			const billRef = customDocId ? doc(userBillsRef, customDocId) : doc(userBillsRef);
			const roundedAmount = Math.round(data.amount * 100) / 100;

			const last30DaysData = { ...(analyticsData.last30DaysExpenses || {}) };
			last30DaysData[dateKey] = (last30DaysData[dateKey] || 0) + roundedAmount;

			const sortedKeys = Object.keys(last30DaysData).sort();
			if (sortedKeys.length > 30) delete last30DaysData[sortedKeys[0]];

			const monthlyExpensesData = { ...(analyticsData.monthlyExpenses || {}) };
			monthlyExpensesData[monthKey] = (monthlyExpensesData[monthKey] || 0) + roundedAmount;

			// Start batch
			const batch = writeBatch(db);
			batch.set(billRef, dataWithTimestamp);
			batch.update(analyticsRef, {
				totalExpenses: increment(roundedAmount),
				last30DaysExpenses: last30DaysData,
				monthlyExpenses: monthlyExpensesData,
			});

			// Increment usage counter without updating lastReset every time
			batch.set(
				usageRef,
				{
					billCount: increment(1),
				},
				{ merge: true }
			);

			// Commit batch updates
			await batch.commit();

			clearUser();

			toast({
				variant: 'success',
				title: 'Bill Added',
				description: 'Bill successfully added to Firestore.',
			});

			return billRef;
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Adding Bill',
				description: error.message,
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	const deleteBill = async (billId: string) => {
		if (!user) {
			toast({
				variant: 'destructive',
				title: 'Authentication Error',
				description: 'You must be logged in to delete a bill.',
			});
			return null;
		}

		setLoading(true);
		setError(null);

		try {
			const billRef = doc(db, 'users', user.uid, 'bills', billId);
			const analyticsRef = doc(db, 'users', user.uid, 'analytics', 'expenses');

			// Fetch bill data before deletion
			const billSnap = await getDoc(billRef);
			if (!billSnap.exists()) throw new Error('Bill not found.');

			const billData = billSnap.data();
			const billAmount = billData.amount;
			const createdAt = billData.createdAt.toDate();
			const dateKey = createdAt.toISOString().split('T')[0];
			const monthKey = createdAt.toISOString().slice(0, 7);

			// Fetch analytics data
			const analyticsSnap = await getDoc(analyticsRef);
			const analyticsData = analyticsSnap.exists() ? analyticsSnap.data() : {};

			// Update last 30 days expenses
			const last30DaysData = { ...(analyticsData.last30DaysExpenses || {}) };
			if (last30DaysData[dateKey]) {
				last30DaysData[dateKey] -= billAmount;
				if (last30DaysData[dateKey] <= 0) delete last30DaysData[dateKey];
			}

			// Update monthly expenses
			const monthlyExpensesData = { ...(analyticsData.monthlyExpenses || {}) };
			if (monthlyExpensesData[monthKey]) {
				monthlyExpensesData[monthKey] -= billAmount;
				if (monthlyExpensesData[monthKey] <= 0) delete monthlyExpensesData[monthKey];
			}

			// Start batch
			const batch = writeBatch(db);
			batch.delete(billRef);
			batch.update(analyticsRef, {
				totalExpenses: increment(-billAmount),
				last30DaysExpenses: last30DaysData,
				monthlyExpenses: monthlyExpensesData,
			});

			// Commit batch
			await batch.commit();

			resetBillsPagination();
			clearUser();

			toast({
				variant: 'success',
				title: 'Bill Deleted',
				description: 'Bill successfully deleted from Firestore.',
			});
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Deleting Bill',
				description: error.message,
			});
		} finally {
			setLoading(false);
		}
	};

	const getAnalytics = async () => {
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
			const incomeDocRef = doc(db, 'users', user.uid, 'analytics', 'income');
			const expensesDocRef = doc(db, 'users', user.uid, 'analytics', 'expenses');

			// Fetch both income and expenses data in parallel
			const [incomeDocSnap, expensesDocSnap] = await Promise.all([getDoc(incomeDocRef), getDoc(expensesDocRef)]);

			// Extract income data
			const incomeData = incomeDocSnap.exists() ? incomeDocSnap.data() : {};

			// Extract subscription data
			const expensesData = expensesDocSnap.exists() ? expensesDocSnap.data() : {};

			// Merge both datasets
			const analyticsData = {
				...incomeData,
				...expensesData,
			};

			// Update store
			setAnalytics(analyticsData);
			console.log('Analytic Data:', analyticsData);

			return analyticsData;
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast({
				variant: 'destructive',
				title: 'Error Getting Analytics',
				description: error.message,
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { addInvoice, deleteInvoice, updateStatus, addBill, deleteBill, getSubscriptionStatus, getProfile, updateProfile, getUser, updateUser, getAnalytics, loading, error };
};
