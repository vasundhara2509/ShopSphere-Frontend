
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getWishlist,
  removeFromWishlist,
  type WishlistItem,
} from '../services/wishlistService'
import { addToCart } from '../services/cartService'
import '../App.css'

function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyProduct, setBusyProduct] = useState<number | null>(null)

  const navigate = useNavigate()

  const fetchWishlist = async () => {
    try {
      setError('')
      const data = await getWishlist()
      setItems(data)
    } catch (err) {
      console.error('Wishlist error:', err)
      setError('Unable to load wishlist. Please login again if your session expired.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemove = async (productId: number) => {
    try {
      setBusyProduct(productId)
      await removeFromWishlist(productId)

      setItems((previous) =>
        previous.filter((item) => item.productId !== productId)
      )
    } catch (err) {
      console.error('Remove wishlist error:', err)
      setError('Unable to remove product from wishlist.')
    } finally {
      setBusyProduct(null)
    }
  }

  const handleAddToCart = async (productId: number) => {
    try {
      setBusyProduct(productId)
      await addToCart(productId, 1)
      alert('Product added to cart successfully!')
    } catch (err) {
      console.error('Add to cart error:', err)
      alert('Unable to add product to cart. Please login again.')
    } finally {
      setBusyProduct(null)
    }
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-heading">
          <h1>My Wishlist <span>♥</span></h1>
          <p>Your favourite products, all in one place.</p>
        </div>
        <div className="wishlist-empty">
          <p>Loading your saved products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-heading">
        <div>
          <span className="wishlist-eyebrow">YOUR COLLECTION</span>
          <h1>My Wishlist <span>♥</span></h1>
          <p>Keep track of the products you love.</p>
        </div>

        <div className="wishlist-count">
          <strong>{items.length}</strong>
          <span>{items.length === 1 ? 'Saved Item' : 'Saved Items'}</span>
        </div>
      </div>

      {error && (
        <div className="wishlist-error">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">♡</div>
          <h2>Your wishlist is waiting!</h2>
          <p>You haven't saved any favourite products yet.</p>
          <button
            type="button"
            className="wishlist-shop-button"
            onClick={() => navigate('/')}
          >
            Explore Products
          </button>
        </div>
      ) : (
        <>
          <div className="wishlist-section-heading">
            <h2>Your Saved Products</h2>
            <span>{items.length} products</span>
          </div>

          <div className="wishlist-grid">
            {items.map((item) => (
              <article className="wishlist-card" key={item.wishlistId}>
                <div className="wishlist-image-wrapper">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="wishlist-product-image"
                    />
                  ) : (
                    <div className="wishlist-no-image">
                      No Image Available
                    </div>
                  )}

                  <span className="wishlist-heart">♥</span>
                </div>

                <div className="wishlist-card-content">
                  <span className="wishlist-category">
                    {item.category}
                  </span>

                  <h3>{item.productName}</h3>

                  <p className="wishlist-description">
                    {item.description || 'A great product saved for later.'}
                  </p>

                  <div className="wishlist-price">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </div>

                  <div className="wishlist-actions">
                    <button
                      type="button"
                      className="wishlist-add-button"
                      disabled={busyProduct === item.productId}
                      onClick={() => handleAddToCart(item.productId)}
                    >
                      {busyProduct === item.productId
                        ? 'Please wait...'
                        : 'Add to Cart'}
                    </button>

                    <button
                      type="button"
                      className="wishlist-remove-button"
                      disabled={busyProduct === item.productId}
                      onClick={() => handleRemove(item.productId)}
                      aria-label={`Remove ${item.productName} from wishlist`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="wishlist-bottom">
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

export default Wishlist
