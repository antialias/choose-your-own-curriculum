'use client'

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const toggle = (skill: string) => {
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const generate = async () => {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/generate-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: selected }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || 'Unknown error');
        setStatus('error');
        return;
      }
      const data = (await res.json()) as { graph: Graph };
      setGraph(data.graph);
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
        {t('generateGraph')}
      </button>
      {status === 'loading' && (
        <p className={css({ color: 'blue.600', mt: '2' })}>{t('generatingGraph')}</p>
      )}
      {status === 'error' && (
        <p className={css({ color: 'red.600', mt: '2' })}>
          {t('failedGenerateGraph', { error })}
        </p>
      )}
      {graph && (
        <button style={styles.button} onClick={save} disabled={saved}>
          {saved ? t('saved') : t('saveGraph')}
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
