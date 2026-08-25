import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Auth.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-bg" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1515562141589-67f0d924e4d4?w=800)'
        }} />
        <div className="auth-bg-overlay" />
        <div className="auth-left-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Welcome to Luxe Gem</h2>
            <p>Discover timeless pieces crafted with precision and passion.</p>
          </motion.div>
        </div>
      </div>

      <div className="auth-right">
        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/" className="auth-logo">
            <svg viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: 32}}>
              <defs>
                <linearGradient id="authGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#C9A96E'}}/>
                  <stop offset="50%" style={{stopColor:'#E8D5A3'}}/>
                  <stop offset="100%" style={{stopColor:'#C9A96E'}}/>
                </linearGradient>
              </defs>
              <polygon points="12,2 18,10 12,18 6,10" fill="url(#authGold)" opacity="0.9"/>
              <polygon points="12,2 18,10 12,9" fill="#E8D5A3" opacity="0.5"/>
              <text x="24" y="14" fontFamily="Georgia, serif" fontSize="14" fontWeight="400" fill="url(#authGold)" letterSpacing="2">LUXE</text>
              <text x="78" y="14" fontFamily="Georgia, serif" fontSize="14" fontWeight="300" fill="currentColor" letterSpacing="2">GEM</text>
              <text x="24" y="25" fontFamily="Arial, sans-serif" fontSize="5" fill="#888" letterSpacing="4">FINE JEWELRY</text>
            </svg>
          </Link>

          <h1>{isLogin ? 'Sign In' : 'Create Account'}</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Sign in to access your account' : 'Join us to start shopping'}
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <FiUser size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="input-group">
              <FiMail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <FiLock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            )}

            <motion.button
              type="submit"
              className="auth-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
