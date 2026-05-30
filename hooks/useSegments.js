'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getSegments,
  createSegment,
  updateSegment,
  deleteSegment,
  toggleSegmentWinnable,
  updateSegmentQuantity,
} from '@/services/segmentService'

const QUERY_KEY = ['segments']

export function useSegments() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getSegments,
    select: (data) => data.segments ?? data ?? [],
  })
}

export function useCreateSegment(options = {}) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSegment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Segment created successfully')
      options.onSuccess?.()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create segment')
    },
  })
}

export function useUpdateSegment(options = {}) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateSegment(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Segment updated successfully')
      options.onSuccess?.()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update segment')
    },
  })
}

export function useDeleteSegment(options = {}) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteSegment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Segment deleted')
      options.onSuccess?.()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete segment')
    },
  })
}

export function useToggleWinnable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: toggleSegmentWinnable,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Winnable status toggled')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to toggle winnable')
    },
  })
}

export function useUpdateQuantity(options = {}) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }) => updateSegmentQuantity(id, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Quantity updated')
      options.onSuccess?.()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update quantity')
    },
  })
}
