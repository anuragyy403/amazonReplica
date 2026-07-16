import { useState, useEffect } from 'react';
import API from '../api/axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/myorders');
        setOrders(res.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded p-4 mb-4">
            <p className="font-semibold">Order #{order._id}</p>
            <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            <ul className="mt-2">
              {order.items.map((item) => (
                <li key={item.product}>{item.name} × {item.quantity} — ₹{item.price * item.quantity}</li>
              ))}
            </ul>
            <p className="font-bold mt-2">Total: ₹{order.totalPrice}</p>
            <p className="text-sm mt-1">Status: {order.isPaid ? 'Paid' : 'Pending Payment'}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;