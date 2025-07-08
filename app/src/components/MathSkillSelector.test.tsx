import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Mock } from 'vitest';
vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }));
vi.mock('mermaid', () => ({ parse: vi.fn() }));
import { MathSkillSelector } from './MathSkillSelector';

vi.stubGlobal('fetch', vi.fn());
const mockFetch = fetch as unknown as Mock;
const user = userEvent.setup();

test('calls API with selected topics and saves', async () => {
  const res = new Response('graph');
  mockFetch.mockResolvedValueOnce(res);
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) });
  render(<MathSkillSelector />);
  await user.click(screen.getByLabelText('Algebra'));
  await user.click(screen.getByText('Generate Graph'));
  expect(await screen.findByText('building graph…')).toBeInTheDocument();
  expect(mockFetch).toHaveBeenCalledWith('/api/generate-graph', expect.objectContaining({ method: 'POST' }));
  expect(screen.queryByText('Failed to generate graph:')).not.toBeInTheDocument();
});

test('shows error message on failure', async () => {
  mockFetch.mockResolvedValueOnce({ ok: false } as Response);
  render(<MathSkillSelector />);
  await user.click(screen.getByText('Generate Graph'));
  expect(await screen.findByText('Failed to generate graph: Unknown error. Please try again later.')).toBeInTheDocument();
});
