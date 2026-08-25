import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { getCartCount, user, logout } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  const categories = [
    { name: 'Rings', path: '/shop?category=rings' },
    { name: 'Necklaces', path: '/shop?category=necklaces' },
    { name: 'Earrings', path: '/shop?category=earrings' },
    { name: 'Bracelets', path: '/shop?category=bracelets' },
    { name: 'Wedding', path: '/shop?category=wedding' },
    { name: 'Engagement', path: '/shop?category=engagement' },
  ];

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'scrolled' : ''} ${location.pathname === '/' ? 'is-home' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <svg className="logo-svg" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#C9A96E'}}/>
                  <stop offset="50%" style={{stopColor:'#E8D5A3'}}/>
                  <stop offset="100%" style={{stopColor:'#C9A96E'}}/>
                </linearGradient>
              </defs>
              <polygon points="14,4 20,12 14,20 8,12" fill="url(#navGold)" opacity="0.9"/>
              <polygon points="14,4 20,12 14,11" fill="#E8D5A3" opacity="0.5"/>
              <text x="26" y="17" fontFamily="Georgia, serif" fontSize="15" fontWeight="400" fill="url(#navGold)" letterSpacing="2.5">LUXE</text>
              <text x="88" y="17" fontFamily="Georgia, serif" fontSize="15" fontWeight="300" fill="#FFFFFF" letterSpacing="2.5">GEM</text>
              <text x="26" y="28" fontFamily="Arial, sans-serif" fontSize="5.5" fill="#888" letterSpacing="4.5">FINE JEWELRY</text>
            </svg>
          </Link>

          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <div
              className="nav-dropdown"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <span className="nav-link-flex">
                Shop <FiChevronDown size={12} />
              </span>
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    className="dropdown-menu"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {categories.map((cat) => (
                      <Link key={cat.name} to={cat.path} className="dropdown-item">{cat.name}</Link>
                    ))}
                    <Link to="/shop" className="dropdown-item all-link">View All</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Collections</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>Our Story</Link>
          </div>

          <div className="nav-actions">
            <motion.button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} whileTap={{ scale: 0.9 }}>
              <FiSearch size={19} />
            </motion.button>

            {user ? (
              <div className="nav-dropdown user-dropdown">
                <motion.button className="nav-icon-btn" whileTap={{ scale: 0.9 }}>
                  <FiUser size={19} />
                </motion.button>
                <div className="dropdown-menu user-menu">
                  <span className="user-greeting">Hi, {user.name}</span>
                  {user.role === 'admin' && <Link to="/admin" className="dropdown-item">Admin Panel</Link>}
                  <Link to="/orders" className="dropdown-item">My Orders</Link>
                  <button onClick={logout} className="dropdown-item logout-btn">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <motion.button className="nav-icon-btn" whileTap={{ scale: 0.9 }}>
                  <FiUser size={19} />
                </motion.button>
              </Link>
            )}

            <Link to="/cart">
              <motion.button className="nav-icon-btn cart-btn" whileTap={{ scale: 0.9 }}>
                <FiShoppingBag size={19} />
                {getCartCount() > 0 && (
                  <motion.span className="cart-count" initial={{ scale: 0 }} animate={{ scale: 1 }} key={getCartCount()}>
                    {getCartCount()}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div className="search-overlay" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div className="search-container">
                <FiSearch size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for rings, necklaces, earrings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) window.location.href = `/shop?search=${searchQuery}`; }}
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)} className="search-close"><FiX size={20} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="mobile-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.div className="mobile-menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              <div className="mobile-menu-header">
                <span className="mobile-logo-text">LUXE GEM</span>
                <button onClick={() => setMobileOpen(false)}><FiX size={22} /></button>
              </div>
              <div className="mobile-menu-links">
                <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                <Link to="/shop" onClick={() => setMobileOpen(false)}>Shop All</Link>
                {categories.map((cat) => (
                  <Link key={cat.name} to={cat.path} onClick={() => setMobileOpen(false)}>{cat.name}</Link>
                ))}
                <Link to="/about" onClick={() => setMobileOpen(false)}>Our Story</Link>
                {!user && <Link to="/login" onClick={() => setMobileOpen(false)} className="mobile-login-link">Sign In</Link>}
                {user && user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin Panel</Link>}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
