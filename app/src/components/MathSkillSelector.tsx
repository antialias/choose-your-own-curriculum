'use client'

import { useState } from 'react';
import { css } from '@/styled-system/css';
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
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const toggle = (skill: string) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const generate = async () => {
    setStatus('loading');
    setError(null);
    setGraph('');
    try {
      const res = await fetch('/api/generate-graph/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: selected }),
      });
      if (!res.ok || !res.body) {
        const data = res.ok ? null : ((await res.json()) as { error?: string });
        setError(data?.error || 'Unknown error');
        setStatus('error');
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let chunk = '';
      let timer: NodeJS.Timeout | null = null;
      const schedule = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            mermaid.parse(chunk);
            setGraph(chunk);
          } catch {
            // ignore parse errors
          }
        }, 200);
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunk += decoder.decode(value, { stream: true });
        schedule();
      }
      if (timer) {
        clearTimeout(timer);
        try {
          mermaid.parse(chunk);
          setGraph(chunk);
        } catch {
          // ignore final parse error
        }
      }
      setSaved(false);
      setStatus('idle');
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
      {status === 'loading' && !graph && (
        <p className={css({ color: 'blue.600', mt: '2' })}>Building graph...</p>
      )}
      {status === 'error' && (
        <p className={css({ color: 'red.600', mt: '2' })}>
          Failed to generate graph: {error}. Please try again later.
        </p>
      )}
      {graph && status !== 'loading' && (
        <button style={styles.button} onClick={save} disabled={saved}>
          {saved ? 'Saved' : 'Save Graph'}
        </button>
      )}
      {graph && (
        <div id="graph-container" style={styles.graph}>
          {/* re-mount Mermaid when chart string changes to ensure re-render */}
            <Mermaid key={graph} chart={graph} />
          </div>
        )}
    </div>
  );
}
