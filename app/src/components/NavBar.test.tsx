import { render, screen } from '@testing-library/react';
import { NavBar } from './NavBar';
import { useSession } from 'next-auth/react';
import type { Mock } from 'vitest';

vi.mock('next-auth/react', async () => {
  const actual = (await vi.importActual<typeof import('next-auth/react')>('next-auth/react'));
  return {
    ...actual,
    useSession: vi.fn(),
    signOut: vi.fn(),
  };
});
const mockedUseSession = useSession as unknown as Mock;

test('shows sign in link when unauthenticated', () => {
  mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  render(<NavBar />);
  expect(screen.getByText('Sign in')).toBeInTheDocument();
});

test('shows sign out when authenticated', () => {
  mockedUseSession.mockReturnValue({ data: { user: { name: 'a' }, expires: '1' }, status: 'authenticated' });
  render(<NavBar />);
  expect(screen.getByText('Sign out')).toBeInTheDocument();
});

test('shows uploaded work link', () => {
  mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  render(<NavBar />);
  expect(screen.getByText('Uploaded Work')).toBeInTheDocument();
});

test('shows topic dags link', () => {
  mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  render(<NavBar />);
  expect(screen.getByText('Topic DAGs')).toBeInTheDocument();
});
