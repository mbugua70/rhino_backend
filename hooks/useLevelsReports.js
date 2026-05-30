'use client'

import { useQuery } from '@tanstack/react-query'
import { getLevelsPlayers, getLevelsPlayer } from '@/services/reportService'

export function useLevelsPlayers({ page = 1, limit = 10, isActive, completedLevels } = {}) {
  return useQuery({
    queryKey: ['levelsPlayers', page, limit, isActive, completedLevels],
    queryFn: () => getLevelsPlayers({ page, limit, isActive, completedLevels }),
    placeholderData: (prev) => prev,
  })
}

export function useLevelsPlayer(id) {
  return useQuery({
    queryKey: ['levelsPlayer', id],
    queryFn: () => getLevelsPlayer(id),
    enabled: !!id,
  })
}
