'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Layers,
  Users,
  Trophy,
  Gamepad2,
  Zap,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLogout } from '@/hooks/useAuth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Segments', href: '/admin/segments', icon: Layers },
  { label: 'Spin Players', href: '/admin/spin-players', icon: Users },
  { label: 'Spin Results', href: '/admin/spin-results', icon: Trophy },
  { label: 'Levels Players', href: '/admin/levels-players', icon: Gamepad2 },
]

function NavItem({ item, onClick }) {
  const pathname = usePathname()
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
  const Icon = item.icon

  return (
    <Link href={item.href} onClick={onClick} className="block">
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 group relative',
          isActive
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        )}
      >
        {isActive && (
          <div className="absolute inset-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20" />
        )}
        <Icon
          className={cn(
            'w-4.5 h-4.5 shrink-0 relative z-10',
            isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
          )}
          size={18}
        />
        <span className="relative z-10">{item.label}</span>
        {isActive && (
          <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-500/60 relative z-10" />
        )}
      </div>
    </Link>
  )
}

export default function AdminSidebar({ admin, onNavClick }) {
  const { mutate: logout, isPending } = useLogout()

  const initials = admin?.name
    ? admin.name.slice(0, 2).toUpperCase()
    : 'AD'

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight leading-none">
              Spin Admin
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Safaricom QR Game</p>
          </div>
        </div>
      </div>

      <Separator className="bg-white/6 mx-4" />

      {/* Nav label */}
      <p className="px-4 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
        Navigation
      </p>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} onClick={onNavClick} />
        ))}
      </nav>

      <Separator className="bg-white/6 mx-4 mb-3" />

      {/* Admin profile + logout */}
      <div className="px-3 pb-4 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/4 border border-white/6">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{admin?.name || 'Admin'}</p>
            <p className="text-[10px] text-slate-500 truncate">{admin?.email || ''}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => logout()}
          className="w-full justify-start gap-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 text-sm"
        >
          <LogOut className="w-4 h-4" />
          {isPending ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>
    </div>
  )
}
