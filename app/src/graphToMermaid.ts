import { Graph } from "./graphSchema";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function graphToMermaid(graph: Graph): string {
  const lines = ["graph LR"];
  for (const node of graph.nodes) {
    const label = escapeHtml(node.label);
    const html = `<span class='node-label' data-node-id='${node.id}'>${label}</span>`;
    const escaped = html.replace(/"/g, '\\"');
    lines.push(`  ${node.id}["${escaped}"]`);
  }
  for (const [from, to] of graph.edges) {
    lines.push(`  ${from} --> ${to}`);
  }
  return lines.join("\n");
}
