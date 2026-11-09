import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  addReview,
  getProductReviews,
  getMyReviews,
  deleteReview,
  type Review,
} from '../services/reviewService'
import '../App.css'

function Reviews() {
  const { productId } = useParams()
  const navigate = useNavigate()

  const [reviews, setReviews] = useState<Review[]>([])
  const [myReviews, setMyReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedProductId = Number(productId)

  const hasReviewed = myReviews.some(
    (review) => review.productId === selectedProductId
  )

  const fetchReviews = async () => {
    try {
      setError('')

      // Load public product reviews
      const data = await getProductReviews(selectedProductId)
      setReviews(data)
    } catch (err) {
      console.error('Fetch product reviews error:', err)
      setError('Unable to load product reviews.')
      return
    }

    // Load the logged-in user's reviews separately
    if (localStorage.getItem('token')) {
      try {
        const mine = await getMyReviews()

        setMyReviews(
          mine.filter(
            (review) => review.productId === selectedProductId
          )
        )
      } catch (err) {
        console.error('Fetch my reviews error:', err)
      }
    } else {
      setMyReviews([])
    }
  }

  useEffect(() => {
    const loadReviews = async () => {
      if (!Number.isInteger(selectedProductId) || selectedProductId <= 0) {
        setError('Invalid product ID.')
        setLoading(false)
        return
      }

      await fetchReviews()
      setLoading(false)
    }

    loadReviews()
  }, [selectedProductId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!localStorage.getItem('token')) {
      alert('Please login before submitting a review.')
      navigate('/login')
      return
    }

    if (hasReviewed) {
      alert('You have already reviewed this product.')
      return
    }

    if (!comment.trim()) {
      alert('Please enter your review comment.')
      return
    }

    try {
      setSubmitting(true)

      await addReview(selectedProductId, {
        rating,
        comment: comment.trim(),
      })

      alert('Review submitted successfully!')

      setRating(5)
      setComment('')

      await fetchReviews()
    } catch (err) {
      console.error('Add review error:', err)

      if (axios.isAxiosError(err)) {
        const status = err.response?.status

        if (status === 401 || status === 403) {
          await fetchReviews()

          if (myReviews.some(
            (review) => review.productId === selectedProductId
          )) {
            alert('You have already reviewed this product.')
          } else {
            alert('Your session may have expired. Please login again.')
          }
        } else {
          alert('Unable to submit your review. Please try again.')
        }
      } else {
        alert('Something went wrong while submitting your review.')
      }

      await fetchReviews()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      await deleteReview(reviewId)

      alert('Review deleted successfully!')

      await fetchReviews()
    } catch (err) {
      console.error('Delete review error:', err)
      alert('Unable to delete review. Please try again.')
    }
  }

  if (loading) {
    return <p>Loading reviews...</p>
  }

  return (
    <div className="reviews-page">
      <h1>Product Reviews & Ratings ⭐</h1>

      {error && <p className="error-message">{error}</p>}

      {localStorage.getItem('token') ? (
        hasReviewed ? (
          <div className="review-form">
            <h2>You have already reviewed this product!</h2>
            <p>You can delete your existing review below if you want to submit a new one.</p>
          </div>
        ) : (
          <form className="review-form" onSubmit={handleSubmit}>
            <h2>Write a Review</h2>

            <label htmlFor="rating">Your Rating</label>

            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
              <option value={4}>⭐⭐⭐⭐ - Very Good</option>
              <option value={3}>⭐⭐⭐ - Good</option>
              <option value={2}>⭐⭐ - Fair</option>
              <option value={1}>⭐ - Poor</option>
            </select>

            <label htmlFor="comment">Your Comment</label>

            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )
      ) : (
        <div className="review-form">
          <h2>Login to Write a Review</h2>
          <button type="button" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      )}

      <section className="review-list">
        <h2>Customer Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => {
            const isMyReview = myReviews.some(
              (mine) => mine.reviewId === review.reviewId
            )

            return (
              <div className="review-card" key={review.reviewId}>
                <h3>{review.userName}</h3>

                <p className="review-stars">
                  {'⭐'.repeat(review.rating)}
                </p>

                <p>{review.comment}</p>

                <small>
                  {new Date(review.createdAt).toLocaleString('en-IN')}
                </small>

                {isMyReview && (
                  <button
                    type="button"
                    onClick={() => handleDelete(review.reviewId)}
                  >
                    Delete Review
                  </button>
                )}
              </div>
            )
          })
        )}
      </section>

      <button type="button" onClick={() => navigate('/')}>
        Back to Shopping
      </button>
    </div>
  )
}

export default Reviews