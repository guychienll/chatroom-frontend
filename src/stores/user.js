import { create } from "zustand";

const useUserStore = create((set) => ({
    profile: null,
    setProfile: (profile) => set(() => ({ profile })),
    cleanProfile: () => set(() => ({ profile: null })),
}));

export default useUserStore;
