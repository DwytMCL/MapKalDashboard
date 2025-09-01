// src/hooks/useEmails.ts
import { useEffect, useState, useCallback } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firestoreDB } from '../lib/firebase';

export type Email = {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  message: string;
  date: Timestamp | null;
};

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(firestoreDB, "emails"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => {
        const v = d.data() as any;
        return {
          id: d.id,
          sender: v.sender ?? "",
          senderEmail: v.senderEmail ?? "",
          subject: v.subject ?? "",
          message: v.message ?? "",
          // Ensure we never put a FieldValue into state
          date: v.date instanceof Timestamp ? (v.date as Timestamp) : null,
        } as Email;
      });
      setEmails(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const add = useCallback(
    async (e: Omit<Email, "id" | "date"> & { date?: Timestamp }) => {
      await addDoc(collection(firestoreDB, "emails"), {
        sender: e.sender,
        senderEmail: e.senderEmail,
        subject: e.subject ?? "",
        message: e.message,
        date: e.date ?? serverTimestamp(),
      });
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await deleteDoc(doc(firestoreDB, "emails", id));
  }, []);

  const search = useCallback(
    (term: string) => {
      const t = term.trim().toLowerCase();
      if (!t) return emails;
      return emails.filter((m) =>
        [m.sender, m.senderEmail, m.subject ?? "", m.message]
          .join(" ")
          .toLowerCase()
          .includes(t)
      );
    },
    [emails]
  );

  return { emails, loading, add, remove, search };
}
