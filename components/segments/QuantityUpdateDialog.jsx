'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Package } from 'lucide-react'
import { useUpdateQuantity } from '@/hooks/useSegments'

export default function QuantityUpdateDialog({ segment, onClose }) {
  const [qty, setQty] = useState('')
  const { mutate: updateQty, isPending } = useUpdateQuantity({ onSuccess: onClose })

  useEffect(() => {
    if (segment) setQty(String(segment.quantity ?? 0))
  }, [segment])

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = parseInt(qty, 10)
    if (isNaN(value) || value < 0) return
    updateQty({ id: segment._id, quantity: value })
  }

  return (
    <Dialog open={!!segment} onOpenChange={onClose}>
      <DialogContent className="bg-[#0e1a2e] border-white/10 text-white sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <DialogTitle className="text-white">Update Quantity</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs mt-0.5">
                {segment?.text}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qty" className="text-slate-300 text-xs">
              New quantity
            </Label>
            <Input
              id="qty"
              type="number"
              min={0}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="bg-white/5 border-white/10 text-white h-10"
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
              className="text-slate-400 hover:text-white hover:bg-white/8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving…
                </>
              ) : (
                'Update'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
