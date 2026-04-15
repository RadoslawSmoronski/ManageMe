import { API_BASE_URL } from "../config/api";
import type { User } from "../types/user";

const API_URL = `${API_BASE_URL}/users`;

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },

  // Mocked "current user" endpoint for now.
  getCurrentUser: async (mockUserId = "u1"): Promise<User> => {
    return usersService.getUserById(mockUserId);
  },
};