// src/hooks/useProjects.ts
import { useList } from 'react-firebase-hooks/database';
import { ref, push, update, remove, DataSnapshot } from 'firebase/database';
import { db } from '../lib/firebase';

export type Status = 'Not Started' | 'In Progress' | 'Completed';

export interface Project {
  name: string;
  status: Status;
  startDate?: string;
  endDate?: string;
}

export const useProjects = () => {
  const [snap] = useList(ref(db, 'projects'));

  const projects: [string, Project][] =
    snap?.map((s: DataSnapshot) => [s.key!, s.val()]) ?? [];

  return {
    projects,
    add: (p: Omit<Project, 'id'>) => push(ref(db, 'projects'), p),
    update: (id: string, p: Partial<Project>) =>
      update(ref(db, `projects/${id}`), p),
    remove: (id: string) => remove(ref(db, `projects/${id}`)),
  };
};