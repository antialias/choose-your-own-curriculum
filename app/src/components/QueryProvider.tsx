'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async ({ queryKey }) => {
          const [endpoint, init] = queryKey as [string, RequestInit?]
          const url = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`
          const res = await fetch(url, init)
          if (!res.ok) throw new Error('Request failed')
          return res.json()
        },
      },
    },
  }))
  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
