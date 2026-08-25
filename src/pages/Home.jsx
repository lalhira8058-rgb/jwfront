import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiGift, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const API_URL = 'http://localhost:5000/api';

const heroSlides = [
  {
    tag: 'The Art of Brilliance',
    title: 'Timeless Elegance',
    subtitle: 'Discover exquisite pieces crafted with precision and passion for life\'s most precious moments.',
    cta: 'Explore Collection',
    image: 'https://images.unsplash.com/photo-1515562141589-67f0d924e4d4?w=1400',
  },
  {
    tag: 'Handcrafted Perfection',
    title: 'Brilliant Diamonds',
    subtitle: 'Each diamond is hand-selected for its exceptional fire, brilliance, and scintillation.',
    cta: 'Shop Diamonds',
    image: 'https://images.unsplash.com/photo-1600721391776-b5cd0e0048f5?w=1400',
  },
  {
    tag: 'Forever Starts Here',
    title: 'Wedding Collection',
    subtitle: 'Begin your forever with a symbol of eternal love, designed to be treasured for generations.',
    cta: 'View Wedding',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1400',
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, best, newest] = await Promise.all([
          axios.get(`${API_URL}/products/featured`),
          axios.get(`${API_URL}/products/best-sellers`),
          axios.get(`${API_URL}/products/new-arrivals`),
        ]);
        setFeaturedProducts(featured.data);
        setBestSellers(best.data);
        setNewArrivals(newest.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <motion.div className="hero-bg" style={{ y: heroY }}>
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
          <div className="hero-overlay" />
        </motion.div>

        <motion.div className="hero-content container" style={{ opacity: heroOpacity }}>
          <div className="hero-text-area">
            <motion.span
              key={`tag-${currentSlide}`}
              className="hero-tag"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {heroSlides[currentSlide].tag}
            </motion.span>
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p
              key={`sub-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Link to="/shop">
                <button className="hero-cta">
                  {heroSlides[currentSlide].cta}
                  <FiArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          </div>
          <div className="hero-bottom">
            <div className="hero-dots">
              {heroSlides.map((_, i) => (
                <button key={i} className={`hero-dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
              ))}
            </div>
            <div className="hero-arrows">
              <button onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}>
                <FiChevronLeft size={18} />
              </button>
              <button onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}>
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="features-strip">
        <div className="container">
          <div className="features-row">
            {[
              { icon: FiTruck, text: 'Free Shipping Over $500' },
              { icon: FiShield, text: 'Lifetime Warranty' },
              { icon: FiGift, text: 'Luxury Gift Wrapping' },
              { icon: FiStar, text: 'Expert Styling Advice' },
            ].map((f, i) => (
              <motion.div
                key={f.text}
                className="feature-chip"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <f.icon size={16} />
                <span>{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="section featured-section">
          <div className="container">
            <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="section-eyebrow">Curated for You</span>
              <h2>Featured Collection</h2>
              <div className="section-line" />
            </motion.div>
            <div className="products-grid">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/shop">
                <motion.button className="btn-outline-dark" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  View All Collection <FiArrowRight size={15} />
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="parallax-banner">
        <div className="parallax-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600721391776-b5cd0e0048f5?w=1400)' }} />
        <div className="parallax-overlay" />
        <motion.div className="parallax-content container" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="section-eyebrow light">The Art of Jewelry</span>
          <h2>Crafted with Passion</h2>
          <p>Every piece is meticulously handcrafted by master artisans, using only the finest materials and ethically sourced gemstones.</p>
          <Link to="/about">
            <motion.button className="btn-gold" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Our Story <FiArrowRight size={15} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {bestSellers.length > 0 && (
        <section className="section">
          <div className="container">
            <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="section-eyebrow">Most Loved</span>
              <h2>Best Sellers</h2>
              <div className="section-line" />
            </motion.div>
            <div className="products-grid">
              {bestSellers.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="section new-arrivals-section">
          <div className="container">
            <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="section-eyebrow">Just Arrived</span>
              <h2>New Arrivals</h2>
              <div className="section-line" />
            </motion.div>
            <div className="products-grid">
              {newArrivals.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section categories-section">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2>Shop by Category</h2>
            <div className="section-line" />
          </motion.div>
          <div className="categories-grid">
            {[
              { name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500', path: '/shop?category=rings' },
              { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', path: '/shop?category=necklaces' },
              { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', path: '/shop?category=earrings' },
              { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', path: '/shop?category=bracelets' },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link to={cat.path} className="category-card">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="category-overlay">
                    <h3>{cat.name}</h3>
                    <span>Shop Now <FiArrowRight size={13} /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
