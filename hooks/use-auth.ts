import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/firebase.config';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/use-user';
import { useProfileStore } from '@/store/use-profile';
import { useInvoiceStore } from '@/store/use-invoice';
import { useAnalyticsStore } from '@/store/use-analytics';
import { useBillPaginationStore } from '@/store/use-bill-pagination';
import { useBillStore } from '@/store/use-bill';
import { usePaginationStore } from '@/store/use-pagination';

const generateAuthErrorMessages = (error: FirebaseError) => {
	switch (error?.code) {
		case 'auth/invalid-credential':
			return 'It seems like you have entered an invalid email and/or password. Please recheck your credentials.';
		case 'auth/user-not-found':
			return 'It seems like the user not found. Make sure you have created an account first';
		case 'auth/email-already-in-use':
			return 'The email entered is already in use. You should try to Login instead.';
		case 'auth/null-user':
			return 'It seems like you are not logged in. Please log in first.';
		case 'auth/network-request-failed':
			return 'Looks like there is an issue with your Internet connection.';
		default:
			return 'It seems like an unexpected error occurred in our end. Please try again or contact us.';
	}
};

const useAuth = () => {
	const { toast } = useToast();
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const { clearUser } = useUserStore();
	const { clearProfile } = useProfileStore();
	const { resetInvoiceData } = useInvoiceStore();
	const { clearAnalytics } = useAnalyticsStore();
	const [authLoading, setAuthLoading] = useState(true);
	const { clearAllBills } = useBillPaginationStore();
	const { clearBill } = useBillStore();
	const { clearAllInvoices } = usePaginationStore();

	const clearMemory = () => {
		clearAllBills();
		clearBill();
		clearAllInvoices();
		clearAnalytics();
		resetInvoiceData();
		clearProfile();
		clearUser();
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setAuthLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const login = async (email: string, password: string) => {
		setAuthLoading(true);
		try {
			clearMemory();
			console.log('Logging in...');
			const userCredentials = await signInWithEmailAndPassword(auth, email, password);
			if (userCredentials.user.uid) {
				toast({
					variant: 'default',
					title: 'Welcome back to hyperbooks. ',
					description: `Let's pick up from where you left off.`,
				});
				router.push('/dashboard');
				return userCredentials.user;
			}
		} catch (error) {
			if (error instanceof FirebaseError) {
				toast({
					variant: 'destructive',
					title: 'An error occured.',
					description: generateAuthErrorMessages(error),
				});
			}
		} finally {
			setAuthLoading(false);
		}
	};

	const logout = async () => {
		setAuthLoading(true);
		try {
			console.log('Logging out...');
			await signOut(auth);
			router.push('/login');
			clearMemory();
			user?.reload();
			toast({
				variant: 'default',
				title: 'Greetings from hyperbooks.',
				description: 'See you next time.',
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				toast({
					variant: 'destructive',
					title: 'An error occured.',
					description: generateAuthErrorMessages(error),
				});
			}
			console.error(error);
		} finally {
			setAuthLoading(false);
		}
	};

	const signup = async (email: string, password: string) => {
		setAuthLoading(true);
		try {
			clearMemory();
			console.log('Signing up...');
			const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
			if (userCredentials.user.uid) {
				toast({
					variant: 'success',
					title: 'You are signed up successfully.',
					description: `Welcome to hyperbooks. Let's start invoicing.`,
				});
			}
			router.push('/dashboard/getting-started');
			return userCredentials.user;
		} catch (error) {
			if (error instanceof FirebaseError) {
				toast({
					variant: 'destructive',
					title: 'An error occured.',
					description: generateAuthErrorMessages(error),
				});
			}
		} finally {
			setAuthLoading(false);
		}
	};

	const signInWithGoogle = async () => {
		setAuthLoading(true);
		try {
			clearMemory();
			console.log('Signing in with Google...');
			const provider = new GoogleAuthProvider();
			const userCredentials = await signInWithPopup(auth, provider);
			if (userCredentials.user.uid) {
				toast({
					variant: 'success',
					title: 'You are logged in successfully.',
					description: `Welcome to hyperbooks. Let's get started.`,
				});
			}

			return userCredentials.user;
		} catch (error) {
			if (error instanceof FirebaseError) {
				toast({
					variant: 'destructive',
					title: 'An error occured.',
					description: generateAuthErrorMessages(error),
				});
			}
		} finally {
			setAuthLoading(false);
		}
	};

	const passwordReset = async (email: string) => {
		try {
			await sendPasswordResetEmail(auth, email);
			toast({
				variant: 'success',
				title: 'Password reset email sent.',
				description: 'Please check your email for password reset instructions.',
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				toast({
					variant: 'destructive',
					title: 'An error occured.',
					description: generateAuthErrorMessages(error),
				});
			}
		}
	};

	return { user, authLoading, login, logout, signup, signInWithGoogle, passwordReset };
};

export { useAuth };
