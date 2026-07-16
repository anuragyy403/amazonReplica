import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="p-6">Loading products...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="border rounded p-4 hover:shadow-lg transition"
        >
          <h2 className="font-bold">{product.name}</h2>
          <p className="text-gray-600">{product.category}</p>
          <p className="font-semibold mt-2">₹{product.price}</p>
        </Link>
      ))}
    </div>
  );
}

export default Home;