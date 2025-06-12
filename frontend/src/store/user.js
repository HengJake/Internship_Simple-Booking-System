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
  getUserById: async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message, data: "" };
      }

      return { success: true, message: "User fetched", data: data.data };
    } catch (error) {
      return { success: false, message: "Error fetching user" };
    }
  },
  updateUser: async (updatedUser) => {
    const res = await fetch(`/api/users/${updatedUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
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


