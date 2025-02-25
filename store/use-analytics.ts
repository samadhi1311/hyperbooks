import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnalyticsStore {
	analytics: any;
	setAnalytics: (analytics: any) => void;
	clearAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
	persist(
		(set) => ({
			analytics: null,
			setAnalytics: (analytics: any) => set({ analytics }),
			clearAnalytics: () => set({ analytics: null }),
		}),
		{
			name: 'hyperbooks-analytics-storage',
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
