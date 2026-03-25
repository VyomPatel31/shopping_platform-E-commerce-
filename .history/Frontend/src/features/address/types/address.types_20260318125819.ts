export interface Address {
  _id: string
  user: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
  isDefault: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateAddressPayload {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
  isDefault?: boolean
}

export interface UpdateAddressPayload extends Partial<CreateAddressPayload> {}

export interface AddressResponse {
  statusCode: number
  message: string
  data?: Address
}
