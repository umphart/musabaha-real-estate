import React from 'react';

const NextOfKinData = ({ formData, errors, fieldMaxLengths, handleChange }) => {
  return (
    <div className="form-section">
      <h4>Next of Kin's Data</h4>
      
      <div className="form-group">
        <label>Full Name *</label>
        <input 
          type="text" 
          name="nextOfKinName" 
          value={formData.nextOfKinName} 
          onChange={handleChange} 
          maxLength={fieldMaxLengths.nextOfKinName}
          required 
        />
        {errors.nextOfKinName && <span className="error-text">{errors.nextOfKinName}</span>}
      </div>
      
      <div className="form-group">
        <label>Address *</label>
        <input 
          type="text" 
          name="nextOfKinAddress" 
          value={formData.nextOfKinAddress} 
          onChange={handleChange} 
          maxLength={fieldMaxLengths.nextOfKinAddress}
          required 
        />
        {errors.nextOfKinAddress && <span className="error-text">{errors.nextOfKinAddress}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Relationship *</label>
          <input 
            type="text" 
            name="nextOfKinRelationship" 
            value={formData.nextOfKinRelationship} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.nextOfKinRelationship}
            required 
          />
          {errors.nextOfKinRelationship && <span className="error-text">{errors.nextOfKinRelationship}</span>}
        </div>
        
        <div className="form-group">
          <label>Phone Number *</label>
          <input 
            type="tel" 
            name="nextOfKinPhoneNumber" 
            value={formData.nextOfKinPhoneNumber} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.nextOfKinPhoneNumber}
            required 
          />
          {errors.nextOfKinPhoneNumber && <span className="error-text">{errors.nextOfKinPhoneNumber}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Occupation *</label>
          <input 
            type="text" 
            name="nextOfKinOccupation" 
            value={formData.nextOfKinOccupation} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.nextOfKinOccupation}
            required 
          />
          {errors.nextOfKinOccupation && <span className="error-text">{errors.nextOfKinOccupation}</span>}
        </div>
        
        <div className="form-group">
          <label>Office Address</label>
          <input 
            type="text" 
            name="nextOfKinOfficeAddress" 
            value={formData.nextOfKinOfficeAddress} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.nextOfKinOfficeAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default NextOfKinData;