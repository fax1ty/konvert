import { create } from "zustand";

interface AppStore {
  progress: number | null;
  setProgress: (v: AppStore["progress"]) => void;
  task: string | null;
  setTask: (v: AppStore["task"]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  progress: null,
  task: null,
  setProgress: (v) => set({ progress: v }),
  setTask: (v) => set({ task: v }),
}));
