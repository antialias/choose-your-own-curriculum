import { render } from '@testing-library/react';
import { MathText } from './MathText';
import '@testing-library/jest-dom';

describe('MathText', () => {
  it('renders plain text', () => {
    const { getByText } = render(<MathText text="hello" />);
    expect(getByText('hello')).toBeInTheDocument();
  });

  it('renders math', () => {
    const { container } = render(<MathText text="a + b = $c$" />);
    expect(container.querySelector('.katex')).toBeInTheDocument();
  });
});
