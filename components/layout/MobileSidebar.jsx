'use client'

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import AdminSidebar from './AdminSidebar'

export default function MobileSidebar({ open, onClose, admin }) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-64 p-0 border-white/8 bg-[#0b1628]"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <AdminSidebar admin={admin} onNavClick={onClose} />
      </SheetContent>
    </Sheet>
  )
}
