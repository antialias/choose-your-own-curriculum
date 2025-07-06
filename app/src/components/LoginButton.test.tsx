import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { LoginButton } from './LoginButton';

vi.mock('next-auth/react', () => ({ signIn: vi.fn() }));

test('renders sign in button', () => {
  render(<LoginButton />);
  expect(screen.getByText('Sign in')).toBeInTheDocument();
});
