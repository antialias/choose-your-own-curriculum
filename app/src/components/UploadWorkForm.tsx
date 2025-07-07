'use client'

import { useRef, useState, FormEvent } from 'react';

export type UploadWorkFormProps = {
  onUploaded?: () => void;
};

export function UploadWorkForm({ onUploaded }: UploadWorkFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const res = await fetch('/api/upload-work', { method: 'POST', body: data });
    if (res.ok) {
      setError('');
      form.reset();
      onUploaded?.();
    } else {
      const json = await res.json().catch(() => null);
      setError(json?.error || 'Upload failed');
    }
  };
  return (
    <form ref={formRef} onSubmit={submit}>
      <div>
        <input name="file" type="file" required />
      </div>
      <div>
        <label>
          Completed At
          <input name="completedAt" type="date" required />
        </label>
      </div>
      <div>
        <label>
          Student
          <input name="student" type="text" />
        </label>
      </div>
      <div>
        <label>
          Summary
          <textarea name="summary" required />
        </label>
      </div>
      <button type="submit">Upload</button>
      {error && <p>{error}</p>}
    </form>
  );
}
