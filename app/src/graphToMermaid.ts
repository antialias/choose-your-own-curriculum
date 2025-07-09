import { Graph } from "./graphSchema";

export interface GraphToMermaidOptions {
  /**
   * When true each node label will include a span with data-tags for attaching
   * tooltips. HTML labels require Mermaid's `securityLevel` to be `loose`.
   */
  htmlLabels?: boolean;
}

export function graphToMermaid(
  graph: Graph,
  options: GraphToMermaidOptions = {}
): string {
  const lines = ["graph LR"];
  for (const node of graph.nodes) {
    let label = node.label.replace(/"/g, '\\"');
    if (options.htmlLabels) {
      const span = `<span class='dag-node' data-tags='${node.tags.join(", ")}'>${label}</span>`;
      label = span.replace(/"/g, '\\"');
    }
    lines.push(`  ${node.id}["${label}"]`);
  }
  for (const [from, to] of graph.edges) {
    lines.push(`  ${from} --> ${to}`);
  }
  return lines.join("\n");
}
