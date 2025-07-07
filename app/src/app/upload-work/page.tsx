'use client'

import { useState } from 'react';

export default function UploadWorkPage() {
  const [status, setStatus] = useState('');
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload Work</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const data = new FormData(form);
          const res = await fetch('/api/upload-work', {
            method: 'POST',
            body: data,
          });
          if (res.ok) {
            setStatus('Uploaded');
            form.reset();
          } else {
            const j = await res.json();
            setStatus(j.error || 'Error');
          }
        }}
      >
        <div>
          <label>
            Student Name
            <input name="studentName" required />
          </label>
        </div>
        <div>
          <label>
            Date Completed
            <input type="date" name="completedDate" />
          </label>
        </div>
        <div>
          <label>
            Summary
            <textarea name="summary" required />
          </label>
        </div>
        <div>
          <label>
            File
            <input type="file" name="file" required />
          </label>
        </div>
        <button type="submit">Upload</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
