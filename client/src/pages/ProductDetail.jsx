import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      setMessage('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product._id, 1);
      setMessage('Added to cart!');
    } catch (err) {
      setMessage('Failed to add to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await API.post(`/products/${id}/reviews`, { rating, comment });
      setComment('');
      fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-xl font-semibold mt-4">₹{product.price}</p>
      <p className="text-sm text-gray-500 mt-1">Brand: {product.brand} | Category: {product.category}</p>
      <p className="text-sm text-gray-500">In stock: {product.stock}</p>
      <p className="text-sm mt-1">⭐ {product.rating.toFixed(1)} ({product.numReviews} reviews)</p>

      <button onClick={handleAddToCart} className="bg-gray-900 text-white px-4 py-2 rounded mt-4">
        Add to Cart
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-2">Reviews</h2>
      {product.reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
      {product.reviews.map((review) => (
        <div key={review._id} className="border-b py-2">
          <p className="font-semibold">{review.name} — ⭐ {review.rating}</p>
          <p className="text-gray-600">{review.comment}</p>
        </div>
      ))}

      {user && (
        <form onSubmit={handleReviewSubmit} className="mt-4 flex flex-col gap-2">
          <h3 className="font-semibold">Write a Review</h3>
          {reviewError && <p className="text-red-600">{reviewError}</p>}
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="border p-2">
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border p-2"
            required
          />
          <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded">Submit Review</button>
        </form>
      )}
    </div>
  );
}

export default ProductDetail;