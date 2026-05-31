'use client'

import { Layers, Users, Trophy, Gamepad2, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSession } from '@/hooks/useAuth'
import { useSegments } from '@/hooks/useSegments'
import { useSpinPlayers, useSpinResults } from '@/hooks/useSpinReports'
import { useLevelsPlayers } from '@/hooks/useLevelsReports'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

function StatCard({ label, value, icon: Icon, href, loading }) {
  return (
    <Link href={href} className="block">
      <div className="rounded-xl border border-white/8 bg-white/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <Icon className="w-4 h-4 text-slate-500" />
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
        </div>
        {loading ? (
          <Skeleton className="h-7 w-12 bg-white/8 mb-1" />
        ) : (
          <p className="text-2xl font-bold text-white mb-1">{value ?? '—'}</p>
        )}
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: segments, isLoading: loadingSegments } = useSegments()
  const { data: playersData, isLoading: loadingPlayers } = useSpinPlayers({ page: 1, limit: 1 })
  const { data: resultsData, isLoading: loadingResults } = useSpinResults({ page: 1, limit: 1 })
  const { data: levelsData, isLoading: loadingLevels } = useLevelsPlayers({ page: 1, limit: 1 })

  const adminName = session?.admin?.name || 'Admin'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const segmentCount = Array.isArray(segments) ? segments.length : '—'
  const playerCount = playersData?.total ?? '—'
  const resultCount = resultsData?.total ?? '—'
  const levelsPlayerCount = levelsData?.total ?? '—'

  const activeSegments = Array.isArray(segments)
    ? segments.filter((s) => s.is_active).length
    : null

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Greeting */}
      <div className="pt-1">
        <h1 className="text-xl font-bold text-white">
          {greeting}, <span className="text-emerald-400">{adminName}</span> 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Segments"
          value={segmentCount}
          icon={Layers}
          href="/admin/segments"
          loading={loadingSegments}
        />
        <StatCard
          label="Spin Players"
          value={playerCount}
          icon={Users}
          href="/admin/spin-players"
          loading={loadingPlayers}
        />
        <StatCard
          label="Spin Results"
          value={resultCount}
          icon={Trophy}
          href="/admin/spin-results"
          loading={loadingResults}
        />
        <StatCard
          label="Levels Players"
          value={levelsPlayerCount}
          icon={Gamepad2}
          href="/admin/levels-players"
          loading={loadingLevels}
        />
      </div>

      {/* Active segments callout */}
      {activeSegments !== null && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-emerald-400">{activeSegments}</span> of{' '}
            <span className="font-semibold text-white">{segmentCount}</span> segments are currently active.
          </p>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="ml-auto shrink-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs"
          >
            <Link href="/admin/segments">Manage</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
