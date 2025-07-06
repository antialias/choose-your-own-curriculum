import { render, screen } from '@testing-library/react';
import { NavBar } from './NavBar';
import { vi } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
  signOut: vi.fn(),
}));

test('shows sign in link when not authenticated', () => {
  render(<NavBar />);
  expect(screen.getByText('Sign in')).toBeInTheDocument();
});
