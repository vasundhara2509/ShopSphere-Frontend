
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getPaymentHistory,
  type PaymentResponse
} from '../services/paymentService'
import '../App.css'

function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await getPaymentHistory()

        const sortedPayments = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )

        setPayments(sortedPayments)
      } catch (err) {
        console.error('Payment history error:', err)
        setError('Unable to load payment history. Please log in again.')
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [])

  const formatMethod = (method: string) =>
    method.replaceAll('_', ' ')

  return (
    <div className="payment-history-page payment-history-redesign">

      <div className="payment-history-heading">
        <div>
          <span className="payment-eyebrow">
            SHOPSPHERE ACCOUNT
          </span>

          <h1>Payment History</h1>

          <p>
            View and manage all your ShopSphere payment transactions.
          </p>
        </div>

        {!loading && !error && payments.length > 0 && (
          <div className="payment-history-count">
            <span>Total Transactions</span>
            <strong>{payments.length}</strong>
          </div>
        )}
      </div>

      {loading && (
        <div className="payment-history-message">
          <div className="payment-spinner"></div>
          <h2>Loading Payment History...</h2>
          <p>Please wait while we fetch your transactions.</p>
        </div>
      )}

      {error && (
        <div className="payment-history-error">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && payments.length === 0 && (
        <div className="payment-history-empty">
          <div className="payment-history-empty-icon">💳</div>

          <h2>No Payments Yet</h2>

          <p>
            You haven't made any payments yet. Your payment transactions
            will appear here after completing an order.
          </p>

          <button
            className="payment-history-primary-button"
            onClick={() => navigate('/')}
          >
            Start Shopping →
          </button>
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <>
          <div className="payment-history-grid">
            {payments.map((payment) => (
              <div
                className="payment-history-modern-card"
                key={payment.paymentId}
              >
                <div className="payment-history-card-top">
                  <div className="payment-history-card-title">
                    <div className="payment-history-card-icon">
                      💳
                    </div>

                    <div>
                      <span>TRANSACTION</span>
                      <h2>Payment #{payment.paymentId}</h2>
                    </div>
                  </div>

                  <span
                    className={
                      payment.status === 'SUCCESS'
                        ? 'payment-history-status success'
                        : 'payment-history-status other'
                    }
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="payment-history-amount">
                  ₹{Number(payment.amount).toLocaleString('en-IN')}
                </div>

                <div className="payment-history-details">
                  <div>
                    <span>Order ID</span>
                    <strong>#{payment.orderId}</strong>
                  </div>

                  <div>
                    <span>Payment Method</span>
                    <strong>{formatMethod(payment.paymentMethod)}</strong>
                  </div>

                  <div>
                    <span>Transaction ID</span>
                    <strong className="payment-history-transaction">
                      {payment.transactionId}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Date</span>
                    <strong>
                      {new Date(payment.createdAt).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <button
                  className="payment-history-view-button"
                  onClick={() => navigate(`/orders/${payment.orderId}`)}
                >
                  View Order →
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        className="payment-history-continue-button"
        onClick={() => navigate('/')}
      >
        ← Continue Shopping
      </button>
    </div>
  )
}

export default PaymentHistory
