import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UtensilsCrossed } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    institution: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const success = await signup(formData);
    if (success) {
      navigate('/');
    } else {
      setErrorMsg('Signup failed. User may already exist.');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-logo">
          <UtensilsCrossed size={40} className="auth-logo-icon" />
          <span className="auth-logo-text">Planeat</span>
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--text-main)' }}>Create an Account</h2>
        <p style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)' }}>Start reducing food waste today</p>

        {errorMsg && (
          <div style={{ padding: '12px', backgroundColor: '#FEF2F2', color: '#E74C3C', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="text-input" required />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="text-input" required />
          </div>
          <div className="input-group">
             <label className="input-label">Institution Name</label>
             <input type="text" name="institution" value={formData.institution} onChange={handleChange} className="text-input" required />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="text-input" required />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
            Sign Up
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
