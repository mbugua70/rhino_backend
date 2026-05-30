'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Pencil, Trash2, Package, Layers, RefreshCw } from 'lucide-react'
import { useToggleWinnable } from '@/hooks/useSegments'

function ColorDot({ color, label }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span
          className="inline-block w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0"
          style={{ background: color }}
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <p className="font-medium">{label}</p>
        <p className="text-slate-400 font-mono">{color}</p>
      </TooltipContent>
    </Tooltip>
  )
}

function SkeletonRows() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i} className="border-white/5 hover:bg-white/2">
          <TableCell><Skeleton className="h-4 w-28 bg-white/6" /></TableCell>
          <TableCell>
            <div className="flex gap-1.5">
              <Skeleton className="h-4 w-4 rounded-full bg-white/6" />
              <Skeleton className="h-4 w-4 rounded-full bg-white/6" />
              <Skeleton className="h-4 w-4 rounded-full bg-white/6" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full bg-white/6" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full bg-white/6" /></TableCell>
          <TableCell><Skeleton className="h-5 w-12 rounded-full bg-white/6" /></TableCell>
          <TableCell><Skeleton className="h-5 w-8 bg-white/6" /></TableCell>
          <TableCell><Skeleton className="h-5 w-8 bg-white/6" /></TableCell>
          <TableCell>
            <div className="flex gap-1.5">
              <Skeleton className="h-8 w-8 rounded-lg bg-white/6" />
              <Skeleton className="h-8 w-8 rounded-lg bg-white/6" />
              <Skeleton className="h-8 w-8 rounded-lg bg-white/6" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={8} className="h-60 text-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center">
            <Layers className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-sm font-medium text-slate-400">No segments found</p>
          <p className="text-xs">Add your first segment using the button above.</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function SegmentTable({
  segments,
  isLoading,
  onEdit,
  onDelete,
  onUpdateQty,
}) {
  const { mutate: toggleWinnable, isPending: toggling, variables: toggleId } = useToggleWinnable()

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/8 hover:bg-transparent bg-white/[0.02]">
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide w-44">
              Segment
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Colours
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Status
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Winnable
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Qty
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Gift #
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
              Order
            </TableHead>
            <TableHead className="text-slate-400 text-xs font-semibold uppercase tracking-wide text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <SkeletonRows />
          ) : !segments?.length ? (
            <EmptyState />
          ) : (
            <AnimatePresence initial={false}>
              {segments.map((seg, idx) => (
                <motion.tr
                  key={seg._id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                  className="border-white/5 hover:bg-white/[0.025] transition-colors group"
                >
                  {/* Segment name */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: seg.fillStyle }}
                      />
                      <span className="text-white text-sm font-medium truncate max-w-36">
                        {seg.text}
                      </span>
                    </div>
                  </TableCell>

                  {/* Colors */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <ColorDot color={seg.fillStyle} label="Fill" />
                      <ColorDot color={seg.strokeStyle} label="Stroke" />
                      <ColorDot color={seg.textFillStyle} label="Text" />
                    </div>
                  </TableCell>

                  {/* Active badge */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        seg.is_active
                          ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]'
                          : 'border-slate-600/40 text-slate-500 bg-slate-800/40 text-[10px]'
                      }
                    >
                      {seg.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  {/* Winnable toggle */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={seg.is_winnable}
                        disabled={toggling && toggleId === seg._id}
                        onCheckedChange={() => toggleWinnable(seg._id)}
                        className="data-[state=checked]:bg-emerald-500 scale-90"
                      />
                      <span className="text-xs text-slate-500">
                        {seg.is_winnable ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Quantity */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-cyan-500/25 text-cyan-300 bg-cyan-500/8 text-xs font-mono"
                    >
                      {seg.quantity}
                    </Badge>
                  </TableCell>

                  {/* Gift number */}
                  <TableCell>
                    <span className="text-slate-400 text-sm">{seg.gift_number}</span>
                  </TableCell>

                  {/* Sort order */}
                  <TableCell>
                    <span className="text-slate-500 text-sm">{seg.sort_order}</span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10"
                            onClick={() => onUpdateQty(seg)}
                          >
                            <Package className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">Update quantity</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                            onClick={() => onEdit(seg)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">Edit segment</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => onDelete(seg)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs">Delete segment</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
