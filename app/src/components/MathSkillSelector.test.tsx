import { waitFor, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Mock } from 'vitest';
vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }));
import { MathSkillSelector } from './MathSkillSelector';

vi.stubGlobal('fetch', vi.fn());
const mockFetch = fetch as unknown as Mock;
const user = userEvent.setup();

test('calls API with selected topics and saves', async () => {
  let resolveFetch: (v: { ok: boolean; json: () => Promise<unknown> }) => void;
  mockFetch.mockImplementationOnce(
    () => new Promise((r) => {
      resolveFetch = r;
    })
  );
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) });
  render(<MathSkillSelector />);
  await user.click(screen.getByLabelText('Algebra'));
  await user.click(screen.getByText('Generate Graph'));
  expect(await screen.findByText('Generating graph...')).toBeInTheDocument();
  resolveFetch!({ ok: true, json: () => Promise.resolve({ graph: 'g' }) });
  expect(mockFetch).toHaveBeenCalledWith('/api/generate-graph', expect.objectContaining({ method: 'POST' }));
  // wait for graph to render and save button to appear
  await screen.findByTestId('mermaid');
  await screen.findByText('Save Graph');
  await user.click(screen.getByText('Save Graph'));
  await waitFor(() => expect(screen.getByText('Saved')).toBeInTheDocument());
  expect(mockFetch).toHaveBeenLastCalledWith('/api/topic-dags', expect.objectContaining({ method: 'POST' }));
  // ensure saved state is applied
  await screen.findByText('Saved');
});

test('shows error message on failure', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    json: () => Promise.resolve({ error: 'bad' }),
  });
  render(<MathSkillSelector />);
  await user.click(screen.getByText('Generate Graph'));
  expect(await screen.findByText('Failed to generate graph: bad. Please try again later.')).toBeInTheDocument();
});
