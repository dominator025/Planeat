import React from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

const icons = {
  info: <Info size={20} className="alert-icon-info" color="#3B82F6" />,
  success: <CheckCircle size={20} className="alert-icon-success" color="#2ECC71" />,
  warning: <AlertTriangle size={20} className="alert-icon-warning" color="#F5A623" />,
  error: <AlertCircle size={20} className="alert-icon-error" color="#E74C3C" />
};

const bgColors = {
  info: '#EFF6FF',
  success: '#F0FDF4',
  warning: '#FFFBEB',
  error: '#FEF2F2'
};

const borderColors = {
  info: '#BFDBFE',
  success: '#BBF7D0',
  warning: '#FEF08A',
  error: '#FECACA'
};

const AlertBanner = ({ type = 'info', title, message, actionText, onAction }) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        padding: '16px', 
        backgroundColor: bgColors[type], 
        border: `1px solid ${borderColors[type]}`,
        borderRadius: '12px',
        marginBottom: '24px'
      }}
    >
      <div style={{ marginRight: '16px', marginTop: '2px' }}>
        {icons[type]}
      </div>
      <div style={{ flex: 1 }}>
        {title && <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>{title}</h4>}
        <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: 1.5 }}>{message}</p>
      </div>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            color: '#111827',
            cursor: 'pointer',
            padding: '4px 8px',
            marginLeft: '16px',
            textDecoration: 'underline'
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
