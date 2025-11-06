import React from 'react';

const NotificationSystem = ({ 
  notifications, 
  showNotification, 
  setShowNotification, 
  closeNotification, 
  clearAllNotifications 
}) => {
  return (
    <div className="notification-container">
      <button 
        className="notification-bell"
        onClick={() => setShowNotification(!showNotification)}
      >
        <i className="fas fa-bell"></i>
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotification && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            <button onClick={() => setShowNotification(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <i className="fas fa-bell-slash"></i>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div key={notification.id} className={`notification-item ${notification.type}`}>
                  <div className="notification-icon">
                    <i className={`fas fa-${notification.type === 'success' ? 'check-circle' : 'info-circle'}`}></i>
                  </div>
                  <div className="notification-content">
                    <h5>{notification.title}</h5>
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.timestamp}</span>
                  </div>
                  <button 
                    className="notification-close"
                    onClick={() => closeNotification(notification.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="notification-footer">
              <button onClick={clearAllNotifications}>
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;