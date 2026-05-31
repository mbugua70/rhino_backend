'use client'

import { useState, useMemo } from 'react'
import { Plus, RefreshCw, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useSegments } from '@/hooks/useSegments'
import { useQueryClient } from '@tanstack/react-query'
import SegmentTable from '@/components/segments/SegmentTable'
import SegmentDrawer from '@/components/segments/SegmentDrawer'
import DeleteSegmentDialog from '@/components/segments/DeleteSegmentDialog'
import QuantityUpdateDialog from '@/components/segments/QuantityUpdateDialog'

export default function SegmentsPage() {
  const qc = useQueryClient()
  const { data: rawSegments, isLoading, error, isRefetching } = useSegments()

  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [qtyTarget, setQtyTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState('all')
  const [filterWinnable, setFilterWinnable] = useState('all')

  // Derived: filter + sort
  const segments = useMemo(() => {
    let list = Array.isArray(rawSegments) ? rawSegments : []

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((s) => s.text?.toLowerCase().includes(q))
    }
    if (filterActive !== 'all') {
      list = list.filter((s) =>
        filterActive === 'active' ? s.is_active : !s.is_active
      )
    }
    if (filterWinnable !== 'all') {
      list = list.filter((s) =>
        filterWinnable === 'winnable' ? s.is_winnable : !s.is_winnable
      )
    }

    return [...list].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  }, [rawSegments, search, filterActive, filterWinnable])

  const openCreate = () => {
    setEditData(null)
    setDrawerOpen(true)
  }
  const openEdit = (seg) => {
    setEditData(seg)
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditData(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Segments</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage the wheel segments, prizes, and quantities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-slate-400 hover:text-white hover:bg-white/8"
            onClick={() => qc.invalidateQueries({ queryKey: ['segments'] })}
            disabled={isRefetching}
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={openCreate}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 h-9"
          >
            <Plus className="w-4 h-4" />
            Add Segment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div>
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-white/8 bg-white/2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search segments…"
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9 text-sm"
            />
          </div>

          {/* Active filter */}
          <Select value={filterActive} onValueChange={setFilterActive}>
            <SelectTrigger className="w-36 bg-white/5 border-white/10 text-slate-300 h-9 text-sm">
              <Filter className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0e1a2e] border-white/10 text-white">
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active only</SelectItem>
              <SelectItem value="inactive">Inactive only</SelectItem>
            </SelectContent>
          </Select>

          {/* Winnable filter */}
          <Select value={filterWinnable} onValueChange={setFilterWinnable}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-slate-300 h-9 text-sm">
              <Filter className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <SelectValue placeholder="Winnable" />
            </SelectTrigger>
            <SelectContent className="bg-[#0e1a2e] border-white/10 text-white">
              <SelectItem value="all">All winnables</SelectItem>
              <SelectItem value="winnable">Winnable only</SelectItem>
              <SelectItem value="not-winnable">Not winnable</SelectItem>
            </SelectContent>
          </Select>

          {/* Count badge */}
          {!isLoading && (
            <Badge
              variant="outline"
              className="self-center border-white/10 text-slate-400 bg-white/4 whitespace-nowrap text-xs"
            >
              {segments.length} result{segments.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && !isLoading && (
        <div>
          <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/8 text-red-400 text-sm">
            Failed to load segments.{' '}
            <button
              className="underline hover:no-underline"
              onClick={() => qc.invalidateQueries({ queryKey: ['segments'] })}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div>
        <SegmentTable
          segments={segments}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onUpdateQty={setQtyTarget}
        />
      </div>

      {/* Modals */}
      <SegmentDrawer open={drawerOpen} onClose={closeDrawer} editData={editData} />
      <DeleteSegmentDialog segment={deleteTarget} onClose={() => setDeleteTarget(null)} />
      <QuantityUpdateDialog segment={qtyTarget} onClose={() => setQtyTarget(null)} />
    </div>
  )
}
