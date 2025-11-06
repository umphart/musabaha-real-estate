import React, { useState, useEffect } from 'react'; 
import { 
  FiUser, FiX, FiUserPlus, FiPhone, FiMapPin, FiCalendar, 
  FiDatabase, FiDollarSign, FiPieChart, FiCheckCircle, FiCircle,
  FiEdit, FiMail, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { getAuthToken, showAlert, formatCurrency, calculateTotalPrice } from './adminUtils';

const UserModal = ({ type, user, plots, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    plot_taken: '',
    date_taken: '',
    initial_deposit: '',
    price_per_plot: '',
    payment_schedule: 'Monthly',
    total_balance: '',
    number_of_plots: 1,
    location: '',     
    plot_size: ''    
  });

  const [selectedPlots, setSelectedPlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllPlots, setShowAllPlots] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://musabaha-homes.onrender.com/api';

  useEffect(() => {
    if (type === 'edit' && user) {
      setFormData({
        name: user.name || '',
        email: user.email || user.login_email || '',
        contact: user.contact || '',
        plot_taken: user.plot_taken || '',
        date_taken: user.date_taken || '',
        initial_deposit: user.initial_deposit || '',
        price_per_plot: user.price_per_plot || '',
        payment_schedule: user.payment_schedule || 'Monthly',
        total_balance: user.total_balance || '',
        number_of_plots: user.number_of_plots || 1
      });
    }
  }, [type, user]);

  const handlePlotSelection = (plot) => {
    setSelectedPlots(prevSelected => {
      const isAlreadySelected = prevSelected.some(p => p.id === plot.id);
      
      const newSelection = isAlreadySelected
        ? prevSelected.filter(p => p.id !== plot.id)
        : [...prevSelected, plot];

      //("✅ Plot Clicked:", plot);
      //("✅ Updated Selected Plots:", newSelection);

      return newSelection;
    });
  };

  const toggleShowAllPlots = () => {
    setShowAllPlots(prev => !prev);
  };

  const displayedPlots = showAllPlots ? plots : plots.slice(0, 6);

  useEffect(() => {
    if (selectedPlots.length > 0 && type === 'create') {
      const plotNumbers = selectedPlots.map(p => p.number).join(', ');
      const plotPrices = selectedPlots.map(p => p.price).join(', ');
      const totalPrice = selectedPlots.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);

      setFormData(prev => ({
        ...prev,
        plot_taken: plotNumbers,
        price_per_plot: plotPrices,
        total_balance: (totalPrice - parseFloat(prev.initial_deposit || 0)).toString(),
        number_of_plots: selectedPlots.length,
        location: selectedPlots[0].location || "",
        plot_size: selectedPlots[0].dimension || ""
      }));
    }
  }, [selectedPlots, type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.contact || (type === 'create' && selectedPlots.length === 0)) {
      showAlert('error', 'Please fill in all required fields and select at least one plot.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('error', 'Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      let response;

      if (type === 'create') {
        const totalPlotPrice = calculateTotalPrice(formData.price_per_plot);
        const totalBalance = totalPlotPrice - parseFloat(formData.initial_deposit || 0);

        const priceList = selectedPlots.map(plot => plot.price).join(', ');
        
        const requestBody = {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          plot_taken: formData.plot_taken,
          date_taken: formData.date_taken,
          initial_deposit: formData.initial_deposit,
          price_per_plot: priceList,
          payment_schedule: formData.payment_schedule,
          total_balance: totalBalance.toString(),
          number_of_plots: selectedPlots.length,
          total_money_to_pay: totalPlotPrice.toString(),
          location: formData.location,
          plot_size: formData.plot_size
        };

        //('Sending request with email:', formData.email);

        response = await fetch(`${API_BASE_URL}/admin/users`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/admin/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();
      
      if (data.success) {
        showAlert("success", `User ${type === 'create' ? 'created' : 'updated'} successfully.`);
        onSuccess();
      } else {
        showAlert("error", data.message || `Failed to ${type} user.`);
      }
    } catch (error) {
      console.error(`Error ${type}ing user:`, error);
      showAlert("error", `Failed to ${type} user. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content compact-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', width: '95vw' }}>
        <div className="modal-header">
          <h3>
            {type === 'create' ? <><FiUserPlus className="icon" /> Register New Customer</> : <><FiEdit className="icon" /> Edit User</>}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="user-creation-form compact-form">
            <div className="form-section compact-section">
              <h4><FiUser className="icon" /> Customer Information</h4>
              <div className="form-row compact-row">
                <div className="form-group compact-group">
                  <label><FiUser className="icon" /> Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group compact-group">
                  <label><FiMail className="icon" /> Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              <div className="form-row compact-row">
                <div className="form-group compact-group">
                  <label><FiPhone className="icon" /> Contact Number *</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="form-group compact-group">
                  <label className="password-info">
                    <FiUser className="icon" /> Login Information
                  </label>
                  <div className="info-box">
                    <small>
                      <strong>Username:</strong> Email address<br />
                      <strong>Password:</strong> Contact number
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {type === 'create' && (
              <div className="form-section compact-section">
                <h4>
                  <FiMapPin className="icon" /> 
                  Plot Selection 
                  <span className="plots-count">({selectedPlots.length} selected)</span>
                </h4>
                
                <div className="compact-plots-container">
                  <div className="plots-mini-grid">
                    {displayedPlots.map(plot => (
                      <div 
                        key={plot.id}
                        className={`plot-mini-card ${selectedPlots.some(p => p.id === plot.id) ? 'selected' : ''}`}
                        onClick={() => handlePlotSelection(plot)}
                        title={`Plot ${plot.number} - ${plot.location} - ${formatCurrency(plot.price)}`}
                      >
                        <span className="plot-mini-number">#{plot.number}</span>
                        <span className="plot-mini-price">{formatCurrency(plot.price)}</span>
                        {selectedPlots.some(p => p.id === plot.id) ? (
                          <FiCheckCircle className="selected-icon" />
                        ) : (
                          <FiCircle className="unselected-icon" />
                        )}
                      </div>
                    ))}
                    
                    {plots.length > 6 && (
                      <div 
                        className="plot-toggle-indicator"
                        onClick={toggleShowAllPlots}
                      >
                        {showAllPlots ? (
                          <>
                            <FiChevronUp size={16} />
                            Show Less
                          </>
                        ) : (
                          <>
                            <FiChevronDown size={16} />
                            +{plots.length - 6} more
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {selectedPlots.length > 0 && (
                    <div className="selected-plots-compact">
                      <div className="selected-plots-tags">
                        {selectedPlots.map(plot => (
                          <span key={plot.id} className="plot-tag">
                            Plot {plot.number}
                            <button 
                              type="button"
                              className="tag-remove"
                              onClick={() => handlePlotSelection(plot)}
                            >
                              <FiX size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="plots-total">
                        <span>Total Plots: {selectedPlots.length}</span>
                        <span>Total: {formatCurrency(selectedPlots.reduce((sum, plot) => sum + parseFloat(plot.price || 0), 0))}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="form-section compact-section">
              <div className="form-row compact-row">
                <div className="form-group compact-group">
                  <label><FiCalendar className="icon" /> Acquisition Date *</label>
                  <input
                    type="date"
                    name="date_taken"
                    value={formData.date_taken}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group compact-group">
                  <label><FiDatabase className="icon" /> Number of Plots</label>
                  <input
                    type="number"
                    name="number_of_plots"
                    value={formData.number_of_plots}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    disabled={type === 'create'}
                    className="disabled-input"
                  />
                </div>
              </div>
            </div>

            <div style={{ padding: '20px', border: '1px solid #e1e5e9', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#2c3e50' }}>
                <FiDollarSign style={{ fontSize: '18px' }} />
                Financial Details
              </h4>
              
              {type === 'create' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Plot Prices</label>
                    <div style={{ 
                      padding: '10px', 
                      backgroundColor: '#f8f9fa', 
                      border: '1px solid #e1e5e9', 
                      borderRadius: '4px',
                      fontSize: '14px',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {selectedPlots.length > 0 ? selectedPlots.map(plot => formatCurrency(plot.price)).join(', ') : 'No plots selected'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Total Price</label>
                    <div style={{ 
                      padding: '10px', 
                      backgroundColor: '#e8f5e8', 
                      border: '1px solid #4caf50', 
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#2e7d32',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {formatCurrency(calculateTotalPrice(formData.price_per_plot))}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Initial Deposit *</label>
                    <input
                      type="number"
                      name="initial_deposit"
                      value={formData.initial_deposit}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      max={calculateTotalPrice(formData.price_per_plot)}
                      required
                      style={{
                        padding: '10px',
                        border: '1px solid #e1e5e9',
                        borderRadius: '4px',
                        fontSize: '14px',
                        minHeight: '40px'
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Balance</label>
                    <div style={{ 
                      padding: '10px', 
                      backgroundColor: (calculateTotalPrice(formData.price_per_plot) - parseFloat(formData.initial_deposit || 0)) <= 0 ? '#e8f5e8' : '#fff3e0',
                      border: (calculateTotalPrice(formData.price_per_plot) - parseFloat(formData.initial_deposit || 0)) <= 0 ? '1px solid #4caf50' : '1px solid #ff9800',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: (calculateTotalPrice(formData.price_per_plot) - parseFloat(formData.initial_deposit || 0)) <= 0 ? '#2e7d32' : '#e65100',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      {formatCurrency(calculateTotalPrice(formData.price_per_plot) - parseFloat(formData.initial_deposit || 0))}
                      {(calculateTotalPrice(formData.price_per_plot) - parseFloat(formData.initial_deposit || 0)) <= 0 && (
                        <span style={{
                          backgroundColor: '#4caf50',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>Paid</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Plot Taken *</label>
                    <input
                      type="text"
                      name="plot_taken"
                      value={formData.plot_taken}
                      onChange={handleInputChange}
                      required
                      style={{
                        padding: '10px',
                        border: '1px solid #e1e5e9',
                        borderRadius: '4px',
                        fontSize: '14px',
                        minHeight: '40px'
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Price per Plot *</label>
                    <input
                      type="text"
                      name="price_per_plot"
                      value={formData.price_per_plot}
                      onChange={handleInputChange}
                      required
                      style={{
                        padding: '10px',
                        border: '1px solid #e1e5e9',
                        borderRadius: '4px',
                        fontSize: '14px',
                        minHeight: '40px'
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Initial Deposit *</label>
                    <input
                      type="number"
                      name="initial_deposit"
                      value={formData.initial_deposit}
                      onChange={handleInputChange}
                      required
                      style={{
                        padding: '10px',
                        border: '1px solid #e1e5e9',
                        borderRadius: '4px',
                        fontSize: '14px',
                        minHeight: '40px'
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Total Balance</label>
                    <input
                      type="number"
                      name="total_balance"
                      value={formData.total_balance}
                      onChange={handleInputChange}
                      style={{
                        padding: '10px',
                        border: '1px solid #e1e5e9',
                        borderRadius: '4px',
                        fontSize: '14px',
                        minHeight: '40px'
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginTop: '15px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#555',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <FiPieChart style={{ fontSize: '16px' }} />
                  Payment Schedule *
                </label>
                <select
                  name="payment_schedule"
                  value={formData.payment_schedule}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '40px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select Payment Terms</option>
                  <option value="3 Months">3 Months</option>
                  <option value="12 Months">12 Months</option>
                  <option value="18 Months">18 Months</option>
                  <option value="24 Months">24 Months</option>
                  <option value="30 Months">30 Months</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Bi-Annual">Bi-Annual</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>

            <div className="modal-footer compact-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                <FiX className="icon" /> Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || (type === 'create' && selectedPlots.length === 0)}
              >
                {loading ? 'Processing...' : (
                  type === 'create' ? <><FiUserPlus className="icon" /> Register Customer</> : 'Update User'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;