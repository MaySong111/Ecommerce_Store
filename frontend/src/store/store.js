import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist((set) => ({
    count: 0,
    increment: (number) => set((state) => ({ count: state.count + number })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    updateCount: (newCount) => set({ count: newCount }),
  })),
  { name: "counter-storage" }
);

export default useStore;
