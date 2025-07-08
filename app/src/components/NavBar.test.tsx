import { screen } from '@testing-library/react';
import { renderWithI18n } from '@/test-utils';
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

test('shows sign in link when unauthenticated', async () => {
  mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  await renderWithI18n(<NavBar />);
  expect(screen.getByText('Sign in')).toBeInTheDocument();
});

test('shows sign out when authenticated', async () => {
  mockedUseSession.mockReturnValue({ data: { user: { name: 'a' }, expires: '1' }, status: 'authenticated' });
  await renderWithI18n(<NavBar />);
  expect(screen.getByText('Sign out')).toBeInTheDocument();
});

test('shows upload work link', async () => {
  mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  await renderWithI18n(<NavBar />);
  expect(screen.getByText('Upload Work')).toBeInTheDocument();
});

test('shows curriculums link', async () => {
  mockedUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  await renderWithI18n(<NavBar />);
  expect(screen.getByText('Curriculums')).toBeInTheDocument();
});
