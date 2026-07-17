import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <p className="p-6 text-red-600">Admin access only.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let imageUrl = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await API.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      await API.post('/products', {
        name,
        description,
        price: Number(price),
        category,
        brand,
        stock: Number(stock),
        image: imageUrl,
      });

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2" required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2" required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2" required />
        <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="border p-2" />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="border p-2" required />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="border p-2" />
        <button type="submit" disabled={uploading} className="bg-gray-900 text-white p-2 rounded disabled:opacity-50">
          {uploading ? 'Uploading...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;