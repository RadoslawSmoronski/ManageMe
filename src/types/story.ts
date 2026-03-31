import type { Priority } from "./priority";

export type StoryStatus = "Todo" | "Doing" | "Done";

export interface Story {
    id: string,
    name: string,
    description: string,
    priority: Priority
    createdAt: Date
    status: StoryStatus
    projectId: string
    position: number
    ownerId: string
}

export type StoryFormData = Omit<Story, "id" | "createdAt">;