import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag, FiShield, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <motion.div
            className="empty-cart-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FiShoppingBag size={64} className="empty-icon" />
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any pieces to your collection yet.</p>
            <Link to="/shop">
              <motion.button
                className="btn-gold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Shopping <FiArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page">
      <div className="cart-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Shopping Cart</h1>
          <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </motion.div>
      </div>

      <div className="container">
        <div className="cart-layout">
          <div className="cart-items">
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div
                  key={item._id}
                  className="cart-item"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30, height: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  layout
                >
                  <Link to={`/product/${item.slug}`} className="cart-item-image">
                    <img src={item.images?.[0] || 'https://via.placeholder.com/120'} alt={item.name} />
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/product/${item.slug}`}>
                      <h3>{item.name}</h3>
                    </Link>
                    <p className="cart-item-meta">{item.material} • {item.gemstone}</p>
                    <div className="cart-item-price">${item.price.toLocaleString()}</div>
                  </div>
                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                      <FiMinus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                  <motion.button
                    className="cart-item-remove"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromCart(item._id)}
                  >
                    <FiTrash2 size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="cart-actions">
              <Link to="/shop" className="continue-shopping">
                <FiArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
                Continue Shopping
              </Link>
              <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>

          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toLocaleString()}</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>

            {shipping === 0 && (
              <div className="free-shipping-note">
                <FiTruck size={16} />
                You qualify for free shipping!
              </div>
            )}

            <Link to="/checkout">
              <motion.button
                className="checkout-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout
              </motion.button>
            </Link>

            <div className="summary-trust">
              <div className="trust-item">
                <FiShield size={16} />
                <span>Secure Checkout</span>
              </div>
              <div className="trust-item">
                <FiTruck size={16} />
                <span>Free Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
