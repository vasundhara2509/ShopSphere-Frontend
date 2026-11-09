
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrderDetails } from '../services/orderService'
import {
  processPayment,
  type PaymentResponse
} from '../services/paymentService'
import '../App.css'

type PaymentMethod =
  | 'UPI'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NET_BANKING'
  | 'CASH_ON_DELIVERY'

function Payment() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [amount, setAmount] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('UPI')
  const [loading, setLoading] = useState(false)
  const [loadingOrder, setLoadingOrder] = useState(true)
  const [error, setError] = useState('')
  const [payment, setPayment] = useState<PaymentResponse | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!orderId || !Number.isFinite(Number(orderId))) {
          setError('Invalid order ID.')
          return
        }

        const order = await getOrderDetails(Number(orderId))
        setAmount(Number(order.totalAmount))
      } catch (err) {
        console.error('Order loading error:', err)
        setError('Unable to load order details.')
      } finally {
        setLoadingOrder(false)
      }
    }

    loadOrder()
  }, [orderId])

  const handlePayment = async () => {
    if (!orderId) {
      setError('Invalid order ID.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await processPayment({
        orderId: Number(orderId),
        paymentMethod
      })

      setPayment(response)
    } catch (err) {
      console.error('Payment error:', err)
      setError(
        'Payment could not be processed. Please check the order or try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const formattedAmount =
    amount !== null ? amount.toLocaleString('en-IN') : 'Unavailable'

  if (loadingOrder) {
    return (
      <div className="payment-page">
        <div className="payment-loading-card">
          <div className="payment-spinner"></div>
          <h2>Loading payment details...</h2>
          <p>Please wait while we fetch your order.</p>
        </div>
      </div>
    )
  }

  if (payment) {
    return (
      <div className="payment-page">
        <div className="payment-success payment-success-redesign">
          <div className="payment-success-icon">✓</div>

          <span className="payment-eyebrow">SHOPSPHERE ORDER</span>

          <h1>Payment Successful!</h1>
          <p className="payment-success-description">
            Your demo payment has been recorded successfully.
          </p>

          <div className="payment-success-amount">
            ₹{Number(payment.amount).toLocaleString('en-IN')}
          </div>

          <div className="payment-details-box">
            <div>
              <span>Order ID</span>
              <strong>#{payment.orderId}</strong>
            </div>
            <div>
              <span>Payment ID</span>
              <strong>#{payment.paymentId}</strong>
            </div>
            <div>
              <span>Payment Method</span>
              <strong>{payment.paymentMethod.replaceAll('_', ' ')}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong className="payment-status-success">
                {payment.status}
              </strong>
            </div>
            <div>
              <span>Transaction ID</span>
              <strong className="payment-transaction-id">
                {payment.transactionId}
              </strong>
            </div>
            <div>
              <span>Date</span>
              <strong>
                {new Date(payment.createdAt).toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          <div className="payment-success-actions">
            <button
              className="payment-primary-button"
              onClick={() => navigate('/orders')}
            >
              View My Orders →
            </button>

            <button
              className="payment-secondary-button"
              onClick={() => navigate('/payment-history')}
            >
              View Payment History
            </button>

            <button
              className="payment-text-button"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>

          <p className="payment-footer-note">
            🔒 This is a simulated payment confirmation. No real money was charged.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-page payment-page-redesign">
      <div className="payment-header">
        <div>
          <span className="payment-eyebrow">SHOPSPHERE SECURE CHECKOUT</span>
          <h1>Complete Your Payment</h1>
          <p>Choose your preferred payment method to continue.</p>
        </div>

        <div className="payment-step-card">
          <span>STEP 2 OF 2</span>
          <strong>Payment</strong>
        </div>
      </div>

      {error && (
        <div className="payment-error">
          ⚠️ {error}
        </div>
      )}

      <div className="payment-layout">
        <div className="payment-main-card">
          <div className="payment-section-heading">
            <div className="payment-heading-icon">💳</div>
            <div>
              <h2>Select Payment Method</h2>
              <p>Choose one of the available payment options.</p>
            </div>
          </div>

          <div className="payment-method-list">
            <label className={`payment-method-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={() => setPaymentMethod('UPI')}
              />
              <span className="payment-method-icon">📱</span>
              <span className="payment-method-info">
                <strong>UPI</strong>
                <small>Pay using UPI apps</small>
              </span>
              <span className="payment-radio-indicator"></span>
            </label>

            <label className={`payment-method-option ${paymentMethod === 'CREDIT_CARD' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="CREDIT_CARD"
                checked={paymentMethod === 'CREDIT_CARD'}
                onChange={() => setPaymentMethod('CREDIT_CARD')}
              />
              <span className="payment-method-icon">💳</span>
              <span className="payment-method-info">
                <strong>Credit Card</strong>
                <small>Pay using a credit card</small>
              </span>
              <span className="payment-radio-indicator"></span>
            </label>

            <label className={`payment-method-option ${paymentMethod === 'DEBIT_CARD' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="DEBIT_CARD"
                checked={paymentMethod === 'DEBIT_CARD'}
                onChange={() => setPaymentMethod('DEBIT_CARD')}
              />
              <span className="payment-method-icon">💳</span>
              <span className="payment-method-info">
                <strong>Debit Card</strong>
                <small>Pay using a debit card</small>
              </span>
              <span className="payment-radio-indicator"></span>
            </label>

            <label className={`payment-method-option ${paymentMethod === 'NET_BANKING' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="NET_BANKING"
                checked={paymentMethod === 'NET_BANKING'}
                onChange={() => setPaymentMethod('NET_BANKING')}
              />
              <span className="payment-method-icon">🏦</span>
              <span className="payment-method-info">
                <strong>Net Banking</strong>
                <small>Pay through your bank</small>
              </span>
              <span className="payment-radio-indicator"></span>
            </label>

            <label className={`payment-method-option ${paymentMethod === 'CASH_ON_DELIVERY' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="CASH_ON_DELIVERY"
                checked={paymentMethod === 'CASH_ON_DELIVERY'}
                onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
              />
              <span className="payment-method-icon">📦</span>
              <span className="payment-method-info">
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives</small>
              </span>
              <span className="payment-radio-indicator"></span>
            </label>
          </div>

          <div className="payment-demo-notice">
            <strong>⚠️ Demo Mode Only</strong>
            <p>
              This project simulates payment success. No real money is charged.
              Do not enter actual card or bank details. The current backend
              records every selected method as SUCCESS, including Cash on Delivery.
            </p>
          </div>
        </div>

        <div className="payment-summary-card">
          <div className="payment-section-heading">
            <div className="payment-heading-icon">🛍️</div>
            <div>
              <h2>Order Summary</h2>
              <p>Review your order before payment.</p>
            </div>
          </div>

          <div className="payment-summary-row">
            <span>Order ID</span>
            <strong>#{orderId}</strong>
          </div>

          <div className="payment-summary-row">
            <span>Payment Method</span>
            <strong>{paymentMethod.replaceAll('_', ' ')}</strong>
          </div>

          <div className="payment-total-row">
            <span>Total Amount</span>
            <strong>₹{formattedAmount}</strong>
          </div>

          <button
            className="payment-primary-button"
            onClick={handlePayment}
            disabled={loading || amount === null || amount <= 0}
          >
            {loading ? 'Processing Payment...' : 'Confirm Payment →'}
          </button>

          <button
            className="payment-secondary-button"
            onClick={() => navigate('/orders')}
            disabled={loading}
          >
            ← Back to Orders
          </button>

          <p className="payment-secure-note">
            🔒 Your order information is protected.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Payment
