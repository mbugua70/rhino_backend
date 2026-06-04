'use client'

import { useState } from 'react'
import { Users, RefreshCw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSpinPlayers } from '@/hooks/useSpinReports'
import { useQueryClient } from '@tanstack/react-query'
import SpinPlayersTable from '@/components/reports/SpinPlayersTable'
import { getSpinPlayers } from '@/services/reportService'
import { downloadCSV } from '@/lib/utils'
import { format } from 'date-fns'

function formatDate(val) {
  if (!val) return ''
  try { return format(new Date(val), 'yyyy-MM-dd HH:mm') } catch { return '' }
}

export default function SpinPlayersPage() {
  const [page, setPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const limit = 10
  const qc = useQueryClient()

  const { data, isLoading, isRefetching } = useSpinPlayers({ page, limit })

  async function handleExport() {
    setIsExporting(true)
    try {
      const all = await getSpinPlayers({ page: 1, limit: 10000 })
      const rows = (all.players ?? []).map((p) => ({
        Player: p.player_name ?? '',
        Spun: p.has_spun ? 'Yes' : 'No',
        Prize: p.prize_name ?? '',
        'Spun At': formatDate(p.spun_at),
        Registered: formatDate(p.createdAt),
      }))
      downloadCSV(rows, `spin-players-${Date.now()}.csv`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Spin Players</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              All participants who have accessed the spin wheel.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {data?.total != null && (
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10 text-xs">
              {data.total} total
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-slate-400 hover:text-white hover:bg-white/8 gap-1.5"
            onClick={handleExport}
            disabled={isExporting || isLoading}
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            <span className="text-xs">{isExporting ? 'Exporting…' : 'Export'}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-slate-400 hover:text-white hover:bg-white/8"
            onClick={() => qc.invalidateQueries({ queryKey: ['spinPlayers'] })}
            disabled={isRefetching}
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <SpinPlayersTable
        data={data}
        isLoading={isLoading}
        page={page}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  )
}
