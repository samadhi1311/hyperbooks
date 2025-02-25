import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewState = {
	view: 'form' | 'invoice';
	setView: (view: 'form' | 'invoice') => void;
};

export const useViewStore = create<ViewState>()(
	persist(
		(set) => ({
			view: (typeof window !== 'undefined' && (localStorage.getItem('selected-view') as 'form' | 'invoice')) || 'invoice',
			setView: (view) => {
				localStorage.setItem('selected-view', view);
				set({ view });
			},
		}),
		{
			name: 'hyperbooks-view-storage',
			storage: {
				getItem: (key) => {
					const value = localStorage.getItem(key);
					return value ? JSON.parse(value) : null;
				},
				setItem: (key, value) => {
					localStorage.setItem(key, JSON.stringify(value));
				},
				removeItem: (key) => {
					localStorage.removeItem(key);
				},
			},
		}
	)
);
