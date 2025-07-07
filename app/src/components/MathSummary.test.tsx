import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MathSummary } from './MathSummary';

test('renders inline math', () => {
  render(<MathSummary text="a $x^2$ b" />);
  const math = document.querySelector('.katex');
  expect(math).toBeInTheDocument();
  expect(math).toHaveTextContent('x');
});
