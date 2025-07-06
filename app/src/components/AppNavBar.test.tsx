import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AppNavBar } from './AppNavBar';
import { useSession } from 'next-auth/react';

vi.mock('next-auth/react', () => {
  return {
    useSession: vi.fn(() => ({ data: null })),
    signIn: vi.fn(),
    signOut: vi.fn(),
  };
});

test('shows sign in when not authenticated', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (useSession as any).mockReturnValue({ data: null });
  render(<AppNavBar />);
  expect(screen.getByText('Sign in')).toBeInTheDocument();
});

test('shows sign out when authenticated', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (useSession as any).mockReturnValue({ data: { user: { id: '1' } } });
  render(<AppNavBar />);
  expect(screen.getByText('Sign out')).toBeInTheDocument();
});
