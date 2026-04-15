import { API_BASE_URL } from "../config/api";
import type { Project, ProjectFormData} from '../types/project'

const API_URL = `${API_BASE_URL}/projects`;

export const projectsService = {
    
  getProjects: async (): Promise<Project[]> => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },

  createProject: async (data: ProjectFormData): Promise<Project> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },

  updateProject: async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
  },

  deleteProject: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete project');
  }

};