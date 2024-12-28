import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/firebase.config';

const generateAuthErrorMessages = (error: FirebaseError) => {
	switch (error?.code) {
		case 'auth/invalid-credential':
			return 'Invalid email and/or password.';
		case 'auth/user-not-found':
			return 'User not found.';
		case 'auth/email-already-in-use':
			return 'Email already in use.';
		case 'auth/null-user':
			return 'No user is logged in.';
		default:
			return 'An error occured.';
	}
};

const useAuth = () => {
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
				generateAuthErrorMessages(error);
			}
			console.error(error);
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
				generateAuthErrorMessages(error);
			}
			console.error(error);
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
				generateAuthErrorMessages(error);
			}
			console.error(error);
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
				generateAuthErrorMessages(error);
			}
			console.error(error);
		} finally {
			setAuthLoading(false);
		}
	};

	const passwordReset = async (email: string) => {
		try {
			await sendPasswordResetEmail(auth, email);
		} catch (error) {
			if (error instanceof FirebaseError) {
				generateAuthErrorMessages(error);
			}
			console.error(error);
		}
	};

	return { user, authLoading, login, logout, signup, signInWithGoogle, passwordReset };
};

export { useAuth };
