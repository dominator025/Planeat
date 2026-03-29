import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, icon, trend, trendValue, color = 'primary', animationDelay = 'delay-1' }) => {
  const isPositive = trend === 'up';
  
  const styling = {
    primary: {
      gradient: 'linear-gradient(135deg, #FFF9F5 0%, #FFFFFF 100%)',
      iconBg: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
      iconColor: '#FFFFFF',
      border: 'rgba(232, 93, 4, 0.2)',
      shadow: '0 8px 16px rgba(232, 93, 4, 0.08)'
    },
    accent: {
      gradient: 'linear-gradient(135deg, #F0FAF9 0%, #FFFFFF 100%)',
      iconBg: 'linear-gradient(135deg, var(--accent) 0%, #48BCAE 100%)',
      iconColor: '#FFFFFF',
      border: 'rgba(42, 157, 143, 0.2)',
      shadow: '0 8px 16px rgba(42, 157, 143, 0.08)'
    },
    danger: {
      gradient: 'linear-gradient(135deg, #FFF5F6 0%, #FFFFFF 100%)',
      iconBg: 'linear-gradient(135deg, var(--danger) 0%, #F0717B 100%)',
      iconColor: '#FFFFFF',
      border: 'rgba(230, 57, 70, 0.2)',
      shadow: '0 8px 16px rgba(230, 57, 70, 0.08)'
    }
  }[color];

  return (
    <div className={`card animate-slide-up ${animationDelay}`} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      background: styling.gradient,
      borderTop: `4px solid ${styling.iconBg.split(' ')[2]}`, // Extract base color roughly
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative background glow */}
      <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '100px',
          height: '100px',
          background: styling.iconBg,
          opacity: 0.05,
          borderRadius: '50%',
          filter: 'blur(20px)'
      }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.5px' }}>{title}</h3>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
             <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1, letterSpacing: '-1px' }}>
                {value.toString().replace(/[^\d.-]/g, '')}
             </div>
             {value.toString().match(/[a-zA-Z$]/) && (
               <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-light)', position: 'relative', top: '-2px' }}>
                  {value.toString().replace(/[\d.,-]/g, '').trim() || '$'}
               </div>
             )}
          </div>
        </div>
        
        <div style={{ 
            padding: '14px', 
            borderRadius: '16px', 
            background: styling.iconBg, 
            color: styling.iconColor,
            boxShadow: styling.shadow,
            transform: 'rotate(-5deg)'
        }}>
          {icon}
        </div>
      </div>
      
      {trendValue && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            background: isPositive ? 'var(--accent-light)' : 'var(--danger-light)',
            color: isPositive ? 'var(--accent)' : 'var(--danger)',
            padding: '4px 8px',
            borderRadius: '20px',
            fontWeight: 700,
            marginRight: '8px',
            gap: '4px'
          }}>
            {isPositive ? <ArrowUpRight size={16} strokeWidth={3} /> : <ArrowDownRight size={16} strokeWidth={3} />}
            {trendValue}
          </span>
          <span style={{ color: 'var(--text-light)', fontWeight: 500 }}>vs last week</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
