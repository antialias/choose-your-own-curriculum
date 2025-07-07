'use client'

import { useState, useEffect } from 'react';
const styles = {
  container: { padding: '2rem' },
  list: { display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-start', gap: '0.25rem' },
  button: { marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' },
  graph: { marginTop: '2rem', textAlign: 'left' as const },
};

const skills = [
  'Algebra',
  'Geometry',
  'Trigonometry',
  'Precalculus',
  'Calculus',
  'Linear Algebra',
  'Differential Equations',
  'Discrete Mathematics',
  'Probability and Statistics',
  'Real Analysis',
  'Complex Analysis',
  'Abstract Algebra',
  'Topology',
];

export function MathSkillSelector() {
  const [selected, setSelected] = useState<string[]>([]);
  const [graph, setGraph] = useState('');
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  // Load mermaid from CDN once on mount
  useEffect(() => {
    if (document.getElementById('mermaid-script')) {
      setMermaidLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'mermaid-script';
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.onload = () => {
      const m = (window as unknown as { mermaid: { initialize: (opts: unknown) => void } }).mermaid;
      m.initialize({ startOnLoad: false });
      setMermaidLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const m = (window as unknown as { mermaid?: { render: (id: string, code: string, cb: (svg: string) => void) => void } }).mermaid;
    if (!graph || !mermaidLoaded || !m) return;
    m.render('math-graph', graph, (svg: string) => {
      const container = document.getElementById('graph-container');
      if (container) container.innerHTML = svg;
    });
  }, [graph, mermaidLoaded]);

  const toggle = (skill: string) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const generate = async () => {
    const res = await fetch('/api/generate-graph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topics: selected }),
    });
    if (res.ok) {
      const data = (await res.json()) as { graph: string };
      setGraph(data.graph);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.list}>
        {skills.map((skill) => (
          <label key={skill}>
            <input
              type="checkbox"
              checked={selected.includes(skill)}
              onChange={() => toggle(skill)}
            />{' '}
            {skill}
          </label>
        ))}
      </div>
      <button style={styles.button} onClick={generate}>
        Generate Graph
      </button>
      {graph && <div id="graph-container" style={styles.graph} />}
    </div>
  );
}
