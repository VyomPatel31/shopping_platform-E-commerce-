import axiosInstance from '../../../api/axiosInstance'
import { Address, CreateAddressPayload, UpdateAddressPayload } from '../types/address.types'

const ADDRESS_API = '/api/addresses'

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await axiosInstance.get(`${ADDRESS_API}`)
    return response.data.data
  },

  getAddressById: async (id: string): Promise<Address> => {
    const response = await axiosInstance.get(`${ADDRESS_API}/${id}`)
    return response.data.data
  },

  createAddress: async (payload: CreateAddressPayload): Promise<Address> => {
    const response = await axiosInstance.post(`${ADDRESS_API}`, payload)
    return response.data.data
  },

  updateAddress: async (id: string, payload: UpdateAddressPayload): Promise<Address> => {
    const response = await axiosInstance.put(`${ADDRESS_API}/${id}`, payload)
    return response.data.data
  },

  deleteAddress: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${ADDRESS_API}/${id}`)
  },

  setDefaultAddress: async (id: string): Promise<Address> => {
    const response = await axiosInstance.post(`${ADDRESS_API}/${id}/default`)
    return response.data.data
  },
}
