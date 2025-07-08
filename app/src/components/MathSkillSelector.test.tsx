import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Mock } from 'vitest';
vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }));
import { MathSkillSelector } from './MathSkillSelector';

vi.stubGlobal('fetch', vi.fn());
const mockFetch = fetch as unknown as Mock;
const user = userEvent.setup();

test('calls API with selected topics and saves', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ graph: 'g' }) });
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) });
  render(<MathSkillSelector />);
  await user.click(screen.getByLabelText('Algebra'));
  await user.click(screen.getByText('Generate Graph'));
  expect(mockFetch).toHaveBeenCalledWith('/api/generate-graph', expect.objectContaining({ method: 'POST' }));
  // wait for graph to render
  await screen.findByTestId('mermaid');
  await user.click(screen.getByText('Save Graph'));
  expect(mockFetch).toHaveBeenLastCalledWith('/api/topic-dags', expect.objectContaining({ method: 'POST' }));
});
