import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemplateKey, PageSize } from '@/templates';

interface TemplateStore {
	selectedTemplate: TemplateKey;
	selectedPageSize: PageSize;
	setTemplate: (template: TemplateKey) => void;
	setPageSize: (pageSize: PageSize) => void;
}

export const useTemplateStore = create<TemplateStore>()(
	persist(
		(set) => ({
			selectedTemplate: 'quiet',
			selectedPageSize: 'A5',
			setTemplate: (template) => set({ selectedTemplate: template }),
			setPageSize: (pageSize) => set({ selectedPageSize: pageSize }),
		}),
		{
			name: 'hyperbooks-template-storage',
			partialize: (state) => ({ 
				selectedTemplate: state.selectedTemplate,
				selectedPageSize: state.selectedPageSize 
			}),
		}
	)
);
