
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/reviews'

export interface Review {
  reviewId: number
  productId: number
  productName: string
  userId: number
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface ReviewRequest {
  rating: number
  comment: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')

  return {
    Authorization: `Bearer ${token}`,
  }
}

// Add a product review
export const addReview = async (
  productId: number,
  data: ReviewRequest
): Promise<Review> => {
  const response = await axios.post<Review>(
    `${API_URL}/${productId}`,
    data,
    { headers: getAuthHeaders() }
  )

  return response.data
}

// Get all reviews for a product
export const getProductReviews = async (
  productId: number
): Promise<Review[]> => {
  const response = await axios.get<Review[]>(
    `${API_URL}/product/${productId}`
  )

  return response.data
}

// Get my reviews
export const getMyReviews = async (): Promise<Review[]> => {
  const response = await axios.get<Review[]>(
    `${API_URL}/my`,
    { headers: getAuthHeaders() }
  )

  return response.data
}

// Delete my review
export const deleteReview = async (
  reviewId: number
): Promise<void> => {
  await axios.delete(`${API_URL}/${reviewId}`, {
    headers: getAuthHeaders(),
  })
}
