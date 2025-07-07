'use client'

import { useState, useEffect } from 'react';
import Mermaid from 'react-mermaid2';
import mermaid from 'mermaid';
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

  useEffect(() => {
    if (graph) {
      mermaid.contentLoaded();
    }
  }, [graph]);

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
      {graph && (
        <div id="graph-container" style={styles.graph}>
          <Mermaid chart={graph} />
        </div>
      )}
    </div>
  );
}
