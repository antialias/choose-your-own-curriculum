import { render, screen } from '@testing-library/react';
import { UploadedWorkList } from './UploadedWorkList';

test('renders uploaded work', () => {
  render(
    <UploadedWorkList
      items={[{ id: '1', studentName: 'Bob', summary: 'Math worksheet', completedAt: null }]}
    />
  );
  expect(screen.getByText('Bob')).toBeInTheDocument();
  expect(screen.getByText(/Math worksheet/)).toBeInTheDocument();
});
