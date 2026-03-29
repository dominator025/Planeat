import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Save, Bell, Database, Shield } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import API_BASE_URL from '../config/api';

const Settings = () => {
    const { user, login } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        institution: '',
        institution_type: 'university',
        institution_size: 850,
        sms_alerts: true,
        overproduction_alerts: true
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('planeat_token');
                const res = await fetch(`${API_BASE_URL}/settings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        institution: data.institution || '',
                        institution_type: data.institution_type || 'university',
                        institution_size: data.institution_size || 850,
                        sms_alerts: Boolean(data.sms_alerts),
                        overproduction_alerts: Boolean(data.overproduction_alerts)
                    });
                }
            } catch (err) {
                console.error("Error fetching settings: ", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('planeat_token');
            const res = await fetch(`${API_BASE_URL}/settings`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert("Settings updated successfully!");
                const updatedUser = await res.json();
            } else {
                alert("Error saving settings.");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving settings.");
        }
    };

    const handleReset = async () => {
        if (!window.confirm("Are you sure you want to delete ALL tracking data? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem('planeat_token');
            const res = await fetch(`${API_BASE_URL}/settings/reset`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert("Data Reset Successfully. Charts will rebuild as new data drops in.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner text="Loading preferences..." />;

    return (
        <div className="page-container" style={{ maxWidth: '800px' }}>
            <div className="page-header animate-slide-up">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage institution preferences and platform options</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Institution Profile */}
                <div className="card animate-slide-up delay-1">
                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Shield size={20} color="var(--primary)" /> Institution Profile
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
                        <div className="input-group">
                            <label className="input-label">Institution Name</label>
                            <input type="text" name="institution" value={settings.institution} onChange={handleChange} className="text-input" placeholder="e.g. Tech University Campus" />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Institution Type</label>
                            <select name="institution_type" value={settings.institution_type} onChange={handleChange} className="select-input">
                                <option value="university">University Hostel</option>
                                <option value="corporate">Corporate Cafeteria</option>
                                <option value="school">School</option>
                                <option value="hospital">Hospital</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Average Daily Students/Staff</label>
                            <input type="number" name="institution_size" value={settings.institution_size} onChange={handleChange} className="text-input" />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Contact Email</label>
                            <input type="email" className="text-input" defaultValue={user?.email || "admin@planeat.demo"} disabled style={{ backgroundColor: '#F8FAFC' }} />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card animate-slide-up delay-2">
                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={20} color="var(--primary)" /> Notifications Integration
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>Daily SMS Reports</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Receive end-of-day waste and savings summaries via SMS.</div>
                            </div>
                            <input type="checkbox" name="sms_alerts" checked={settings.sms_alerts} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                        </label>
                        
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px' }}>High Overproduction Alerts</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Instant notification when planned menu greatly exceeds demand.</div>
                            </div>
                            <input type="checkbox" name="overproduction_alerts" checked={settings.overproduction_alerts} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                        </label>
                    </div>
                </div>

                {/* Data Management */}
                <div className="card animate-slide-up delay-3">
                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={20} color="var(--primary)" /> Data Management
                    </h3>
                    
                    <div style={{ marginTop: '24px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Demo data generated by sqlite can be reset here to start a fresh tracking session.
                        </p>
                        <button onClick={handleReset} className="btn btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                            Reset All Data
                        </button>
                    </div>
                </div>

                {/* Save Block */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }} className="animate-slide-up delay-3">
                    <button className="btn btn-primary" style={{ padding: '12px 32px' }} onClick={handleSave}>
                        <Save size={18} /> Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
