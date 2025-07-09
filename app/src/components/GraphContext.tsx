import { createContext, useContext } from 'react'
import type { Graph } from '@/graphSchema'

export const GraphContext = createContext<Graph | null>(null)

export function useGraph() {
  return useContext(GraphContext)
}
