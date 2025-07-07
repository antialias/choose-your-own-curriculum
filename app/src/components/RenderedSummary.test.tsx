import { render } from '@testing-library/react';
import { RenderedSummary } from './RenderedSummary';
import '@testing-library/jest-dom';

describe('RenderedSummary', () => {
  it('renders inline and block math', () => {
    const { container } = render(
      <RenderedSummary text="Test $x^2$ and $$y=mx+b$$" />
    );
    expect(container.textContent).toContain('Test');
    expect(container.querySelector('.katex')).toBeInTheDocument();
  });
});
