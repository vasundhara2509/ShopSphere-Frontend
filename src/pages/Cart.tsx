
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCart,
  updateCartItem,
  removeCartItem,
  type CartItem
} from '../services/cartService'
import '../App.css'

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<number | null>(null)

  const navigate = useNavigate()

  const fetchCart = async () => {
    try {
      const items = await getCart()
      setCartItems(items)
      setError('')
    } catch (err) {
      console.error('Cart loading error:', err)
      setError('Unable to load your cart. Please login again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleQuantityChange = async (
    itemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return

    try {
      setUpdating(itemId)

      const updatedItem = await updateCartItem(itemId, newQuantity)

      setCartItems(items =>
        items.map(item =>
          item.cartItemId === itemId ? updatedItem : item
        )
      )
    } catch (err) {
      console.error('Quantity update error:', err)
      alert('Unable to update quantity. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  const handleRemove = async (itemId: number) => {
    try {
      setUpdating(itemId)

      await removeCartItem(itemId)

      setCartItems(items =>
        items.filter(item => item.cartItemId !== itemId)
      )
    } catch (err) {
      console.error('Remove cart item error:', err)
      alert('Unable to remove product. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  if (loading) {
    return (
      <div className="cart-page">
        <p className="cart-loading">Loading your cart...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="cart-page">
        <p className="cart-error">{error}</p>
        <button className="cart-continue-btn" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <span className="section-label">YOUR SHOPPING BAG</span>
        <h1>Shopping Cart</h1>
        <p>Review your items before placing your order.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your cart is empty!</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button
            className="cart-primary-btn"
            onClick={() => navigate('/')}
          >
            Start Shopping →
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-products">
            {cartItems.map(item => (
              <div className="cart-item" key={item.cartItemId}>
                <div className="cart-product-icon">🛍️</div>

                <div className="cart-product-details">
                  <h3>{item.productName}</h3>

                  <p className="cart-unit-price">
                    ₹{Number(item.price).toLocaleString('en-IN')} each
                  </p>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      disabled={item.quantity <= 1 || updating === item.cartItemId}
                      onClick={() =>
                        handleQuantityChange(
                          item.cartItemId,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      disabled={updating === item.cartItemId}
                      onClick={() =>
                        handleQuantityChange(
                          item.cartItemId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-right">
                  <strong>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </strong>

                  <button
                    className="cart-remove-btn"
                    type="button"
                    disabled={updating === item.cartItemId}
                    onClick={() => handleRemove(item.cartItemId)}
                  >
                    {updating === item.cartItemId ? 'Please wait...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total Items</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <div className="summary-total">
              <span>Total Amount</span>
              <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
            </div>

            <button
              className="cart-primary-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <button
              className="cart-continue-btn"
              onClick={() => navigate('/')}
            >
              ← Continue Shopping
            </button>

            <p className="cart-delivery-note">
              🚚 Free delivery on orders above ₹999
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
