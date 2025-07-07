import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MathSkillSelector } from './MathSkillSelector';

vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ graph: 'g' }) }));
// provide dummy mermaid implementation
(globalThis as Record<string, unknown>).mermaid = {
  render: vi.fn(),
  initialize: vi.fn(),
};

test('calls API with selected topics', async () => {
  render(<MathSkillSelector />);
  fireEvent.click(screen.getByLabelText('Algebra'));
  fireEvent.click(screen.getByText('Generate Graph'));
  expect(fetch).toHaveBeenCalledWith('/api/generate-graph', expect.objectContaining({ method: 'POST' }));
  const mermaid = (globalThis as { mermaid: { render: vi.Mock } }).mermaid;
  await waitFor(() => expect(mermaid.render).toHaveBeenCalled());
});
