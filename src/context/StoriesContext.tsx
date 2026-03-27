import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Story, StoryFormData } from '../types/story';

interface StoryContextType {
  stories: Story[];
  isLoading: boolean;
  addStory: (data: StoryFormData) => Promise<void>;
  editStory: (id: string, data: Partial<Story>) => Promise<void>;
  removeStory: (id: string) => Promise<void>;
  getProjectStories: (projectId: string) => Story[];
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/stories';

export const StoryProvider = ({ children }: { children: ReactNode }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const loadStories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStories();
  }, []);

  // Add: Calculate position to place new story at the end of the column
  const addStory = async (data: StoryFormData) => {
    const storiesInColumn = stories.filter(
      s => s.projectId === data.projectId && s.status === data.status
    );

    const newStoryRequest = {
      ...data,
      position: storiesInColumn.length * 1000, // Use spacing for future insertions
      createdAt: new Date().toISOString()
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStoryRequest),
    });
    const savedStory = await response.json();
    setStories(prev => [...prev, savedStory]);
  };

  // Edit: PATCH method is used to update only specific fields like status or position
  const editStory = async (id: string, data: Partial<Story>) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const updatedStory = await response.json();
    setStories(prev => prev.map(s => s.id === id ? updatedStory : s));
  };

  const removeStory = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setStories(prev => prev.filter(s => s.id !== id));
  };

  // Get: Filter by project and sort by position for correct Kanban view
  const getProjectStories = (projectId: string) => {
    return stories
      .filter(s => s.projectId === projectId)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  };

  return (
    <StoryContext.Provider value={{ 
      stories, 
      isLoading, 
      addStory, 
      editStory, 
      removeStory,
      getProjectStories
    }}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStories must be used within a StoryProvider");
  }
  return context;
};