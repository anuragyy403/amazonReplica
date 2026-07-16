import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between bg-gray-900 text-white px-6 py-4">
      <Link to="/" className="text-xl font-bold">Amazon Clone</Link>
      <div className="flex gap-4 items-center">
        <Link to="/cart">Cart</Link>
        {user ? (
          <>
            <Link to="/orders">Orders</Link>
            <span>Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;