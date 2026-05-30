'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLevelsPlayers } from '@/hooks/useLevelsReports'
import { useQueryClient } from '@tanstack/react-query'
import LevelsPlayersTable from '@/components/reports/LevelsPlayersTable'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

const STATUS_FILTERS = [
  { label: 'All', value: undefined },
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
]

export default function LevelsPlayersPage() {
  const [page, setPage] = useState(1)
  const [isActive, setIsActive] = useState(undefined)
  const limit = 10
  const qc = useQueryClient()

  const { data, isLoading, isRefetching } = useLevelsPlayers({ page, limit, isActive })

  function handleFilterChange(value) {
    setIsActive(value)
    setPage(1)
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Levels Players</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              All players participating in the levels game.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {data?.total != null && (
            <Badge
              variant="outline"
              className="border-violet-500/30 text-violet-400 bg-violet-500/10 text-xs"
            >
              {data.total} total
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-slate-400 hover:text-white hover:bg-white/8"
            onClick={() => qc.invalidateQueries({ queryKey: ['levelsPlayers'] })}
            disabled={isRefetching}
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Status:</span>
        <div className="flex items-center gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={String(f.value)}
              onClick={() => handleFilterChange(f.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive === f.value
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={item}>
        <LevelsPlayersTable
          data={data}
          isLoading={isLoading}
          page={page}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      </motion.div>
    </motion.div>
  )
}
