'use client'
import { createContext, useContext, useState } from 'react'
import type { Graph } from '@/graphSchema'

export type CurriculumGraphContextValue = {
  graph: Graph | null
  setGraph: (g: Graph | null) => void
}

const defaultValue: CurriculumGraphContextValue = {
  graph: null,
  setGraph: () => {},
}

export const CurriculumGraphContext = createContext<CurriculumGraphContextValue>(defaultValue)

export function useCurriculumGraph() {
  return useContext(CurriculumGraphContext)
}

export function CurriculumGraphProvider({ children }: { children: React.ReactNode }) {
  const [graph, setGraph] = useState<Graph | null>(null)
  return (
    <CurriculumGraphContext.Provider value={{ graph, setGraph }}>
      {children}
    </CurriculumGraphContext.Provider>
  )
}
