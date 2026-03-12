import type { Project, ProjectFormData} from '../types/project'

const API_URL = 'http://localhost:3001/projects';

export const projectService = {
    
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
    return response.json();
  },

  updateProject: async (id: string, data: Partial<ProjectFormData>): Promise<Project> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteProject: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
  }

};