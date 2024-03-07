import { create } from "zustand";

const useUserStore = create((set) => ({
    loading: true,
    profile: null,
    setProfile: (profile) => set(() => ({ profile })),
    setLoading: (loading) => set(() => ({ loading })),
    cleanProfile: () => set(() => ({ profile: null })),
}));

export default useUserStore;
