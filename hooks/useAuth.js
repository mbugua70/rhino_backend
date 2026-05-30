'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { getSession, loginAdmin, logoutAdmin } from '@/services/authService'
import { toast } from 'sonner'

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 min
  })
}

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      queryClient.setQueryData(['session'], { isLoggedIn: true, admin: data.admin })
      toast.success('Welcome back!')
      router.push('/admin')
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.clear()
      router.push('/login')
    },
    onError: () => {
      queryClient.clear()
      router.push('/login')
    },
  })
}
