export type UploadedWork = {
  id: string;
  studentName: string;
  summary: string;
  completedAt: Date | null;
};

export function UploadedWorkList({ items }: { items: UploadedWork[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <strong>{item.studentName}</strong> - {item.summary}
          {item.completedAt && (
            <span> (completed {item.completedAt.toDateString()})</span>
          )}
        </li>
      ))}
    </ul>
  );
}
