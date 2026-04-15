import { API_BASE_URL } from "../config/api";
import type { Story, StoryFormData } from "../types/story";

const API_URL = `${API_BASE_URL}/stories`;

export const storiesService = {
  getStories: async (): Promise<Story[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch stories");
    return response.json();
  },

  getStoryById: async (id: string): Promise<Story> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch story");
    return response.json();
  },

  getStoriesByProjectId: async (projectId: string): Promise<Story[]> => {
    const response = await fetch(`${API_URL}?projectId=${projectId}`);
    if (!response.ok) throw new Error("Failed to fetch project stories");
    return response.json();
  },

  createStory: async (data: StoryFormData): Promise<Story> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create story");
    return response.json();
  },

  updateStory: async (id: string, data: Partial<Story>): Promise<Story> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update story");
    return response.json();
  },

  deleteStory: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete story");
  },
};