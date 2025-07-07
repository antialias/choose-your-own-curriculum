import { render, screen, fireEvent } from '@testing-library/react';
vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }));
import { MathSkillSelector } from './MathSkillSelector';

vi.stubGlobal(
  'fetch',
  vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ graph: 'g' }) })
);

test('calls API with selected topics', async () => {
  render(<MathSkillSelector />);
  fireEvent.click(screen.getByLabelText('Algebra'));
  fireEvent.click(screen.getByText('Generate Graph'));
  expect(fetch).toHaveBeenCalledWith('/api/generate-graph', expect.objectContaining({ method: 'POST' }));
});

test('displays graph on success', async () => {
  render(<MathSkillSelector />);
  fireEvent.click(screen.getByText('Generate Graph'));
  expect(await screen.findByTestId('mermaid')).toBeInTheDocument();
});

test('shows error when api responds with error', async () => {
  (fetch as unknown as vi.Mock).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve({ error: 'no graph' }),
  });
  render(<MathSkillSelector />);
  fireEvent.click(screen.getByText('Generate Graph'));
  expect(await screen.findByRole('alert')).toHaveTextContent('no graph');
});
