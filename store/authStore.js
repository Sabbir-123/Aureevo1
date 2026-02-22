import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

const useAuthStore = create((set) => ({
    user: null,
    session: null,
    loading: true,

    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setLoading: (loading) => set({ loading }),

    initialize: async () => {
        set({ loading: true });
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            set({ session, user: session?.user || null });
        } catch (error) {
            console.error('Error getting session:', error);
            set({ session: null, user: null });
        } finally {
            set({ loading: false });
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user || null, loading: false });
        });
    },

    signOut: async () => {
        set({ loading: true });
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null, session: null });
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            set({ loading: false });
        }
    }
}));

export default useAuthStore;
