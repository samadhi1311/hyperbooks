import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserData } from '@/lib/types';

interface UserStore {
	userData: UserData | null;
	setUser: (user: UserData) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userData: null,
			setUser: (userData) => set({ userData }),
			clearUser: () => set({ userData: null }),
		}),
		{
			name: 'user-storage',
			storage: {
				getItem: (key) => {
					const value = sessionStorage.getItem(key);
					return value ? JSON.parse(value) : null;
				},
				setItem: (key, value) => {
					sessionStorage.setItem(key, JSON.stringify(value));
				},
				removeItem: (key) => {
					sessionStorage.removeItem(key);
				},
			},
		}
	)
);
