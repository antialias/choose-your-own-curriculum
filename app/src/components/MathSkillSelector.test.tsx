import { render, screen, fireEvent } from '@testing-library/react';
vi.mock('react-mermaid2', () => ({ default: () => <div data-testid="mermaid" /> }));
import { MathSkillSelector } from './MathSkillSelector';

vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ graph: 'g' }) }));

test('calls API with selected topics', async () => {
  render(<MathSkillSelector />);
  fireEvent.click(screen.getByLabelText('Algebra'));
  fireEvent.click(screen.getByText('Generate Graph'));
  expect(fetch).toHaveBeenCalledWith('/api/generate-graph', expect.objectContaining({ method: 'POST' }));
});
