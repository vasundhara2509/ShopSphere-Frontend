import axios from 'axios'

const API_URL = 'http://localhost:8080/api/cart'

export interface CartItem {
  cartItemId: number
  productId: number
  productName: string
  quantity: number
  price: number
  totalPrice: number
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')

  return {
    Authorization: `Bearer ${token}`
  }
}

export const addToCart = async (
  productId: number,
  quantity: number = 1
): Promise<CartItem> => {
  const response = await axios.post<CartItem>(
    `${API_URL}/add`,
    { productId, quantity },
    { headers: getAuthHeaders() }
  )

  return response.data
}

export const getCart = async (): Promise<CartItem[]> => {
  const response = await axios.get<CartItem[]>(
    API_URL,
    { headers: getAuthHeaders() }
  )

  return response.data
}

export const updateCartItem = async (
  itemId: number,
  quantity: number
): Promise<CartItem> => {
  const response = await axios.put<CartItem>(
    `${API_URL}/update/${itemId}`,
    { quantity },
    { headers: getAuthHeaders() }
  )

  return response.data
}

export const removeCartItem = async (
  itemId: number
): Promise<void> => {
  await axios.delete(
    `${API_URL}/remove/${itemId}`,
    { headers: getAuthHeaders() }
  )
}
