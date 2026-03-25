import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { addressService } from '../services/address.service'
import { Address, CreateAddressPayload, UpdateAddressPayload } from '../types/address.types'

const ADDRESS_QUERY_KEYS = {
  all: ['addresses'] as const,
  list: () => [...ADDRESS_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...ADDRESS_QUERY_KEYS.all, 'detail', id] as const,
}

export function useGetAddresses(): UseQueryResult<Address[], Error> {
  return useQuery({
    queryKey: ADDRESS_QUERY_KEYS.list(),
    queryFn: () => addressService.getAddresses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useGetAddressById(id: string): UseQueryResult<Address, Error> {
  return useQuery({
    queryKey: ADDRESS_QUERY_KEYS.detail(id),
    queryFn: () => addressService.getAddressById(id),
    enabled: !!id,
  })
}

export function useCreateAddress(): UseMutationResult<Address, Error, CreateAddressPayload> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => addressService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.list() })
    },
  })
}

export function useUpdateAddress(): UseMutationResult<Address, Error, { id: string; payload: UpdateAddressPayload }> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }) => addressService.updateAddress(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.list() })
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.detail(data._id) })
    },
  })
}

export function useDeleteAddress(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.list() })
    },
  })
}

export function useSetDefaultAddress(): UseMutationResult<Address, Error, string> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => addressService.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.list() })
    },
  })
}
