import { render, screen, fireEvent } from '@testing-library/react';
import type { Mock } from 'vitest';
vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }));
import { MathSkillSelector } from './MathSkillSelector';

vi.stubGlobal('fetch', vi.fn());
const mockFetch = fetch as unknown as Mock;

test('calls API with selected topics and saves', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ graph: 'g' }) });
  mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '1' }) });
  render(<MathSkillSelector />);
  fireEvent.click(screen.getByLabelText('Algebra'));
  fireEvent.click(screen.getByText('Generate Graph'));
  await screen.findByTestId('mermaid');
  fireEvent.click(screen.getByText('Save Graph'));
  await screen.findByText('Saved!');
  expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/generate-graph', expect.objectContaining({ method: 'POST' }));
  expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/dags', expect.objectContaining({ method: 'POST' }));
});
