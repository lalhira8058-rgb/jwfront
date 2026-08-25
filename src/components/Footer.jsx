import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <motion.div
              className="newsletter-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3>Join the Inner Circle</h3>
              <p>Exclusive offers, new arrivals, and insider access to luxury.</p>
            </motion.div>
            <motion.div
              className="newsletter-form"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <motion.div
              className="footer-col brand-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="footer-logo">
                <svg viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#C9A96E'}}/>
                      <stop offset="50%" style={{stopColor:'#E8D5A3'}}/>
                      <stop offset="100%" style={{stopColor:'#C9A96E'}}/>
                    </linearGradient>
                  </defs>
                  <polygon points="12,2 18,10 12,18 6,10" fill="url(#footGold)" opacity="0.9"/>
                  <polygon points="12,2 18,10 12,9" fill="#E8D5A3" opacity="0.5"/>
                  <text x="24" y="14" fontFamily="Georgia, serif" fontSize="14" fontWeight="400" fill="url(#footGold)" letterSpacing="2">LUXE</text>
                  <text x="78" y="14" fontFamily="Georgia, serif" fontSize="14" fontWeight="300" fill="#fff" letterSpacing="2">GEM</text>
                  <text x="24" y="25" fontFamily="Arial, sans-serif" fontSize="5" fill="#666" letterSpacing="4">FINE JEWELRY</text>
                </svg>
              </Link>
              <p className="brand-desc">
                Crafting timeless pieces that celebrate life's most precious moments.
                Each piece is a testament to elegance, quality, and enduring beauty.
              </p>
              <div className="social-links">
                <a href="#"><FiInstagram size={16} /></a>
                <a href="#"><FiFacebook size={16} /></a>
                <a href="#"><FiTwitter size={16} /></a>
                <a href="#"><FiYoutube size={16} /></a>
              </div>
            </motion.div>

            <motion.div className="footer-col" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h4>Shop</h4>
              <Link to="/shop?category=rings">Rings</Link>
              <Link to="/shop?category=necklaces">Necklaces</Link>
              <Link to="/shop?category=earrings">Earrings</Link>
              <Link to="/shop?category=bracelets">Bracelets</Link>
              <Link to="/shop?category=wedding">Wedding</Link>
              <Link to="/shop?category=engagement">Engagement</Link>
            </motion.div>

            <motion.div className="footer-col" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h4>Help</h4>
              <a href="#">FAQs</a>
              <a href="#">Shipping & Returns</a>
              <a href="#">Ring Size Guide</a>
              <a href="#">Care Instructions</a>
              <a href="#">Contact Us</a>
            </motion.div>

            <motion.div className="footer-col" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
              <h4>Contact</h4>
              <div className="contact-item"><FiPhone size={14} /><span>1-800-LUXE-GEM</span></div>
              <div className="contact-item"><FiMail size={14} /><span>hello@luxegem.com</span></div>
              <div className="contact-item"><FiMapPin size={14} /><span>New York, NY 10001</span></div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2026 Luxe Gem. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
