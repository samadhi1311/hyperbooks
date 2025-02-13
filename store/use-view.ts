import { create } from 'zustand';

type ViewState = {
	view: 'form' | 'invoice';
	setView: (view: 'form' | 'invoice') => void;
};

export const useViewStore = create<ViewState>((set) => ({
	view: (typeof window !== 'undefined' && (localStorage.getItem('selected-view') as 'form' | 'invoice')) || 'invoice',
	setView: (view) => {
		localStorage.setItem('selected-view', view);
		set({ view });
	},
}));
