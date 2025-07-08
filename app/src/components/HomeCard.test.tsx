import { render, screen } from '@testing-library/react';
import { HomeCard } from './HomeCard';

test('renders label', () => {
  render(<HomeCard href="/test" label="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
