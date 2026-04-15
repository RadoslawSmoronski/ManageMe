import { API_BASE_URL } from "../config/api";
import type { Task } from "../types/task";

const API_URL = `${API_BASE_URL}/tasks`;

export const tasksService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch task");
    return response.json();
  },

  getTasksByStoryId: async (storyId: string): Promise<Task[]> => {
    const response = await fetch(`${API_URL}?storyId=${storyId}`);
    if (!response.ok) throw new Error("Failed to fetch story tasks");
    return response.json();
  },

  createTask: async (data: Omit<Task, "id">): Promise<Task> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },

  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
  },
};