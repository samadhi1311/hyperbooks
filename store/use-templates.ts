import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemplateKey } from '@/templates';

// Store interface
interface TemplateStore {
	selectedTemplate: TemplateKey;
	setTemplate: (template: TemplateKey) => void;
}

// Create Zustand store with persistence
export const useTemplateStore = create<TemplateStore>()(
	persist(
		(set) => ({
			selectedTemplate: 'minimal',
			setTemplate: (template) => set({ selectedTemplate: template }),
		}),
		{
			name: 'pdf-template-storage', // localStorage key
			partialize: (state) => ({ selectedTemplate: state.selectedTemplate }),
		}
	)
);
