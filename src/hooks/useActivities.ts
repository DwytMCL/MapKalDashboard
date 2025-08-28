// src/hooks/useActivities.ts
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';

import { ref, onValue, set, remove, update as fbUpdate, push } from 'firebase/database';

export interface Activity {
  type: string;
  date: string;
  participants: string[];
}

export function useActivities() {
  const [activities, setActivities] = useState<[string, Activity][]>([]);

  useEffect(() => {
    const activitiesRef = ref(db, 'activities');
    const unsubscribe = onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setActivities(Object.entries(data)); // [id, Activity][]
    });

    return () => unsubscribe();
  }, []);

  const add = (activity: Activity) => {
    const activitiesRef = ref(db, 'activities');
    const newRef = push(activitiesRef);
    set(newRef, activity);
  };

  const removeActivity = (id: string) => {
    remove(ref(db, `activities/${id}`));
  };

  const update = (id: string, activity: Activity) => {
    fbUpdate(ref(db, `activities/${id}`), activity);
  };

  return { activities, add, remove: removeActivity, update };
}
