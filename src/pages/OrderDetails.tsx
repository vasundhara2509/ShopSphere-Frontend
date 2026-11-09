
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrderDetails, cancelOrder } from '../services/orderService'
import '../App.css'

interface OrderItem {
  productId: number
  productName: string
  price: number
  quantity: number
  totalPrice: number
}

interface OrderDetails {
  orderId: number
  totalAmount: number
  status: string
  createdAt: string
  items: OrderItem[]
  fullName: string | null
  phoneNumber: string | null
  addressLine: string | null
  landmark: string | null
  city: string | null
  state: string | null
  postalCode: string | null
}

function OrderDetailsPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId || !Number.isFinite(Number(orderId))) {
          setError('Invalid order ID.')
          return
        }

        const data = await getOrderDetails(Number(orderId))
        setOrder(data)
      } catch (err) {
        console.error('Order details error:', err)
        setError('Unable to load order details.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleCancel = async () => {
    if (!order || cancelling) return

    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      setCancelling(true)
      await cancelOrder(order.orderId)
      setOrder({ ...order, status: 'CANCELLED' })
      alert('Order cancelled successfully!')
    } catch (err) {
      console.error('Cancel order error:', err)
      alert('Unable to cancel this order.')
    } finally {
      setCancelling(false)
    }
  }

  const formattedAmount = (value: number) =>
    Number(value).toLocaleString('en-IN')

  const statusClass = (status: string) =>
    status.toLowerCase().replaceAll('_', '-')

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-loading">
          <div className="payment-spinner"></div>
          <h2>Loading Order Details...</h2>
          <p>Please wait while we fetch your order.</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="order-details-page">
        <div className="order-details-error">
          <h2>Unable to Display Order</h2>
          <p>{error || 'Order not found.'}</p>
          <button
            className="order-details-secondary-button"
            onClick={() => navigate('/orders')}
          >
            ← Back to My Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="order-details-page order-details-redesign">

      <div className="order-details-heading">
        <div>
          <span className="payment-eyebrow">SHOPSPHERE ACCOUNT</span>
          <h1>Order Details</h1>
          <p>View your order information and delivery details.</p>
        </div>

        <button
          className="order-details-back-link"
          onClick={() => navigate('/orders')}
        >
          ← My Orders
        </button>
      </div>

      <div className="order-details-main-card">

        <div className="order-details-top">
          <div>
            <span className="order-details-label">ORDER NUMBER</span>
            <h2>Order #{order.orderId}</h2>
            <p>
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>

          <span className={`order-details-status ${statusClass(order.status)}`}>
            {order.status.replaceAll('_', ' ')}
          </span>
        </div>

        <div className="order-details-divider"></div>

        <div className="order-details-content">

          <section className="order-details-section">
            <div className="order-details-section-heading">
              <div className="order-details-icon">📍</div>
              <div>
                <h3>Delivery Address</h3>
                <p>Where your order will be delivered</p>
              </div>
            </div>

            <div className="order-details-address-box">
              {order.fullName ? (
                <>
                  <strong className="order-details-customer-name">
                    {order.fullName}
                  </strong>

                  {order.phoneNumber && (
                    <p>📞 {order.phoneNumber}</p>
                  )}

                  {order.addressLine && <p>{order.addressLine}</p>}

                  {order.landmark && (
                    <p>Landmark: {order.landmark}</p>
                  )}

                  <p>
                    {[order.city, order.state]
                      .filter(Boolean)
                      .join(', ')}
                    {order.postalCode ? ` - ${order.postalCode}` : ''}
                  </p>
                </>
              ) : (
                <p>No delivery address was saved for this order.</p>
              )}
            </div>
          </section>

          <section className="order-details-section">
            <div className="order-details-section-heading">
              <div className="order-details-icon">🛍️</div>
              <div>
                <h3>Ordered Products</h3>
                <p>
                  {order.items?.length || 0} product(s) in this order
                </p>
              </div>
            </div>

            <div className="order-details-products">
              {order.items?.length > 0 ? (
                order.items.map((item, index) => (
                  <div
                    className="order-details-product"
                    key={`${item.productId}-${index}`}
                  >
                    <div className="order-product-icon">📦</div>

                    <div className="order-product-info">
                      <h4>{item.productName}</h4>
                      <p>
                        ₹{formattedAmount(item.price)} × {item.quantity}
                      </p>
                    </div>

                    <strong className="order-product-total">
                      ₹{formattedAmount(item.totalPrice)}
                    </strong>
                  </div>
                ))
              ) : (
                <p>No product information is available.</p>
              )}
            </div>
          </section>

          <section className="order-details-total-section">
            <div className="order-details-total-row">
              <span>Subtotal</span>
              <strong>₹{formattedAmount(order.totalAmount)}</strong>
            </div>

            <div className="order-details-total-row">
              <span>Delivery</span>
              <strong className="order-free-delivery">Free</strong>
            </div>

            <div className="order-details-grand-total">
              <span>Total Amount</span>
              <strong>₹{formattedAmount(order.totalAmount)}</strong>
            </div>
          </section>

        </div>

        <div className="order-details-actions">
          {order.status === 'PENDING' && (
            <button
              className="order-details-cancel-button"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}

          <button
            className="order-details-secondary-button"
            onClick={() => navigate('/orders')}
          >
            ← Back to My Orders
          </button>

          <button
            className="order-details-primary-button"
            onClick={() => navigate('/')}
          >
            Continue Shopping →
          </button>
        </div>

      </div>

      <p className="order-details-footer">
        🔒 Your order and delivery information is protected.
      </p>

    </div>
  )
}

export default OrderDetailsPage
