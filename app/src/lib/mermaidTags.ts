import { Graph } from '@/graphSchema';

export function addMermaidTags(container: HTMLElement | null, graph: Graph) {
  if (!container) return;
  const tryAdd = () => {
    const svg = container.querySelector('svg');
    if (!svg) {
      setTimeout(tryAdd, 50);
      return;
    }
    for (const node of graph.nodes) {
      const g = svg.querySelector<SVGGElement>(`#${node.id}`);
      if (!g) continue;
      let title = g.querySelector<SVGTitleElement>('title');
      if (!title) {
        title = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'title'
        ) as SVGTitleElement;
        g.appendChild(title);
      }
      title.textContent = node.tags.join(', ');
    }
  };
  tryAdd();
}
