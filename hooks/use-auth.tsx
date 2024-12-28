import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/firebase.config';
import { useToast } from '@/hooks/use-toast';

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
		default:
			return 'It seems like an unexpected error occurred in our end. Please try again or contact us.';
	}
};

const useAuth = () => {
	const { toast } = useToast();

	const [user, setUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);

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
			const userCredentials = await signInWithEmailAndPassword(auth, email, password);
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

	const logout = async () => {
		setAuthLoading(true);
		try {
			await signOut(auth);
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

	const signup = async (email: string, password: string) => {
		setAuthLoading(true);
		try {
			const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
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
			const provider = new GoogleAuthProvider();
			const userCredentials = await signInWithPopup(auth, provider);
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
