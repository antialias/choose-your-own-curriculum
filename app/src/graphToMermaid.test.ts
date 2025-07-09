import { describe, it, expect } from 'vitest';
import { graphToMermaid } from './graphToMermaid';
import type { Graph } from './graphSchema';

const graph: Graph = {
  nodes: [
    { id: 'a', label: 'Node A', desc: '', prereq: [], tags: ['t1', 't2', 't3'] },
    { id: 'b', label: 'Node "B"', desc: '', prereq: [], tags: ['t1', 't2', 't3'] },
  ],
  edges: [ ['a', 'b'] ],
};

describe('graphToMermaid', () => {
  it('converts graph to mermaid syntax', () => {
    const mermaid = graphToMermaid(graph);
    expect(mermaid).toContain('graph LR');
    expect(mermaid).toContain(
      'a["<span class=\'node-label\' data-node-id=\'a\'>Node A</span>"]'
    );
    expect(mermaid).toContain(
      'b["<span class=\'node-label\' data-node-id=\'b\'>Node &quot;B&quot;</span>"]'
    );
    expect(mermaid).toContain('a --> b');
  });
});
