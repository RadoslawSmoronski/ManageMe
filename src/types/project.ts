import type { ProgressStatus } from "./common";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProgressStatus;
  ownerId: string;
  createdAt: Date;
}

export type ProjectFormData = Omit<Project, "id" | "createdAt">;