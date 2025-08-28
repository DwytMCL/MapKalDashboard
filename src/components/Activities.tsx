// src/components/Activities.tsx
import { useState } from 'react';
import { useActivities, Activity } from '../hooks/useActivities';
import { format } from 'date-fns';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';

export default function Activities() {
  const { activities, add, update, remove } = useActivities();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const memberCounts: Record<string, number> = {};
  activities.forEach(([_, act]) => {
    act.participants.forEach((p) => {
      memberCounts[p] = (memberCounts[p] || 0) + 1;
    });
  });

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white cursor-pointer select-none flex items-center" onClick={() => setIsOpen((p) => !p)}>
          Member Activities
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{isOpen ? '▲' : '▼'}</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowSummary(true)} size="sm">Member Summary</Button>
          <Button onClick={() => setShowAdd(true)} size="sm">+ Add Activity</Button>
        </div>
      </div>

      {isOpen && (
        activities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No activities added.</p>
        ) : (
          <ul className="space-y-2">
            {[...activities]
              .sort((a, b) => new Date(b[1].date).getTime() - new Date(a[1].date).getTime())
              .map(([id, act]) => (
                <ActivityRow key={id} id={id} activity={act} onEdit={() => setEditingId(id)} onDelete={() => remove(id)} />
              ))}
          </ul>
        )
      )}

      {showAdd && (
        <Modal title="Add Activity" onClose={() => setShowAdd(false)}>
          <ActivityForm
            onSave={(activity) => { add(activity); setShowAdd(false); }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {editingId && (
        <Modal title="Edit Activity" onClose={() => setEditingId(null)}>
          <ActivityForm
            initialData={activities.find(([id]) => id === editingId)?.[1]}
            onSave={(activity) => { update(editingId, activity); setEditingId(null); }}
            onCancel={() => setEditingId(null)}
          />
        </Modal>
      )}

      {showSummary && (
        <Modal title="Member Activity Summary" onClose={() => setShowSummary(false)} size="sm">
          <ul className="space-y-1">
            {Object.entries(memberCounts).map(([name, count]) => (
              <li key={name} className="text-gray-700 dark:text-gray-300">
                {name}: {count} {count === 1 ? 'activity' : 'activities'}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
}

function ActivityRow({ id, activity, onEdit, onDelete }: { id: string; activity: Activity; onEdit: () => void; onDelete: () => void; }) {
  const [showParticipants, setShowParticipants] = useState(false);
  return (
    <li className="border-b dark:border-gray-600 pb-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-100">{activity.type}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(activity.date), 'MMM d, yyyy')}</p>
          {showParticipants && (
            <ul className="ml-2 mt-1 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
              {activity.participants.map((p, i) => (<li key={i}>{p}</li>))}
            </ul>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Button onClick={() => setShowParticipants((p) => !p)} size="sm">
            {showParticipants ? 'Hide Participants' : 'View Participants'}
          </Button>
          <Button onClick={onEdit} variant="glass-primary" size="sm">Edit</Button>
          <Button onClick={onDelete} variant="glass-danger" size="sm">Delete</Button>
        </div>
      </div>
    </li>
  );
}

function ActivityForm({ onSave, onCancel, initialData }: { onSave: (activity: Activity) => void; onCancel: () => void; initialData?: Activity; }) {
  const [type, setType] = useState(initialData?.type || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState<string[]>(initialData?.participants || ['']);

  const handleSave = () => {
    if (!type || participants.some((p) => !p)) return;
    onSave({ type, date, participants: participants.filter(Boolean) });
    setType(''); setDate(new Date().toISOString().split('T')[0]); setParticipants(['']);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input placeholder="Activity type" value={type} onChange={(e) => setType(e.target.value)} />
      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <div className="flex flex-col gap-1">
        {participants.map((p, i) => (
          <div key={i} className="flex gap-2">
            <Input className="flex-1" placeholder={`Participant ${i + 1}`} value={p} onChange={(e) => {
              const copy = [...participants]; copy[i] = e.target.value; setParticipants(copy);
            }} />
            {participants.length > 1 && (
              <Button type="button" variant="danger" size="sm" onClick={() => setParticipants(participants.filter((_, idx) => idx !== i))}>
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button type="button" size="sm" className="mt-1" onClick={() => setParticipants([...participants, ''])}>+ Add Participant</Button>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
        <Button onClick={onCancel} variant="secondary" size="sm">Cancel</Button>
        <Button onClick={handleSave} variant="primary" size="sm">Save</Button>
      </div>
    </div>
  );
}
