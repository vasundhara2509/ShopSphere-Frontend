
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  id: number
  fullName: string
  email: string
  token: string
}

export const registerUser = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/register`,
    data
  )
  return response.data
}

export const loginUser = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/login`,
    data
  )
  return response.data
}
