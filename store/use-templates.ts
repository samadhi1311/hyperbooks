import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemplateKey } from '@/templates';

interface TemplateStore {
	selectedTemplate: TemplateKey;
	setTemplate: (template: TemplateKey) => void;
}

export const useTemplateStore = create<TemplateStore>()(
	persist(
		(set) => ({
			selectedTemplate: 'quiet',
			setTemplate: (template) => set({ selectedTemplate: template }),
		}),
		{
			name: 'hyperbooks-template-storage',
			partialize: (state) => ({ selectedTemplate: state.selectedTemplate }),
		}
	)
);
