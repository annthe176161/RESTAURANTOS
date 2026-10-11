import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean; // Trạng thái mở rộng (true: w-64) hoặc thu nhỏ (false: w-20) trên desktop
  isMobileSidebarOpen: boolean; // Trạng thái mở drawer trên thiết bị di động
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  isMobileSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
}));
