'use client'

import { Layers, Users, Trophy, TrendingUp, ArrowRight, Gamepad2 } from 'lucide-react'
import Link from 'next/link'
import { useSession } from '@/hooks/useAuth'
import { useSegments } from '@/hooks/useSegments'
import { useSpinPlayers, useSpinResults } from '@/hooks/useSpinReports'
import { useLevelsPlayers } from '@/hooks/useLevelsReports'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

// accentClass must already include alpha, e.g. "bg-emerald-500/10"
// — never use CSS opacity property here; alpha in the color = zero GPU tile cost
function StatCard({ label, value, icon: Icon, accentClass, href, loading }) {
  return (
    <Link href={href} className="block group">
      <div className="relative rounded-2xl border border-white/8 bg-white/5 p-5 hover:bg-white/[0.07] transition-colors duration-200">
        <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-3xl ${accentClass}`} />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
              {label}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-16 bg-white/8" />
            ) : (
              <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
            )}
          </div>
          {/* No transition-opacity — opacity animation pre-allocates a GPU tile */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/8">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-1 mt-4 text-xs text-slate-600 group-hover:text-slate-400 transition-colors duration-200">
          <span>View all</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  )
}

function QuickActionCard({ label, description, href, icon: Icon }) {
  return (
    <Link href={href} className="block group">
      <div className="rounded-2xl border border-white/8 bg-white/5 p-5 hover:bg-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/8">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-300" />
        </div>
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
  const today = format(new Date(), 'EEEE, MMMM d, yyyy')

  const segmentCount = Array.isArray(segments) ? segments.length : '—'
  const playerCount = playersData?.total ?? '—'
  const resultCount = resultsData?.total ?? '—'
  const levelsPlayerCount = levelsData?.total ?? '—'

  const activeSegments = Array.isArray(segments)
    ? segments.filter((s) => s.is_active).length
    : null

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome banner — no overflow-hidden, no opacity property, no absolute children with opacity */}
      <div className="relative rounded-2xl border border-white/8 bg-[#0a1f18] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold uppercase tracking-wider">
            Live
          </Badge>
          <span className="text-xs text-slate-500">{today}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
          {greeting},{' '}
          <span className="gradient-text">{adminName}</span> 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1.5">
          Here&apos;s what&apos;s happening with your Spin The Wheel game today.
        </p>
      </div>

      {/* Stats */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-3">
          Overview
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Segments"
            value={segmentCount}
            icon={Layers}
            accentClass="bg-emerald-500/10"
            href="/admin/segments"
            loading={loadingSegments}
          />
          <StatCard
            label="Total Players"
            value={playerCount}
            icon={Users}
            accentClass="bg-cyan-500/10"
            href="/admin/spin-players"
            loading={loadingPlayers}
          />
          <StatCard
            label="Total Results"
            value={resultCount}
            icon={Trophy}
            accentClass="bg-amber-500/10"
            href="/admin/spin-results"
            loading={loadingResults}
          />
          <StatCard
            label="Levels Players"
            value={levelsPlayerCount}
            icon={Gamepad2}
            accentClass="bg-violet-500/10"
            href="/admin/levels-players"
            loading={loadingLevels}
          />
        </div>
      </div>

      {/* Active segments callout */}
      {activeSegments !== null && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-emerald-400">{activeSegments}</span> of{' '}
            <span className="font-semibold text-white">{segmentCount}</span> segments are currently active on the wheel.
          </p>
          <Button asChild size="sm" variant="ghost" className="ml-auto shrink-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs">
            <Link href="/admin/segments">Manage</Link>
          </Button>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickActionCard
            label="Manage Segments"
            description="Add, edit or delete wheel segments"
            href="/admin/segments"
            icon={Layers}
          />
          <QuickActionCard
            label="View Players"
            description="Browse all spin participants"
            href="/admin/spin-players"
            icon={Users}
          />
          <QuickActionCard
            label="Spin Results"
            description="See all prizes awarded"
            href="/admin/spin-results"
            icon={Trophy}
          />
          <QuickActionCard
            label="Levels Players"
            description="Browse all levels game participants"
            href="/admin/levels-players"
            icon={Gamepad2}
          />
        </div>
      </div>
    </div>
  )
}
