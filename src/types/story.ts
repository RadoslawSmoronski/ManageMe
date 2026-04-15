import type { PriorityStatus, ProgressStatus } from "./common";

export interface Story {
    id: string,
    name: string,
    description: string,
    priority: PriorityStatus
    createdAt: string
    status: ProgressStatus
    projectId: string
    position: number
    ownerId: string
}

export type StoryFormData = Omit<Story, "id" | "createdAt">;