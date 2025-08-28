// src/components/AddAnnouncement.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { push, ref } from "firebase/database";
import { db } from "../lib/firebase";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input, Textarea, Select } from "../ui/Input";

interface FormValues {
  title: string;
  description: string;
  category: "Urgent" | "General" | "Reminder";
}

export default function AddAnnouncement({ postedBy }: { postedBy: string }) {
  const [show, setShow] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await push(ref(db, "announcements"), {
      ...data,
      date: new Date().toISOString(),
      postedBy,
    });
    reset();
    setShow(false);
  };

  return (
    <>
      <Button onClick={() => setShow(true)} size="sm" className="mb-2">
        + Add Announcement
      </Button>

      {show && (
        <Modal title="Add Announcement" onClose={() => setShow(false)} size="sm">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
            <Input
              {...register("title", { required: true })}
              placeholder="Title"
              autoFocus
            />
            <Textarea
              {...register("description", { required: true })}
              placeholder="Description"
              rows={4}
            />
            <Select {...register("category")}>
              <option>Urgent</option>
              <option>General</option>
              <option>Reminder</option>
            </Select>

            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
