export interface CreateTaskDto {
  title: string;
  description?: string;
  category: string;
  status?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
}

export enum Role {
  Owner = 'Owner',
  Admin = 'Admin',
  Viewer = 'Viewer',
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  category: string;
  status: string;
  userId: number;
  organizationId: number;
}