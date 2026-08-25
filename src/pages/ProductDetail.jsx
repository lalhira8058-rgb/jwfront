import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiChevronRight, FiMinus, FiPlus, FiStar, FiTruck, FiShield, FiRotateCcw, FiShare2 } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

import API_URL from '../config';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/products/${slug}`);
        setProduct(res.data);
        setSelectedImage(0);

        const related = await axios.get(`${API_URL}/products?category=${res.data.category}`);
        setRelatedProducts(related.data.filter((p) => p._id !== res.data._id).slice(0, 4));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-shimmer" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found">
        <h2>Product Not Found</h2>
        <Link to="/shop">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/shop">Shop</Link>
          <FiChevronRight size={14} />
          <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
          <FiChevronRight size={14} />
          <span>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Images */}
          <motion.div
            className="product-images"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="main-image">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="detail-badge">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="thumbnail-strip">
                {product.images.map((img, i) => (
                  <motion.button
                    key={i}
                    className={`thumbnail ${i === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="product-info-detail"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-rating">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={16} className={i < Math.round(product.rating) ? 'star-filled' : ''} />
              ))}
              <span>{product.rating} / 5</span>
            </div>

            <div className="detail-price-block">
              <span className="detail-price">${product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="detail-original">${product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            {product.shortDescription && (
              <p className="detail-short-desc">{product.shortDescription}</p>
            )}

            <div className="detail-divider" />

            <div className="detail-options">
              {product.material && (
                <div className="detail-option">
                  <label>Material</label>
                  <span>{product.material}</span>
                </div>
              )}
              {product.gemstone && (
                <div className="detail-option">
                  <label>Gemstone</label>
                  <span>{product.gemstone}</span>
                </div>
              )}
              {product.weight && (
                <div className="detail-option">
                  <label>Weight</label>
                  <span>{product.weight}</span>
                </div>
              )}
              {product.sku && (
                <div className="detail-option">
                  <label>SKU</label>
                  <span>{product.sku}</span>
                </div>
              )}
            </div>

            <div className="detail-quantity">
              <label>Quantity</label>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <FiMinus size={16} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            <div className="detail-actions">
              <motion.button
                className="add-to-cart-main"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(product, quantity)}
              >
                <FiShoppingBag size={18} />
                Add to Cart — ${(product.price * quantity).toLocaleString()}
              </motion.button>
              <motion.button
                className="buy-now-main"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/checkout');
                }}
              >
                Buy Now — ${(product.price * quantity).toLocaleString()}
              </motion.button>
              <motion.button
                className="wishlist-main"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiHeart size={20} />
              </motion.button>
            </div>

            <div className="detail-guarantees">
              <div className="guarantee-item">
                <FiTruck size={18} />
                <span>Free shipping on orders over $500</span>
              </div>
              <div className="guarantee-item">
                <FiShield size={18} />
                <span>Lifetime warranty included</span>
              </div>
              <div className="guarantee-item">
                <FiRotateCcw size={18} />
                <span>30-day free returns</span>
              </div>
            </div>

            <button className="share-btn">
              <FiShare2 size={16} />
              Share this product
            </button>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          className="product-tabs"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="tab-nav">
            <button
              className={activeTab === 'details' ? 'active' : ''}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={activeTab === 'specs' ? 'active' : ''}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
            <button
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="tab-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'details' && (
                <div className="tab-details">
                  <p>{product.description}</p>
                  {product.tags && (
                    <div className="product-tags">
                      {product.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="tab-specs">
                  <table>
                    <tbody>
                      {product.material && <tr><td>Material</td><td>{product.material}</td></tr>}
                      {product.gemstone && <tr><td>Gemstone</td><td>{product.gemstone}</td></tr>}
                      {product.weight && <tr><td>Weight</td><td>{product.weight}</td></tr>}
                      {product.dimensions && <tr><td>Dimensions</td><td>{product.dimensions}</td></tr>}
                      {product.sku && <tr><td>SKU</td><td>{product.sku}</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="tab-reviews">
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((review, i) => (
                      <div key={i} className="review-card">
                        <div className="review-header">
                          <strong>{review.user}</strong>
                          <div className="review-stars">
                            {[...Array(5)].map((_, j) => (
                              <FiStar key={j} size={14} className={j < review.rating ? 'star-filled' : ''} />
                            ))}
                          </div>
                        </div>
                        <p>{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>You May Also Like</h2>
            <div className="products-grid">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
