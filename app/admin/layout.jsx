'use client'

import { useState } from 'react'
import { useSession } from '@/hooks/useAuth'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopbar from '@/components/layout/AdminTopbar'
import MobileSidebar from '@/components/layout/MobileSidebar'
import { Skeleton } from '@/components/ui/skeleton'

function LoadingShell() {
  return (
    <div className="min-h-screen bg-[#050d1b]">
      <div className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-64 border-r border-white/6 bg-[#0b1628] p-4 gap-4">
        <Skeleton className="h-9 w-9 rounded-xl bg-white/5" />
        <div className="space-y-2 mt-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
      <div className="lg:pl-64 pt-14">
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-48 rounded-xl bg-white/3" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl bg-white/3" />
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
    <div className="min-h-screen bg-[#050d1b]">
      {/* Desktop sidebar — fixed */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-64 border-r border-white/6 bg-[#0b1628] z-20">
        <AdminSidebar admin={admin} />
      </aside>

      {/* Mobile sidebar (sheet) */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        admin={admin}
      />

      {/* Main area — offset for fixed sidebar and topbar */}
      <div className="lg:pl-64 pt-14">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} admin={admin} />
        <main>
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
