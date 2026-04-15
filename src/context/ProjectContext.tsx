import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Project, ProjectFormData } from '../types/project';
import { projectService } from '../services/projectsService';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  addProject: (data: ProjectFormData) => Promise<void>;
  editProject: (id: string, data: Partial<ProjectFormData>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  setActiveProjectId: (id: string | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    localStorage.getItem('activeProjectId')
  );

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem('activeProjectId', activeProjectId);
    } else {
      localStorage.removeItem('activeProjectId');
    }
  }, [activeProjectId]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  const addProject = async (data: ProjectFormData) => {
    const newProject = await projectService.createProject(data);
    setProjects(prev => [...prev, newProject]);
  };

  const editProject = async (id: string, data: Partial<ProjectFormData>) => {
    const updatedProject = await projectService.updateProject(id, data);
    setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
  };

  const removeProject = async (id: string) => {
    await projectService.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

return (
    <ProjectContext.Provider value={{ 
      projects, 
      activeProject,
      setActiveProjectId,
      isLoading, 
      addProject, 
      editProject, 
      removeProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};