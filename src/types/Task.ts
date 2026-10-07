export const priorities = [
  "Low",
  "Medium",
  "High",
  "Critical",
] as const;

export type Priority = typeof priorities[number];

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
};
