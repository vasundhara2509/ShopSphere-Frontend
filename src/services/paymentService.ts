
import axios from 'axios'

const API_URL = 'http://localhost:8080/api/payments'

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

export interface PaymentRequest {
  orderId: number
  paymentMethod:
    | 'UPI'
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'NET_BANKING'
    | 'CASH_ON_DELIVERY'
}

export interface PaymentResponse {
  paymentId: number
  orderId: number
  amount: number
  paymentMethod: string
  status: string
  transactionId: string
  createdAt: string
}

export const processPayment = async (
  request: PaymentRequest
): Promise<PaymentResponse> => {
  const response = await axios.post(
    `${API_URL}/process`,
    request,
    { headers: getAuthHeaders() }
  )

  return response.data
}

export const getPaymentHistory = async (): Promise<PaymentResponse[]> => {
  const response = await axios.get(
    API_URL,
    { headers: getAuthHeaders() }
  )

  return response.data
}

export const getPaymentByOrder = async (
  orderId: number
): Promise<PaymentResponse> => {
  const response = await axios.get(
    `${API_URL}/order/${orderId}`,
    { headers: getAuthHeaders() }
  )

  return response.data
}
