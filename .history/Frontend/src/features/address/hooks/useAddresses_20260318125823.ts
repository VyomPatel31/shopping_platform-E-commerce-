import { useCallback } from 'react'
import { 
  useGetAddresses, 
  useGetAddressById, 
  useCreateAddress, 
  useUpdateAddress, 
  useDeleteAddress, 
  useSetDefaultAddress 
} from '../quaries/address.query'
import { CreateAddressPayload, UpdateAddressPayload } from '../types/address.types'
import toast from 'react-hot-toast'

export interface UseAddressReturn {
  addresses: any[]
  isLoading: boolean
  isError: boolean
  error: Error | null

  createAddress: (payload: CreateAddressPayload) => Promise<void>
  updateAddress: (id: string, payload: UpdateAddressPayload) => Promise<void>
  deleteAddress: (id: string) => Promise<void>
  setDefault: (id: string) => Promise<void>

  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  isSetting: boolean
}

export function useAddresses(): UseAddressReturn {
  const { data: addresses = [], isLoading, isError, error } = useGetAddresses()

  const { mutateAsync: createAddressMutation, isPending: isCreating } = useCreateAddress()
  const { mutateAsync: updateAddressMutation, isPending: isUpdating } = useUpdateAddress()
  const { mutateAsync: deleteAddressMutation, isPending: isDeleting } = useDeleteAddress()
  const { mutateAsync: setDefaultMutation, isPending: isSetting } = useSetDefaultAddress()

  const createAddress = useCallback(async (payload: CreateAddressPayload) => {
    try {
      await createAddressMutation(payload)
      toast.success('Address added successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add address')
    }
  }, [createAddressMutation])

  const updateAddress = useCallback(async (id: string, payload: UpdateAddressPayload) => {
    try {
      await updateAddressMutation({ id, payload })
      toast.success('Address updated successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update address')
    }
  }, [updateAddressMutation])

  const deleteAddress = useCallback(async (id: string) => {
    try {
      await deleteAddressMutation(id)
      toast.success('Address deleted successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete address')
    }
  }, [deleteAddressMutation])

  const setDefault = useCallback(async (id: string) => {
    try {
      await setDefaultMutation(id)
      toast.success('Default address updated')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to set default address')
    }
  }, [setDefaultMutation])

  return {
    addresses,
    isLoading,
    isError,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefault,
    isCreating,
    isUpdating,
    isDeleting,
    isSetting,
  }
}

export function useAddressById(id: string) {
  const { data: address, isLoading, isError, error } = useGetAddressById(id)

  return {
    address,
    isLoading,
    isError,
    error,
  }
}
