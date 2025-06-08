import { create } from "zustand";

export const useResourceStore = create((set) => ({
  resources: [],
  setResource: (resource) => set({ resource }),
  getResource: async () => {
    const res = await fetch("/api/resources");
    const data = await res.json();
    set({ resources: data.data });
  },
}));
