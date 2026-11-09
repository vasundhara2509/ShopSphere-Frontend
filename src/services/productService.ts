import axios from 'axios'

const API_URL = 'http://localhost:8080/api/products'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  category: string
  imageUrl?: string
}

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(API_URL)
  return response.data
}