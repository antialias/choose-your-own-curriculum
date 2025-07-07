import { render, screen, fireEvent } from '@testing-library/react';
vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }));
import { MathSkillSelector } from './MathSkillSelector';

const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ graph: 'g' }) });
vi.stubGlobal('fetch', mockFetch);

test('calls API with selected topics', async () => {
  render(<MathSkillSelector />);
  fireEvent.click(screen.getByLabelText('Algebra'));
  fireEvent.click(screen.getByText('Generate Graph'));
  expect(fetch).toHaveBeenCalledWith('/api/generate-graph', expect.objectContaining({ method: 'POST' }));
});

test('shows error message when API returns error', async () => {
  mockFetch.mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({ error: 'bad' }) });
  render(<MathSkillSelector />);
  fireEvent.click(screen.getByText('Generate Graph'));
  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent('bad');
});
