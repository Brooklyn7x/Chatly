import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import {
  AuthState,
  AuthActions,
  LoginCredentials,
  RegisterCredentials,
} from "@/lib/auth/types";
import { authService } from "@/lib/auth/authService";

interface ModalState {
  chatPanel: boolean;
  createGroup: boolean;
  createPrivateChat: boolean;
  contacts: boolean;
  settings: boolean;
  editChatInfo: boolean;
  deleteChatDialog: boolean;
  addMemberDialog: boolean;
  removeMemberDialog: boolean;
  appSetting: boolean;
  profileSettings: boolean;
  appSettings: boolean;
}

interface AppStore extends AuthState, AuthActions {
  // UI State
  isMobile: boolean;
  sidebarCollapsed: boolean;

  // Modal State
  modals: ModalState;

  // UI Actions
  setMobile: (isMobile: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Modal Actions
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
}

const initialModalState: ModalState = {
  chatPanel: false,
  createGroup: false,
  createPrivateChat: false,
  contacts: false,
  settings: false,
  editChatInfo: false,
  deleteChatDialog: false,
  addMemberDialog: false,
  removeMemberDialog: false,
  appSetting: false,
  profileSettings: false,
  appSettings: false,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Auth State (from useAuthStore)
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      // UI State
      isMobile: false,
      sidebarCollapsed: false,

      // Modal State
      modals: initialModalState,

      // Auth Actions (from useAuthStore)
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        console.log(credentials, "credentials");
        const result = await authService.login(credentials);

        console.log(result, "result");
        if (result.success && result.user) {
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: result.error || "Login failed",
          });
        }

        return result;
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });

        const result = await authService.register(credentials);
        console.log(result);

        if (result.success && result.user) {
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: result.error || "Registration failed",
          });
        }

        return result;
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } catch (error) {
          // Continue with logout even if API call fails
          console.error("Logout API call failed:", error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            modals: initialModalState, // Reset modals on logout
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true, error: null });

        const result = await authService.getCurrentUser();

        if (result.success && result.user) {
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            isInitialized: true,
          });
          return true;
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: result.error,
            isInitialized: true,
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),

      reset: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isInitialized: false,
          modals: initialModalState,
        }),

      // UI Actions
      setMobile: (isMobile: boolean) => set({ isMobile }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setSidebarCollapsed: (collapsed: boolean) =>
        set({
          sidebarCollapsed: collapsed,
        }),

      // Modal Actions
      openModal: (modalName: keyof ModalState) =>
        set((state) => ({
          modals: { ...state.modals, [modalName]: true },
        })),

      closeModal: (modalName: keyof ModalState) =>
        set((state) => ({
          modals: { ...state.modals, [modalName]: false },
        })),

      closeAllModals: () => set({ modals: initialModalState }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
        isMobile: state.isMobile,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

export default useAppStore;
