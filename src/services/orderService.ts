
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/orders'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')

  return {
    Authorization: `Bearer ${token}`
  }
}

export interface Order {
  orderId: number
  totalAmount: number
  status: string
  createdAt: string
}

export const checkout = async (addressId: number) => {
  const response = await axios.post(
    `${API_URL}/checkout?addressId=${addressId}`,
    {},
    { headers: getAuthHeaders() }
  )
  return response.data
}

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await axios.get<Order[]>(
    API_URL,
    { headers: getAuthHeaders() }
  )

  return response.data
}

export const getOrderDetails = async (orderId: number) => {
  const response = await axios.get(
    `${API_URL}/${orderId}`,
    { headers: getAuthHeaders() }
  )

  return response.data
}

export const cancelOrder = async (orderId: number) => {
  const response = await axios.put(
    `${API_URL}/${orderId}/cancel`,
    {},
    { headers: getAuthHeaders() }
  )

  return response.data
}
