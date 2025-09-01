// src/components/Announcements.tsx
import { useListVals } from 'react-firebase-hooks/database';
import { ref, remove, update } from 'firebase/database';
import { useContext, useState } from 'react';
import { db } from '../lib/firebase';
import AddAnnouncement from './AddAnnouncement';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';

export interface Announcement {
  title: string;
  description: string;
  date: string;
  postedBy: string;
  editedBy?: string;
  editedAt?: string;
  category: 'Urgent' | 'General' | 'Reminder';
}

export default function Announcements() {
  const [data] = useListVals<Announcement & { id?: string }>(ref(db, 'announcements'), { keyField: 'id' });
  const announcements = data ?? [];
  const { user } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sorted = [...announcements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string) => remove(ref(db, `announcements/${id}`));

  const handleEdit = (id: string, updated: Partial<Announcement>) => {
    update(ref(db, `announcements/${id}`), {
      ...updated,
      editedBy: user?.displayName ?? user?.email ?? 'Anonymous',
      editedAt: new Date().toISOString(),
    });
    setEditingId(null);
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
        <h2
          className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white cursor-pointer select-none flex items-center"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Announcements
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            {isOpen ? '▲' : '▼'}
          </span>
        </h2>
        <AddAnnouncement postedBy={user?.displayName ?? user?.email ?? 'Anonymous'} />
      </div>

      {isOpen && (
        <ul className="space-y-3">
          {sorted.map((a) => (
            <li key={a.id} className="border-b dark:border-gray-600 pb-2 last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-bold mr-2 px-2 py-0.5 rounded text-white ${
                    a.category === 'Urgent' ? 'bg-red-500' : a.category === 'General' ? 'bg-sky-500' : 'bg-green-500'
                  }`}>{a.category}</span>
                  <p className="font-medium text-gray-800 dark:text-gray-100 break-words">{a.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 break-words">{a.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {a.postedBy} - {new Date(a.date).toLocaleDateString()}
                  </p>
                  {a.editedBy && (
                    <p className="text-xs text-gray-400 italic">
                      Edited by {a.editedBy} - {new Date(a.editedAt!).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-1 mt-1 sm:mt-0 flex-shrink-0">
                  <Button onClick={() => setEditingId(a.id!)} variant="glass-primary" size="sm">Edit</Button>
                  <Button onClick={() => handleDelete(a.id!)} variant="glass-danger" size="sm">Delete</Button>
                </div>
              </div>

              {editingId === a.id && (
                <AnnouncementForm
                  initialData={a}
                  onSave={(updated) => handleEdit(a.id!, updated)}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AnnouncementForm({
  initialData, onSave, onCancel,
}: {
  initialData: Announcement;
  onSave: (updated: Partial<Announcement>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [category, setCategory] = useState(initialData.category);

  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;
    onSave({ title, description, category });
  };

  return (
    <div className="mt-2 p-2 border rounded bg-gray-50 dark:bg-gray-800 flex flex-col gap-2">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <Select value={category} onChange={(e) => setCategory(e.target.value as Announcement['category'])}>
        <option value="Urgent">Urgent</option>
        <option value="General">General</option>
        <option value="Reminder">Reminder</option>
      </Select>
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button onClick={onCancel} variant="secondary" size="sm">Cancel</Button>
        <Button onClick={handleSave} variant="primary" size="sm">Save</Button>
      </div>
    </div>
  );
}

