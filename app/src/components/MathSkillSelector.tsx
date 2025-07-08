'use client'

import { useState } from 'react';
import { css } from '@/styled-system/css';
import Mermaid from 'react-mermaid2';
import { Graph } from '@/graphSchema';
import { graphToMermaid } from '@/graphToMermaid';
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
  const [graph, setGraph] = useState<Graph | null>(null);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const MAX_TOKENS = 800;

  const toggle = (skill: string) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const generate = async () => {
    setStatus('loading');
    setError(null);
    setProgress(0);
    try {
      const res = await fetch('/api/generate-graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ topics: selected }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || 'Unknown error');
        setStatus('error');
        return;
      }
      if (res.headers.get('content-type')?.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let count = 0;
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const clean = chunk.replace(/(^|\n)\s*data:\s*/g, '$1');
          buffer += clean;
          count += clean.split(/\s+/).length;
          setProgress(count);
          try {
            const obj = JSON.parse(buffer) as { graph: Graph };
            setGraph(obj.graph);
          } catch {
            // ignore partial JSON
          }
        }
        setSaved(false);
        setStatus('idle');
      } else {
        const data = (await res.json()) as { graph: Graph };
        setGraph(data.graph);
        setSaved(false);
        setStatus('idle');
      }
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  };

  const save = async () => {
    const res = await fetch('/api/topic-dags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topics: selected, graph }),
    });
    if (res.ok) {
      setSaved(true);
    }
  };

  const mermaid = graph ? graphToMermaid(graph) : '';
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
      <div style={{ width: '100%', background: '#eee', height: '0.5rem', marginTop: '0.5rem' }}>
        <div
          style={{
            width: `${(progress / MAX_TOKENS) * 100}%`,
            height: '100%',
            background: '#4caf50',
            transition: 'width 0.2s linear',
          }}
        />
      </div>
      {status === 'loading' && (
        <p className={css({ color: 'blue.600', mt: '2' })}>Generating graph...</p>
      )}
      {status === 'error' && (
        <p className={css({ color: 'red.600', mt: '2' })}>
          Failed to generate graph: {error}. Please try again later.
        </p>
      )}
      {graph && (
        <button style={styles.button} onClick={save} disabled={saved}>
          {saved ? 'Saved' : 'Save Graph'}
        </button>
      )}
      {graph && (
        <div id="graph-container" style={styles.graph}>
          {/* re-mount Mermaid when chart string changes to ensure re-render */}
            <Mermaid key={mermaid} chart={mermaid} />
          </div>
        )}
    </div>
  );
}
