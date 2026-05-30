'use client'

import { useQuery } from '@tanstack/react-query'
import { getSpinPlayers, getSpinResults } from '@/services/reportService'

export function useSpinPlayers({ page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: ['spinPlayers', page, limit],
    queryFn: () => getSpinPlayers({ page, limit }),
    placeholderData: (prev) => prev,
  })
}

export function useSpinResults({ page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: ['spinResults', page, limit],
    queryFn: () => getSpinResults({ page, limit }),
    placeholderData: (prev) => prev,
  })
}
