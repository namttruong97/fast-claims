import { TApplication } from "@/src/types/application";
import { TEmployee } from "@/src/types/employee";
import { IModalEdit } from "@components/ModalEdit";
import { create } from "zustand";

export interface UserState {
  applicationData: TApplication;
  setApplicationData: (data: TApplication) => void;

  loggedInUser: TEmployee;
  setLoggedInUser: (data: any) => void;

  listUsers: TEmployee[];
  setListUser: (data: TEmployee[]) => void;

  editModal: IModalEdit;
  setEditModal: (editModal: IModalEdit) => void;
}

export const useUserStateStore = create<UserState>((set, get) => ({
  applicationData: null,
  setApplicationData: (data) => set(() => ({ applicationData: data })),

  loggedInUser: null,
  setLoggedInUser: (data: TEmployee) => set(() => ({ loggedInUser: data })),

  listUsers: [],
  setListUser: (data: TEmployee[]) => set(() => ({ listUsers: data })),

  editModal: {
    isOpen: false,
    data: undefined,
  },
  setEditModal: (editModal: IModalEdit) => set(() => ({ editModal })),
}));

export default useUserStateStore;
