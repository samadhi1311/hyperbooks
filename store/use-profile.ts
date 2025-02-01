import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProfileData } from '@/lib/types';

interface ProfileStore {
	profile: ProfileData | null;
	setProfile: (profile: ProfileData) => void;
	clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
	persist(
		(set) => ({
			profile: null,
			setProfile: (profile) => set({ profile }),
			clearProfile: () => set({ profile: null }),
		}),
		{
			name: 'profile-storage',
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
