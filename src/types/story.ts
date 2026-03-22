export type StoryPriority = "Low" | "Medium" | "High";
export type StoryStatus = "Todo" | "Doing" | "Done";

export interface Story {
    id: string,
    name: string,
    description: string,
    priority: StoryPriority
    createdAt: Date
    status: StoryStatus
    ownerId: string
}