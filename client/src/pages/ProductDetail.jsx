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
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-xl font-semibold mt-4">₹{product.price}</p>
      <p className="text-sm text-gray-500 mt-1">Brand: {product.brand} | Category: {product.category}</p>
      <p className="text-sm text-gray-500">In stock: {product.stock}</p>
      <button onClick={handleAddToCart} className="bg-gray-900 text-white px-4 py-2 rounded mt-4">
        Add to Cart
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}

export default ProductDetail;