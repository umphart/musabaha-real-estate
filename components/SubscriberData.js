import React from 'react';

const SubscriberData = ({ formData, errors, fieldMaxLengths, handleChange }) => {
  return (
    <div className="form-section">
      <h4>Subscriber's Data</h4>        
      <div className="form-row">
        <div className="form-group">
          <label>Title *</label>
          <select name="title" value={formData.title} onChange={handleChange} required>
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
          </select>
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label>Full Name *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.name}
            required 
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
      </div>
      
      <div className="form-group">
        <label>Residential Address *</label>
        <input 
          type="text" 
          name="residentialAddress" 
          value={formData.residentialAddress} 
          onChange={handleChange} 
          maxLength={fieldMaxLengths.residentialAddress}
          required 
        />
        {errors.residentialAddress && <span className="error-text">{errors.residentialAddress}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Occupation *</label>
          <input 
            type="text" 
            name="occupation" 
            value={formData.occupation} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.occupation}
            required 
          />
          {errors.occupation && <span className="error-text">{errors.occupation}</span>}
        </div>
        
        <div className="form-group">
          <label>Office Address</label>
          <input 
            type="text" 
            name="officeAddress" 
            value={formData.officeAddress} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.officeAddress}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Date of Birth *</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          {errors.dob && <span className="error-text">{errors.dob}</span>}
        </div>
        
        <div className="form-group">
          <label>State of Origin *</label>
          <input 
            type="text" 
            name="stateOfOrigin" 
            value={formData.stateOfOrigin} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.stateOfOrigin}
            required 
          />
          {errors.stateOfOrigin && <span className="error-text">{errors.stateOfOrigin}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>LGA *</label>
          <input 
            type="text" 
            name="lga" 
            value={formData.lga} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.lga}
            required 
          />
          {errors.lga && <span className="error-text">{errors.lga}</span>}
        </div>
        
        <div className="form-group">
          <label>Sex *</label>
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.sex && <span className="error-text">{errors.sex}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Phone Number *</label>
          <input 
            type="tel" 
            name="phoneNumber" 
            value={formData.phoneNumber} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.phoneNumber}
            required 
          />
          {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
        </div>
        
        <div className="form-group">
          <label>Nationality *</label>
          <input 
            type="text" 
            name="nationality" 
            value={formData.nationality} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.nationality}
            required 
          />
          {errors.nationality && <span className="error-text">{errors.nationality}</span>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Home Number</label>
          <input 
            type="tel" 
            name="homeNumber" 
            value={formData.homeNumber} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.homeNumber}
          />
        </div>
        
        <div className="form-group">
          <label>Email *</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            maxLength={fieldMaxLengths.email}
            required 
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
      </div>
      
      <div className="form-group">
        <label>Means of Identification *</label>
        <select name="identification" value={formData.identification} onChange={handleChange} required>
          <option value="">Select ID</option>
          <option value="National ID">National ID</option>
          <option value="Driver's License">Driver's License</option>
          <option value="International Passport">International Passport</option>
          <option value="Voter's Card">Voter's Card</option>
        </select>
        {errors.identification && <span className="error-text">{errors.identification}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Passport Photo *</label>
          <input type="file" name="passportPhoto" onChange={handleChange} accept="image/*" required />
          <small>Upload a recent passport photograph</small>
          {errors.passportPhoto && <span className="error-text">{errors.passportPhoto}</span>}
        </div>
        
        <div className="form-group">
          <label>Identification Document *</label>
          <input type="file" name="identificationFile" onChange={handleChange} accept="image/*,.pdf" required />
          <small>Upload a clear copy of your ID</small>
          {errors.identificationFile && <span className="error-text">{errors.identificationFile}</span>}
        </div>
      </div>
    </div>
  );
};

export default SubscriberData;