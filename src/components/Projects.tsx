// src/components/Projects.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProjects, Project } from '../hooks/useProjects';
import { format } from 'date-fns';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';

export default function Projects() {
  const { projects, add, update, remove } = useProjects();
  const [showAdd, setShowAdd] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white cursor-pointer select-none flex items-center" onClick={() => setIsOpen((p) => !p)}>
            Project Timelines
            <span className="ml-2 text-gray-500 text-xs sm:text-sm">{isOpen ? '▲' : '▼'}</span>
          </h2>
          <Button onClick={() => setShowAdd(true)} size="sm">+ Add Projects</Button>
        </div>

        {isOpen && (
          <ul className="space-y-3">
            {[...projects]
              .sort((a, b) => {
                const dateA = a[1].startDate ? new Date(a[1].startDate).getTime() : 0;
                const dateB = b[1].startDate ? new Date(b[1].startDate).getTime() : 0;
                return dateB - dateA;
              })
              .map(([id, p]) => (
                <li key={id} className="border-b pb-2 last:border-b-0">
                  <ProjectRow id={id} project={p} onUpdate={update} onRemove={remove} />
                </li>
              ))}
          </ul>
        )}
      </div>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)} title="Add Project" size="sm">
          <ProjectForm
            onSave={(p) => { add(p); setShowAdd(false); }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}
    </>
  );
}

function ProjectForm({ onSave, onCancel }: { onSave: (p: Omit<Project, 'id'>) => void; onCancel: () => void; }) {
  const { register, handleSubmit } = useForm<Omit<Project, 'id'>>();

  return (
    <form onSubmit={handleSubmit(onSave)} className="grid gap-2 sm:grid-cols-4">
      <Input {...register('name', { required: true })} placeholder="Project name" autoFocus />
      <Select {...register('status')}>
        <option>Not Started</option>
        <option>In Progress</option>
        <option>Completed</option>
      </Select>
      <Input {...register('startDate')} type="date" />
      <Input {...register('endDate')} type="date" />
      <div className="col-span-4 flex flex-col sm:flex-row justify-end gap-2 mt-2">
        <Button type="button" onClick={onCancel} variant="danger" size="sm">Cancel</Button>
        <Button type="submit" variant="primary" size="sm">Save</Button>
      </div>
    </form>
  );
}

function ProjectRow({ id, project, onUpdate, onRemove }: { id: string; project: Project; onUpdate: (id: string, p: Partial<Project>) => void; onRemove: (id: string) => void; }) {
  const { register, handleSubmit } = useForm({ defaultValues: project });
  const [editing, setEditing] = useState(false);

  const statusColors: Record<string, string> = {
    'Not Started': 'bg-gray-500',
    'In Progress': 'bg-blue-500',
    'Completed': 'bg-green-500',
  };

  return (
    <div>
      {editing ? (
        <form onSubmit={handleSubmit((d) => { onUpdate(id, d); setEditing(false); })} className="grid gap-2 sm:grid-cols-4">
          <Input {...register('name')} />
          <Select {...register('status')}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </Select>
          <Input {...register('startDate')} type="date" />
          <Input {...register('endDate')} type="date" />
          <div className="col-span-4 flex flex-col sm:flex-row gap-2 mt-2">
            <Button variant="primary" size="sm">Save</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${statusColors[project.status]}`}>{project.status}</span>
              <span className="font-medium text-gray-800 dark:text-white">{project.name}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {project.startDate && format(new Date(project.startDate), 'MMM d')} – {project.endDate && format(new Date(project.endDate), 'MMM d')}
            </p>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button onClick={() => setEditing(true)} variant="glass-primary" size="sm">Edit</Button>
            <Button onClick={() => onRemove(id)} variant="glass-danger" size="sm">Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
}
