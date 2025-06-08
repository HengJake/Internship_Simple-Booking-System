// global state
import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  createUser: async (newUser) => {
    // validation in frontend
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: "Name or email has been taken!",
        data: "",
      };
    } else {
      set((state) => ({
        users: [...state.users, data.data],
      }));
      return { success: true, message: "New Account Created", data: data.data };
    }
  },
  loginUser: async (user) => {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();

    if (!data.success) {
      return { success: false, message: data.message, data: "" };
    }

    set((state) => ({
      users: [...state.users, data.data],
    }));
    return { success: true, message: data.message, data: data.data };
  },
}));
