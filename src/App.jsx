import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Admin from './pages/Admin';
import About from './pages/About';

const Notification = () => {
  const { notification } = useCart();
  if (!notification) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 90,
      right: 20,
      background: '#0B0B0B',
      color: '#C9A96E',
      padding: '16px 24px',
      borderRadius: 4,
      fontSize: '0.85rem',
      fontWeight: 500,
      zIndex: 9999,
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      animation: 'slideIn 0.3s ease',
    }}>
      {notification}
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
      <Notification />
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </CartProvider>
  );
}

export default App;
