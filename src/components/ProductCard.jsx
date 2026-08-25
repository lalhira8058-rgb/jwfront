import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/product/${product.slug}`} className="product-image-wrap">
        <div className="product-image">
          <img src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.name} />
          <img src={product.images?.[1] || product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.name} className="hover-image" />
        </div>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="product-badge">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </span>
        )}
        {product.newArrival && (
          <span className={`product-badge ${product.originalPrice && product.originalPrice > product.price ? 'badge-below' : ''} new-badge`}>NEW</span>
        )}
        <motion.button
          className="wishlist-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.preventDefault(); }}
        >
          <FiHeart size={16} />
        </motion.button>
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.slug}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        {product.shortDescription && (
          <p className="product-short-desc">{product.shortDescription}</p>
        )}
        <div className="product-bottom">
          <div className="product-pricing">
            <span className="product-price">${product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-original-price">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <motion.button
            className="add-to-cart-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            title="Add to cart"
          >
            <FiShoppingBag size={15} />
          </motion.button>
        </div>
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < Math.round(product.rating || 4.5) ? 'filled' : ''}`}>&#9733;</span>
          ))}
          <span className="rating-count">({(product.rating || 4.5).toFixed(1)})</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
