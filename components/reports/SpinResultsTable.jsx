'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { format } from 'date-fns'

function SkeletonRows() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <TableRow key={i} className="border-white/5">
          <TableCell><Skeleton className="h-4 w-32 bg-white/6" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24 bg-white/6" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28 bg-white/6" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20 rounded-full bg-white/6" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28 bg-white/6" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-56 text-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-sm font-medium text-slate-400">No results yet</p>
          <p className="text-xs">Spin results will appear here after players spin.</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-white/6">
      <p className="text-xs text-slate-500">
        Page <span className="text-white font-medium">{page}</span> of{' '}
        <span className="text-white font-medium">{totalPages || 1}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          disabled={page <= 1}
          onClick={onPrev}
          className="w-8 h-8 text-slate-400 hover:text-white hover:bg-white/8 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={page >= (totalPages || 1)}
          onClick={onNext}
          className="w-8 h-8 text-slate-400 hover:text-white hover:bg-white/8 disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function formatDate(val) {
  if (!val) return '—'
  try { return format(new Date(val), 'MMM d, yyyy · HH:mm') } catch { return '—' }
}

export default function SpinResultsTable({ data, isLoading, page, onPrev, onNext, onExport, isExporting }) {
  const results = data?.results ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      {/* Table toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 bg-white/[0.015]">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-slate-300">
            {data?.total ?? 0} total results
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white hover:bg-white/8 gap-2 text-xs h-8"
          onClick={onExport}
          disabled={isExporting || isLoading}
        >
          <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Exporting…' : 'Export CSV'}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-white/8 hover:bg-transparent bg-white/[0.02]">
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Player</TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Prize</TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Spun At</TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Snapshot</TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SkeletonRows />
          ) : !results.length ? (
            <EmptyState />
          ) : (
            <AnimatePresence initial={false}>
              {results.map((r, idx) => (
                <motion.tr
                  key={r._id ?? idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-white/5 hover:bg-white/[0.025] transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-400 shrink-0">
                        {(r.player_name ?? '?')[0].toUpperCase()}
                      </div>
                      <span className="text-white text-sm font-medium">{r.player_name ?? '—'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-amber-500/30 text-amber-300 bg-amber-500/10 text-xs"
                    >
                      🏆 {r.prize_name ?? '—'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-400 text-xs">{formatDate(r.spun_at)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-500 text-xs font-mono truncate max-w-24 block">
                      {r.prize_snapshot ? JSON.stringify(r.prize_snapshot).slice(0, 20) + '…' : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-400 text-xs">{formatDate(r.createdAt)}</span>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>

      {!isLoading && results.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPrev={onPrev} onNext={onNext} />
      )}
    </div>
  )
}
