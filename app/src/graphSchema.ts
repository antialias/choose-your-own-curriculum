import { z } from "zod";

/**
 * A single concept in the tech-tree.
 */
export const NodeSchema = z.object({
  /** Stable snake_case identifier used for edges & code refs */
  id: z.string().regex(/^[a-z0-9_]+$/, "id must be lowercase snake_case"),
  /** Short human-readable title shown in the UI */
  label: z.string(),
  /** 1-sentence description (used for tooltips, search, etc.) */
  desc: z.string(),
  /** Approximate grade level (“K”, “1”, … “12”, “Undergrad”, etc.) */
  grade: z.string().optional(),
  /** Zero or more prerequisite node ids */
  prereq: z.array(z.string()).optional().default([]),
  /** 5-7 context-free tags for embeddings */
  tags: z.array(z.string()).min(3).max(10)
});

/**
 * Edge = [parentId, childId]
 */
export const EdgeSchema = z.tuple([z.string(), z.string()]);

/**
 * Full graph payload.
 */
export const GraphSchema = z.object({
  /** Optional version to help with future migrations */
  version: z.literal("1.0").optional(),
  nodes: z.array(NodeSchema).min(1),
  edges: z.array(EdgeSchema)
});

export type Node = z.infer<typeof NodeSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type Graph = z.infer<typeof GraphSchema>;
