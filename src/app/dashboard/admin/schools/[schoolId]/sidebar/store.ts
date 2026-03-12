import { create } from 'zustand';
import { z } from 'zod';

type SidebarItem = {
  id: string;
  type: 'link' | 'divider' | 'group';
  label?: string;
  icon?: string;
  href?: string;
  roles: string[];
  children?: SidebarItem[];
};

// Define the Zod schema for a sidebar item.
const sidebarItemSchema: z.ZodType<SidebarItem> = z.object({
  id: z.string(),
  type: z.enum(['link', 'divider', 'group']),
  label: z.string().optional(),
  icon: z.string().optional(),
  href: z.string().optional(),
  roles: z.array(z.string()),
  children: z.lazy(() => z.array(sidebarItemSchema)).optional(),
});

// Define the Zod schema for the sidebar configuration.
const sidebarConfigSchema = z.object({
  items: z.array(sidebarItemSchema),
});

// Define the types for the sidebar configuration based on the Zod schema.
type SidebarConfig = z.infer<typeof sidebarConfigSchema>;

type SidebarState = {
  config: SidebarConfig;
  loading: boolean;
  error: string | null;
  fetchConfig: (schoolId: string) => Promise<void>;
  setConfig: (config: SidebarConfig) => void;
  saveConfig: (schoolId: string) => Promise<void>;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: Partial<SidebarItem>) => void;
};

export const useSidebarStore = create<SidebarState>((set, get) => ({
  config: { items: [] },
  loading: true,
  error: null,
  fetchConfig: async (schoolId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `/api/admin/schools/${schoolId}/sidebar`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch sidebar configuration');
      }
      const data = await response.json();
      set({ config: data, loading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : 'An unknown error occurred',
        loading: false,
      });
    }
  },
  setConfig: (config: SidebarConfig) => set({ config }),
  saveConfig: async (schoolId: string) => {
    set({ error: null });
    const result = sidebarConfigSchema.safeParse(get().config);
    if (!result.success) {
      set({ error: 'Validation failed: ' + result.error.message });
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/schools/${schoolId}/sidebar`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result.data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save sidebar configuration');
      }
      // Optionally, handle success
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  },
  addItem: () => {
    const newItem: SidebarItem = {
      id: `new-${Date.now()}`,
      type: 'link',
      label: 'New Item',
      roles: [],
    };
    set((state) => ({
      config: { items: [...state.config.items, newItem] },
    }));
  },
  removeItem: (index: number) => {
    set((state) => {
      const newItems = [...state.config.items];
      newItems.splice(index, 1);
      return { config: { items: newItems } };
    });
  },
  updateItem: (index: number, item: Partial<SidebarItem>) => {
    set((state) => {
      const newItems = [...state.config.items];
      newItems[index] = { ...newItems[index], ...item };
      return { config: { items: newItems } };
    });
  },
}));