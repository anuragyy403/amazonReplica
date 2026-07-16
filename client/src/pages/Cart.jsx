import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, fetchCart, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart) return <p className="p-6">Loading cart...</p>;

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty. <Link to="/" className="text-blue-600">Go shopping</Link></p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm text-gray-500">₹{item.product.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateCartItem(item.product._id, Number(e.target.value))}
                  className="border w-16 p-1"
                />
                <button onClick={() => removeFromCart(item.product._id)} className="text-red-600">Remove</button>
              </div>
            </div>
          ))}
          <p className="text-xl font-bold mt-4">Total: ₹{total}</p>
          <button onClick={() => navigate('/checkout')} className="bg-gray-900 text-white px-4 py-2 rounded mt-4">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;