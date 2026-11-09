
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/wishlist'

export interface WishlistItem {
  wishlistId: number
  productId: number
  productName: string
  description: string
  price: number
  category: string
  imageUrl?: string
  addedAt: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')

  return {
    Authorization: `Bearer ${token}`,
  }
}

// Get all wishlist products
export const getWishlist = async (): Promise<WishlistItem[]> => {
  const response = await axios.get<WishlistItem[]>(API_URL, {
    headers: getAuthHeaders(),
  })

  return response.data
}

// Add product to wishlist
export const addToWishlist = async (
  productId: number
): Promise<WishlistItem> => {
  const response = await axios.post<WishlistItem>(
    `${API_URL}/${productId}`,
    {},
    { headers: getAuthHeaders() }
  )

  return response.data
}

// Remove product from wishlist
export const removeFromWishlist = async (
  productId: number
): Promise<void> => {
  await axios.delete(`${API_URL}/${productId}`, {
    headers: getAuthHeaders(),
  })
}
