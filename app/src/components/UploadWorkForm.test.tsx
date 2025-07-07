import { render, screen } from '@testing-library/react';
import { UploadWorkForm } from './UploadWorkForm';

test('renders upload button', () => {
  render(<UploadWorkForm />);
  expect(screen.getByText('Upload')).toBeInTheDocument();
});
