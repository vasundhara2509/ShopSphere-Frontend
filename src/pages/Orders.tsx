
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyOrders, type Order } from '../services/orderService'
import '../App.css'

function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders()
        setOrders(data)
      } catch (err) {
        console.error('Order loading error:', err)
        setError('Unable to load orders. Please login again.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'order-status-confirmed'
      case 'PROCESSING':
        return 'order-status-processing'
      case 'SHIPPED':
        return 'order-status-shipped'
      case 'DELIVERED':
        return 'order-status-delivered'
      case 'CANCELLED':
        return 'order-status-cancelled'
      default:
        return 'order-status-pending'
    }
  }

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )

  return (
    <div className="orders-page">

      <div className="orders-heading">
        <div>
          <span className="orders-eyebrow">YOUR SHOPSPHERE ACCOUNT</span>
          <h1>My Orders <span>📦</span></h1>
          <p>Track and manage all your purchases in one place.</p>
        </div>

        <div className="orders-count">
          <strong>{orders.length}</strong>
          <span>Total Orders</span>
        </div>
      </div>

      {loading && (
        <div className="orders-empty">
          <p>Loading your orders...</p>
        </div>
      )}

      {error && (
        <div className="orders-error">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="orders-empty">
          <div className="orders-empty-icon">🛍️</div>
          <h2>No orders yet!</h2>
          <p>Your purchases will appear here after you place an order.</p>
          <button
            type="button"
            className="orders-shop-button"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="orders-section-heading">
            <h2>Your Order History</h2>
            <span>{orders.length} orders</span>
          </div>

          <div className="orders-list">
            {sortedOrders.map((order) => (
              <article className="order-card" key={order.orderId}>

                <div className="order-card-top">
                  <div>
                    <span className="order-label">ORDER NUMBER</span>
                    <h2>#{order.orderId}</h2>
                  </div>

                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>

                <div className="order-card-info">
                  <div>
                    <span className="order-label">ORDER DATE</span>
                    <p>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="order-label">TOTAL AMOUNT</span>
                    <p className="order-total">
                      ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="order-card-footer">
                  <span>Thank you for shopping with ShopSphere!</span>

                  <button
                    type="button"
                    className="order-details-button"
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                  >
                    View Details →
                  </button>
                </div>

              </article>
            ))}
          </div>
        </>
      )}

      <div className="orders-bottom">
        <button
          type="button"
          onClick={() => navigate('/')}
        >
          ← Continue Shopping
        </button>
      </div>

    </div>
  )
}

export default Orders
