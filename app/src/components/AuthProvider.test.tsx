import { render, screen } from '@testing-library/react';
import AuthProvider from './AuthProvider';

vi.mock('next-auth/react', async () => {
  const actual = (await vi.importActual<typeof import('next-auth/react')>('next-auth/react'));
  return {
    ...actual,
    SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

test('renders children', () => {
  render(
    <AuthProvider>
      <span>child</span>
    </AuthProvider>
  );
  expect(screen.getByText('child')).toBeInTheDocument();
});
