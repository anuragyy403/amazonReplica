import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../stripe';
import PaymentForm from '../components/PaymentForm';

function Checkout() {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const { fetchCart } = useCart();

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/orders', {
        shippingAddress: { address, city, postalCode, country },
      });
      setOrder(res.data);

      const paymentRes = await API.post('/payment/create-payment-intent', { orderId: res.data._id });
      setClientSecret(paymentRes.data.clientSecret);

      await fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    }
  };

  if (order && clientSecret) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>
        <p className="mb-4">Total: ₹{order.totalPrice}</p>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm orderId={order._id} />
        </Elements>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Shipping Address</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleCreateOrder} className="flex flex-col gap-3">
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-2" required />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="border p-2" required />
        <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="border p-2" required />
        <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="border p-2" required />
        <button type="submit" className="bg-gray-900 text-white p-2 rounded">Continue to Payment</button>
      </form>
    </div>
  );
}

export default Checkout;