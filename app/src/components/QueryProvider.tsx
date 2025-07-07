'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          queryFn: async ({ queryKey }) => {
            const path = String(queryKey[0])
            const res = await fetch(`/api/${path}`)
            if (!res.ok) throw new Error('Network response was not ok')
            return res.json()
          },
        },
      },
    })
  )
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
