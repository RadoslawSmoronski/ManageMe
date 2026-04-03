import type { PriorityStatus } from '../types/common';

interface BaseTask {
  id: string;
  name: string;
  description: string;
  priority: PriorityStatus;
  storyId: string;
  estimatedTime: number;
  createdAt: string;
  position: number;
}

export interface PlannedTask extends BaseTask {
  status: "Planned";
  ownerId?: string; 
  startedAt?: never;
  finishedAt?: never;
}

export interface DoingTask extends BaseTask {
  status: "Doing";
  ownerId: string;
  startedAt: string;
  finishedAt?: never;
}

export interface CompletedTask extends BaseTask {
  status: "Completed";
  ownerId: string;
  startedAt: string;
  finishedAt: string;
}

export type Task = PlannedTask | DoingTask | CompletedTask;