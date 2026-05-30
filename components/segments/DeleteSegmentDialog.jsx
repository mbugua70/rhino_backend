'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, AlertTriangle } from 'lucide-react'
import { useDeleteSegment } from '@/hooks/useSegments'

export default function DeleteSegmentDialog({ segment, onClose }) {
  const { mutate: deleteSegment, isPending } = useDeleteSegment({ onSuccess: onClose })

  return (
    <Dialog open={!!segment} onOpenChange={onClose}>
      <DialogContent className="bg-[#0e1a2e] border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <DialogTitle className="text-white">Delete Segment</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400 text-sm leading-relaxed pl-13">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-white">"{segment?.text}"</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-white hover:bg-white/8"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={() => deleteSegment(segment._id)}
            className="bg-red-600 hover:bg-red-500 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
