
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkout } from '../services/orderService'
import type { Order } from '../services/orderService'
import { getAddresses } from '../services/addressService'
import type { Address } from '../services/addressService'
import '../App.css'

function Checkout() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingAddresses, setLoadingAddresses] = useState(true)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await getAddresses()
        setAddresses(data)

        const defaultAddress = data.find(
          (address) => address.defaultAddress
        )

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id)
        }
      } catch (err) {
        console.error('Address loading error:', err)
        setError('Unable to load saved addresses.')
      } finally {
        setLoadingAddresses(false)
      }
    }

    loadAddresses()
  }, [])

  const handleCheckout = async () => {
    if (selectedAddressId === null) {
      setError('Please select a delivery address.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await checkout(selectedAddressId)
      setOrder(response)
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Unable to place your order. Please check your cart and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (order) {
    return (
      <div className="checkout-page">
        <div className="checkout-success-card">
          <div className="checkout-success-icon">✓</div>

          <span className="checkout-eyebrow">SHOPSPHERE ORDER</span>
          <h1>Order Placed Successfully!</h1>
          <p>Your order has been created. Continue to payment to complete your purchase.</p>

          <div className="checkout-success-details">
            <div>
              <span>ORDER ID</span>
              <strong>#{order.orderId}</strong>
            </div>

            <div>
              <span>TOTAL AMOUNT</span>
              <strong>
                ₹{Number(order.totalAmount).toLocaleString('en-IN')}
              </strong>
            </div>

            <div>
              <span>ORDER STATUS</span>
              <strong>{order.status}</strong>
            </div>

            <div>
              <span>ORDER DATE</span>
              <strong>
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </strong>
            </div>
          </div>

          <button
            className="checkout-primary-button"
            onClick={() => navigate(`/payment/${order.orderId}`)}
          >
            Continue to Payment →
          </button>

          <button
            className="checkout-secondary-button"
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </button>

          <button
            className="checkout-text-button"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-heading">
        <div>
          <span className="checkout-eyebrow">SHOPSPHERE CHECKOUT</span>
          <h1>Complete Your Order</h1>
          <p>Choose your delivery address and place your order securely.</p>
        </div>

        <div className="checkout-step">
          <span>STEP 1 OF 2</span>
          <strong>Delivery Details</strong>
        </div>
      </div>

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      <div className="checkout-layout">
        <section className="checkout-main-card">
          <div className="checkout-section-title">
            <div className="checkout-section-icon">📍</div>
            <div>
              <h2>Delivery Address</h2>
              <p>Select where you want your order delivered.</p>
            </div>
          </div>

          {loadingAddresses ? (
            <p className="checkout-loading">Loading your saved addresses...</p>
          ) : addresses.length === 0 ? (
            <div className="checkout-no-address">
              <h3>No delivery address found</h3>
              <p>Please add an address before placing your order.</p>

              <button
                className="checkout-primary-button"
                onClick={() => navigate('/addresses')}
              >
                + Add Delivery Address
              </button>
            </div>
          ) : (
            <div className="checkout-address-list">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`checkout-address-card ${
                    selectedAddressId === address.id ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    value={address.id}
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                  />

                  <div className="checkout-address-content">
                    <div className="checkout-address-heading">
                      <strong>{address.fullName}</strong>

                      {address.defaultAddress && (
                        <span className="checkout-default-badge">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <p>{address.phoneNumber}</p>
                    <p>{address.addressLine}</p>

                    {address.landmark && <p>{address.landmark}</p>}

                    <p>
                      {address.city}, {address.state} - {address.postalCode}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {addresses.length > 0 && !loadingAddresses && (
            <button
              className="checkout-manage-button"
              onClick={() => navigate('/addresses')}
            >
              Manage Saved Addresses →
            </button>
          )}
        </section>

        <aside className="checkout-summary-card">
          <div className="checkout-section-title">
            <div className="checkout-section-icon">🛍️</div>
            <div>
              <h2>Order Summary</h2>
              <p>Review your order before proceeding.</p>
            </div>
          </div>

          <div className="checkout-summary-info">
            <div>
              <span>Delivery Address</span>
              <strong>
                {addresses.find((a) => a.id === selectedAddressId)?.city || 'Not selected'}
              </strong>
            </div>

            <div>
              <span>Delivery</span>
              <strong className="checkout-free">Free</strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>Choose on next step</strong>
            </div>
          </div>

          <div className="checkout-summary-note">
            Your final order amount will be calculated from the items in your cart.
          </div>

          <button
            type="button"
            className="checkout-primary-button checkout-place-button"
            onClick={handleCheckout}
            disabled={
              loading ||
              loadingAddresses ||
              addresses.length === 0 ||
              selectedAddressId === null
            }
          >
            {loading ? 'Placing Order...' : 'Place Order →'}
          </button>

          <button
            type="button"
            className="checkout-secondary-button"
            onClick={() => navigate('/cart')}
            disabled={loading}
          >
            ← Back to Cart
          </button>

          <p className="checkout-secure-note">
            🔒 Your delivery information is protected.
          </p>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
