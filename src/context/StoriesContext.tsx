import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Story, StoryFormData } from "../types/story";
import { storiesService } from "../services/storiesService";

interface StoriesContextType {
  stories: Story[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  loadStories: () => Promise<void>;
  addStory: (data: StoryFormData) => Promise<void>;
  editStory: (id: string, data: Partial<Story>) => Promise<void>;
  removeStory: (id: string) => Promise<void>;
  getProjectStories: (projectId: string) => Story[];
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

export const StoriesProvider = ({ children }: { children: ReactNode }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await storiesService.getStories();
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Failed to fetch stories:", err);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, []);

  const addStory = async (data: StoryFormData) => {
    const storiesInColumn = stories.filter(
      (story) => story.projectId === data.projectId && story.status === data.status
    );

    const newStory: StoryFormData = {
      ...data,
      position: storiesInColumn.length * 1000,
    };

    const savedStory = await storiesService.createStory(newStory);
    setStories((prev) => [...prev, savedStory]);
  };

  const editStory = async (id: string, data: Partial<Story>) => {
    const updatedStory = await storiesService.updateStory(id, data);
    setStories((prev) => prev.map((story) => (story.id === id ? updatedStory : story)));
  };

  const removeStory = async (id: string) => {
    await storiesService.deleteStory(id);
    setStories((prev) => prev.filter((story) => story.id !== id));
  };

  const getProjectStories = (projectId: string) => {
    return stories
      .filter((story) => story.projectId === projectId)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  };

  return (
    <StoriesContext.Provider
      value={{
        stories,
        isLoading,
        hasLoaded,
        error,
        loadStories,
        addStory,
        editStory,
        removeStory,
        getProjectStories,
      }}
    >
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error("useStories must be used within a StoriesProvider");
  }
  return context;
};