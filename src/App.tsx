
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
} from 'react-router-dom'

import { getAllProducts, type Product } from './services/productService'
import { addToCart } from './services/cartService'
import { addToWishlist } from './services/wishlistService'

import ProtectedRoute from './components/ProtectedRoute'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetailsPage from './pages/OrderDetails'
import Addresses from './pages/Addresses'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import Reviews from './pages/Reviews'
import Payment from './pages/Payment'
import PaymentHistory from './pages/PaymentHistory'

import './App.css'

function HomePage() {
  const [cartCount, setCartCount] = useState(0)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  // Add product to cart
  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1)
      setCartCount((count) => count + 1)
      alert('Product added to cart successfully!')
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Please login to add products to your cart.')
    }
  }

  // Add product to wishlist
  const handleAddToWishlist = async (productId: number) => {
    try {
      await addToWishlist(productId)
      alert('Product added to wishlist successfully!')
    } catch (error) {
      console.error('Add to wishlist error:', error)
      alert('Unable to add product. Please login or check your wishlist.')
    }
  }

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts()
        setProducts(data)
      } catch (err) {
        setError('Unable to load products. Please try again.')
        console.error('Product loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Search products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <div className="top-bar">
        Free delivery on orders above ₹999
      </div>

      <header className="navbar">
        <a className="brand" href="#">
          Shop<span>Sphere</span>
        </a>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button">⌕</button>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#categories">Categories</a>
          <Link to="/wishlist">Wishlist ❤️</Link>
          <Link to="/addresses">My Addresses</Link>
          <Link to="/payment-history">Payment History</Link>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            aria-label="Wishlist"
            onClick={() => navigate('/wishlist')}
          >
            ♡
          </button>

          <button
            className="cart-icon"
            type="button"
            aria-label="Shopping cart"
            onClick={() => navigate('/cart')}
          >
            🛒 <span className="cart-count">{cartCount}</span>
          </button>

          {localStorage.getItem('token') ? (
            <button
              type="button"
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-content">
            <span className="hero-label">
              YOUR ONE-STOP SHOPPING DESTINATION
            </span>

            <h1>
              Discover Your
              <br />
              <span>Perfect Style.</span>
            </h1>

            <p>
              Explore amazing products, discover new trends and enjoy
              shopping with ShopSphere.
            </p>

            <a href="#products" className="shop-btn">
              Shop Now →
            </a>
          </div>

          <div className="hero-visual">
            <div className="hero-circle">
              <span>🛍️</span>
            </div>

            <div className="floating-card">
              <span>✨</span>
              <div>
                <strong>Best Deals</strong>
                <small>Just for you</small>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-label">EXPLORE</span>
              <h2>Shop by Category</h2>
            </div>
          </div>

          <div className="category-grid">
            <div className="category-card">
              <span>📱</span>
              <h3>Electronics</h3>
            </div>

            <div className="category-card">
              <span>👕</span>
              <h3>Fashion</h3>
            </div>

            <div className="category-card">
              <span>🏠</span>
              <h3>Home & Living</h3>
            </div>

            <div className="category-card">
              <span>🎒</span>
              <h3>Accessories</h3>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section" id="products">
          {loading && <p>Loading products...</p>}

          {error && <p className="empty-message">{error}</p>}

          <div className="section-heading">
            <div>
              <span className="section-label">HANDPICKED FOR YOU</span>
              <h2>Featured Products</h2>
            </div>

            <span className="product-count">
              {filteredProducts.length} products
            </span>
          </div>

          {!loading && !error && (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <span className="discount-badge">SALE</span>

                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-img"
                      />
                    ) : (
                      <span className="product-emoji">🛍️</span>
                    )}

                    {/* Add to Wishlist Button */}
                    <button
                      className="wishlist-btn"
                      type="button"
                      aria-label="Add to wishlist"
                      onClick={() => handleAddToWishlist(product.id)}
                    >
                      ♡
                    </button>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <div className="rating">
                      In stock: {product.quantity}
                    </div>

                    <div className="price-row">
                      <strong>
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <button
                      className="add-cart-btn"
                      type="button"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                    <button
  type="button"
  className="review-btn"
  onClick={() => navigate(`/products/${product.id}/reviews`)}
>
  ⭐ Write a Review
</button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <p className="empty-message">No products found.</p>
          )}
        </section>

        {/* Newsletter */}
        <section className="newsletter">
          <h2>Ready to discover something new?</h2>
          <p>
            Find your favorites and enjoy a better shopping experience.
          </p>

          <a href="#products" className="shop-btn">
            Explore Products →
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <a className="brand" href="#">
          Shop<span>Sphere</span>
        </a>

        <p>© 2026 ShopSphere. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Main Application
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/products/:productId/reviews" element={<Reviews />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/payment-history" element={<PaymentHistory />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile"
            element={<h1>Welcome to your Profile!</h1>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
