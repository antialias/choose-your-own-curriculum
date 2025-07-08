import { Graph } from "./graphSchema";

export function graphToMermaid(graph: Graph): string {
  const lines = ["graph LR"];
  for (const node of graph.nodes) {
    const label = node.label.replace(/"/g, '\\"');
    lines.push(`  ${node.id}["${label}"]`);
  }
  for (const [from, to] of graph.edges) {
    lines.push(`  ${from} --> ${to}`);
  }
  return lines.join("\n");
}
