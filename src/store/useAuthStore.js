import { create } from "zustand";
import customFetch from "../utils/axios";
import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../utils/local-storage";

const useAuthStore = create((set) => ({
  user: getUserFromLocalStorage(),
  isLoading: false,
  error: null,

  register: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await customFetch.post("/register", payload);

      const authUser = {
        ...data.user,
        token: data.token,
      };

      addUserToLocalStorage(authUser);
      set({ user: authUser, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Register failed",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await customFetch.post("/login", payload);

      const authUser = {
        ...data.user,
        token: data.token,
      };

      addUserToLocalStorage(authUser);
      set({ user: authUser, isLoading: false });

      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Invalid email or password",
        isLoading: false,
      });

      throw error;
    }
  },

  profile: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await customFetch.get("/profile");

      set((state) => ({
        user: { ...state.user, ...data },
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: "Failed to fetch profile",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await customFetch.post("/logout");
    } catch (e) {
    }

    removeUserFromLocalStorage();
    set({ user: null, isLoading: false });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
