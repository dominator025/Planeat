import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UtensilsCrossed } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: 'admin@planeat.demo', password: 'password123' });
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/');
    } else {
      setErrorMsg('Invalid Credentials');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-logo">
          <UtensilsCrossed size={40} className="auth-logo-icon" />
          <span className="auth-logo-text">Planeat</span>
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--text-main)' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)' }}>Demo Account: admin@planeat.demo / password123</p>

        {errorMsg && (
          <div style={{ padding: '12px', backgroundColor: '#FEF2F2', color: '#E74C3C', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="text-input" 
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="text-input" 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
