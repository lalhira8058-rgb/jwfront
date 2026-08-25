import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiHeart, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-bg" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600721391776-b5cd0e0048f5?w=1200)'
        }} />
        <div className="about-hero-overlay" />
        <motion.div
          className="about-hero-content container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag light">Our Story</span>
          <h1>The Art of Fine Jewelry</h1>
          <p>Three decades of craftsmanship, passion, and timeless elegance</p>
        </motion.div>
      </section>

      <section className="about-story container">
        <div className="story-grid">
          <motion.div
            className="story-content"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-tag">Since 1996</span>
            <h2>A Legacy of Brilliance</h2>
            <p>
              Founded in the heart of New York City, Jellery began with a simple vision:
              to create jewelry that captures life's most precious moments. For over three decades,
              our master artisans have crafted pieces that transcend trends and become treasured heirlooms.
            </p>
            <p>
              Every diamond is hand-selected for its exceptional brilliance. Every setting is
              crafted with meticulous attention to detail. Every piece tells a story of love,
              celebration, and timeless beauty.
            </p>
          </motion.div>
          <motion.div
            className="story-image"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://images.unsplash.com/photo-1515562141589-67f0d924e4d4?w=600" alt="Our Craft" />
          </motion.div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Our Values</h2>
          </motion.div>
          <div className="values-grid">
            {[
              { icon: FiStar, title: 'Exceptional Quality', desc: 'Only the finest materials and gemstones make it into our collections.' },
              { icon: FiHeart, title: 'Ethical Sourcing', desc: 'We are committed to responsible and sustainable sourcing practices.' },
              { icon: FiAward, title: 'Master Craftsmanship', desc: 'Each piece is meticulously crafted by our team of expert artisans.' },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <value.icon size={32} />
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Begin Your Journey</h2>
            <p>Discover pieces that will be cherished for generations</p>
            <Link to="/shop">
              <motion.button
                className="btn-gold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now <FiArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
