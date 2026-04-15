import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Project, ProjectFormData } from '../types/project';
import { projectsService } from '../services/projectsService';

interface ProjectsContextType {
  projects: Project[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  loadProjects: () => Promise<void>;
  addProject: (data: ProjectFormData) => Promise<void>;
  editProject: (id: string, data: Partial<ProjectFormData>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectsService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Failed to fetch projects:", err);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, []);

  const addProject = async (data: ProjectFormData) => {
    const newProject = await projectsService.createProject(data);
    setProjects(prev => [...prev, newProject]);
  };

  const editProject = async (id: string, data: Partial<ProjectFormData>) => {
    const updatedProject = await projectsService.updateProject(id, data);
    setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
  };

  const removeProject = async (id: string) => {
    await projectsService.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

return (
    <ProjectsContext.Provider value={{ 
      projects, 
      isLoading, 
      hasLoaded,
      error,
      loadProjects,
      addProject, 
      editProject, 
      removeProject,
    }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};