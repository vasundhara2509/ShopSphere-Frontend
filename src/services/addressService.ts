
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/addresses'

export interface Address {
  id: number
  fullName: string
  phoneNumber: string
  addressLine: string
  city: string
  state: string
  postalCode: string
  landmark?: string
  defaultAddress: boolean
  createdAt: string
}

export interface AddressRequest {
  fullName: string
  phoneNumber: string
  addressLine: string
  city: string
  state: string
  postalCode: string
  landmark?: string
  defaultAddress: boolean
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')

  return {
    Authorization: `Bearer ${token}`,
  }
}

// Get all addresses
export const getAddresses = async (): Promise<Address[]> => {
  const response = await axios.get<Address[]>(API_URL, {
    headers: getAuthHeaders(),
  })

  return response.data
}

// Add a new address
export const addAddress = async (
  data: AddressRequest
): Promise<Address> => {
  const response = await axios.post<Address>(API_URL, data, {
    headers: getAuthHeaders(),
  })

  return response.data
}

// Update an existing address
export const updateAddress = async (
  addressId: number,
  data: AddressRequest
): Promise<Address> => {
  const response = await axios.put<Address>(
    `${API_URL}/${addressId}`,
    data,
    { headers: getAuthHeaders() }
  )

  return response.data
}

// Delete an address
export const deleteAddress = async (
  addressId: number
): Promise<void> => {
  await axios.delete(`${API_URL}/${addressId}`, {
    headers: getAuthHeaders(),
  })
}
