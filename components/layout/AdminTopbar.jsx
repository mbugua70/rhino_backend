'use client'

import { Menu, Bell, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const routeLabels = {
  '/admin': 'Dashboard',
  '/admin/segments': 'Segments',
  '/admin/spin-players': 'Spin Players',
  '/admin/spin-results': 'Spin Results',
  '/admin/levels-players': 'Levels Players',
}

function Breadcrumb() {
  const pathname = usePathname()
  const label = routeLabels[pathname] || 'Admin'

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="text-slate-500">Admin</span>
      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
      <span className="text-white font-medium">{label}</span>
    </div>
  )
}

export default function AdminTopbar({ onMenuClick, admin }) {
  const initials = admin?.name ? admin.name.slice(0, 2).toUpperCase() : 'AD'

  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-6 border-b border-[#141b2b] bg-[#080f1e]">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-slate-400 hover:text-white w-8 h-8"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <Breadcrumb />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell (decorative) */}
        <Button
          variant="ghost"
          size="icon"
          className="relative w-8 h-8 text-slate-400 hover:text-white"
        >
          <Bell className="w-4.5 h-4.5" size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </Button>

        {/* Role badge */}
        <Badge
          variant="outline"
          className="hidden sm:flex border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] font-semibold uppercase tracking-wide"
        >
          {admin?.role || 'Admin'}
        </Badge>

        {/* Avatar */}
        <Avatar className="w-7 h-7">
          <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
