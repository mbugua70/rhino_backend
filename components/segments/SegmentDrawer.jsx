'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import SegmentForm from './SegmentForm'
import { useCreateSegment, useUpdateSegment } from '@/hooks/useSegments'

export default function SegmentDrawer({ open, onClose, editData }) {
  const isEdit = !!editData

  const { mutate: create, isPending: creating } = useCreateSegment({ onSuccess: onClose })
  const { mutate: update, isPending: updating } = useUpdateSegment({ onSuccess: onClose })

  const handleSubmit = (values) => {
    if (isEdit) {
      update({ id: editData._id, payload: values })
    } else {
      create(values)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 border-white/8 bg-[#0b1628]"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/6">
          <SheetTitle className="text-white">
            {isEdit ? 'Edit Segment' : 'New Segment'}
          </SheetTitle>
          <SheetDescription className="text-slate-500 text-sm">
            {isEdit
              ? 'Update the segment details below.'
              : 'Fill in the details to add a new wheel segment.'}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="px-6 py-4">
            <SegmentForm
              defaultData={editData}
              onSubmit={handleSubmit}
              isSubmitting={creating || updating}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
