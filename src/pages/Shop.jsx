import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Shop.css';

import API_URL from '../config';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'rings', label: 'Rings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'pendants', label: 'Pendants' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'engagement', label: 'Engagement' },
  ];

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/products?`;
        if (selectedCategory) url += `category=${selectedCategory}&`;
        if (searchParams.get('search')) url += `search=${searchParams.get('search')}&`;
        if (sortBy) url += `sort=${sortBy}&`;
        if (priceRange[0] > 0) url += `minPrice=${priceRange[0]}&`;
        if (priceRange[1] < 10000) url += `maxPrice=${priceRange[1]}&`;

        const res = await axios.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, sortBy, priceRange, searchParams]);

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-tag">Our Collection</span>
          <h1>Shop Fine Jewelry</h1>
          <p>Discover exquisite pieces crafted for life's most precious moments</p>
        </motion.div>
      </div>

      <div className="container">
        <div className="shop-toolbar">
          <div className="shop-toolbar-left">
            <button
              className="filter-toggle"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FiFilter size={18} />
              Filters
            </button>
            <span className="results-count">{products.length} products</span>
          </div>
          <div className="shop-toolbar-right">
            <div className="sort-select">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            <div className="view-toggles">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid size={18} />
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="shop-content">
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                className="shop-sidebar"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="sidebar-header">
                  <h3>Filters</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <FiX size={20} />
                  </button>
                </div>

                <div className="filter-group">
                  <h4>Category</h4>
                  {categories.map((cat) => (
                    <label key={cat.value} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={selectedCategory === cat.value}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          if (e.target.value) {
                            setSearchParams({ category: e.target.value });
                          } else {
                            setSearchParams({});
                          }
                        }}
                      />
                      <span className="radio-custom" />
                      {cat.label}
                    </label>
                  ))}
                </div>

                <div className="filter-group">
                  <h4>Price Range</h4>
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0] || ''}
                      onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                    />
                    <span>—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1] === 10000 ? '' : priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                    />
                  </div>
                </div>

                <button
                  className="clear-filters"
                  onClick={() => {
                    setSelectedCategory('');
                    setPriceRange([0, 10000]);
                    setSearchParams({});
                  }}
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`products-container ${viewMode}`}>
            {loading ? (
              <div className="loading-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-image" />
                    <div className="skeleton-text" />
                    <div className="skeleton-text short" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
