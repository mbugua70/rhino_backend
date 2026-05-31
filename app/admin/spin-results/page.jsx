'use client'

import { useState } from 'react'
import { Trophy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSpinResults } from '@/hooks/useSpinReports'
import { useQueryClient } from '@tanstack/react-query'
import SpinResultsTable from '@/components/reports/SpinResultsTable'

export default function SpinResultsPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const qc = useQueryClient()

  const { data, isLoading, isRefetching } = useSpinResults({ page, limit })

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Spin Results</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              All prizes awarded from the spin wheel.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {data?.total != null && (
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-xs">
              {data.total} total
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-slate-400 hover:text-white hover:bg-white/8"
            onClick={() => qc.invalidateQueries({ queryKey: ['spinResults'] })}
            disabled={isRefetching}
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <SpinResultsTable
        data={data}
        isLoading={isLoading}
        page={page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  )
}
