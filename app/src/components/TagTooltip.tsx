import { Tooltip } from './Tooltip';
import { Graph } from '@/graphSchema';
import { TagPill, TagPillProps } from './TagPill';

export type TagTooltipProps = TagPillProps & {
  graph: Graph | null;
};

export function TagTooltip({ text, vector, graph }: TagTooltipProps) {
  if (!graph) return <TagPill text={text} vector={vector} />;
  const nodes = graph.nodes.filter((n) => n.tags.includes(text));
  if (nodes.length === 0) return <TagPill text={text} vector={vector} />;
  const content = (
    <div>
      {nodes.map((n) => {
        const fromIds = graph.edges
          .filter((e) => e[1] === n.id)
          .map((e) => e[0]);
        const toIds = graph.edges
          .filter((e) => e[0] === n.id)
          .map((e) => e[1]);
        const fromLabels = graph.nodes
          .filter((x) => fromIds.includes(x.id))
          .map((x) => x.label)
          .join(', ');
        const toLabels = graph.nodes
          .filter((x) => toIds.includes(x.id))
          .map((x) => x.label)
          .join(', ');
        return (
          <div key={n.id} style={{ marginBottom: '0.25rem' }}>
            <div style={{ fontWeight: 'bold' }}>{n.label}</div>
            <div>from: {fromLabels || '-'}</div>
            <div>to: {toLabels || '-'}</div>
          </div>
        );
      })}
    </div>
  );
  return (
    <Tooltip content={content}>
      <TagPill text={text} vector={vector} />
    </Tooltip>
  );
}
