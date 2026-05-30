'use client'

import { useState } from 'react'
import { useSession } from '@/hooks/useAuth'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopbar from '@/components/layout/AdminTopbar'
import MobileSidebar from '@/components/layout/MobileSidebar'
import { Skeleton } from '@/components/ui/skeleton'

function LoadingShell() {
  return (
    <div className="flex h-screen bg-[#050d1b]">
      <div className="hidden lg:flex w-64 flex-col border-r border-white/6 bg-[#0b1628] p-4 gap-4">
        <Skeleton className="h-9 w-9 rounded-xl bg-white/5" />
        <div className="space-y-2 mt-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <Skeleton className="h-14 w-full bg-white/3" />
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl bg-white/3" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl bg-white/3" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session, isLoading } = useSession()

  if (isLoading) return <LoadingShell />

  const admin = session?.admin

  return (
    <div className="flex h-screen overflow-hidden bg-[#050d1b]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/6 bg-[#0b1628]">
        <AdminSidebar admin={admin} />
      </aside>

      {/* Mobile sidebar (sheet) */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        admin={admin}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} admin={admin} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 min-h-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
