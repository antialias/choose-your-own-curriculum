import { render, screen } from '@testing-library/react';
import { Greeting } from './Greeting';

test('renders greeting', () => {
  render(<Greeting name="Test" />);
  expect(screen.getByText('Hello Test')).toBeInTheDocument();
});
