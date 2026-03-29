import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, CloudLightning, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AlertBanner from '../components/ui/AlertBanner';

const Forecasting = () => {
    const [formData, setFormData] = useState({
        dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        weather: 'Clear',
        event: ''
    });
    
    const [prediction, setPrediction] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('planeat_token');
            const res = await fetch('http://localhost:5000/api/predict/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('planeat_token');
            const res = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const data = await res.json();
                setPrediction(data);
                fetchHistory(); // refresh history
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weatherOpts = ['Clear', 'Cloudy', 'Rainy', 'Stormy'];

    // Format chart data
    const chartData = history.map(item => ({
        day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        Predicted: item.predicted_count,
        Actual: item.actual_count
    }));

    return (
        <div className="page-container">
            <div className="page-header animate-slide-up">
                <h1 className="page-title">Demand Forecasting</h1>
                <p className="page-subtitle">Predict customer footfall and generate optimal cooking quantities</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px' }}>
                {/* Inputs */}
                <div className="card animate-slide-up delay-1">
                    <h3 className="card-title">Forecast Parameters</h3>
                    <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <div className="input-group">
                                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={16} color="var(--text-muted)" /> Day of Week
                                </label>
                                <select 
                                    className="select-input" 
                                    value={formData.dayOfWeek}
                                    onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                                >
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            
                            <div className="input-group">
                                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CloudLightning size={16} color="var(--text-muted)" /> Weather Conditions
                                </label>
                                <select 
                                    className="select-input"
                                    value={formData.weather}
                                    onChange={(e) => setFormData({...formData, weather: e.target.value})}
                                >
                                    {weatherOpts.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                            </div>

                            <div className="input-group" style={{ marginBottom: '24px' }}>
                                <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Activity size={16} color="var(--text-muted)" /> Special Events
                                </label>
                                <input 
                                    type="text" 
                                    className="text-input" 
                                    placeholder="eg. Exam, Festival, Holiday" 
                                    value={formData.event}
                                    onChange={(e) => setFormData({...formData, event: e.target.value})}
                                />
                                <small style={{ color: 'var(--text-light)', marginTop: '8px', display: 'block', fontSize: '13px' }}>Optional: impacts prediction models</small>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '16px', marginTop: 'auto' }} disabled={loading}>
                            {loading ? 'Analyzing...' : 'Run Neural Forecast'}
                        </button>
                    </form>
                </div>

                {/* Results & Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {prediction ? (
                        <div className="card animate-slide-up delay-2" style={{ backgroundColor: 'var(--accent-light)', border: '1px solid rgba(42, 157, 143, 0.3)', boxShadow: '0 8px 16px rgba(42, 157, 143, 0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Predicted Demand</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'Inter' }}>For {formData.dayOfWeek} ({formData.weather}{formData.event ? `, ${formData.event}` : ''})</p>
                                </div>
                                <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-2px', lineHeight: 1 }}>
                                    {prediction.predicted}
                                    <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600, marginLeft: '8px', letterSpacing: '0' }}>people</span>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '24px' }}>
                                <AlertBanner 
                                    type="success"
                                    title="Menu Plan Generated"
                                    message="Optimal cooking quantities have been updated based on this forecast."
                                    actionText="View Menu Plan"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="card animate-slide-up delay-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', backgroundColor: 'var(--surface)' }}>
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                <TrendingUp size={48} style={{ color: 'var(--border-color)', marginBottom: '16px', opacity: 0.5 }} />
                                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>No Active Forecast</h3>
                                <p style={{ fontSize: '14px', maxWidth: '300px', margin: '0 auto', fontFamily: 'Inter' }}>Run the forecasting model on the left to predict upcoming footfall.</p>
                            </div>
                        </div>
                    )}

                    <div className="card animate-slide-up delay-3" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 className="card-title" style={{ margin: 0 }}>Prediction Accuracy (Last 7 Days)</h3>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: 'var(--primary)' }}></div> Predicted</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: 'var(--accent)' }}></div> Actual</div>
                            </div>
                        </div>
                        <div style={{ height: '280px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(33, 37, 41, 0.05)" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter'}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-md)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', fontFamily: 'Inter', fontWeight: 600 }}
                                    />
                                    <Line type="monotone" dataKey="Predicted" stroke="var(--primary)" strokeWidth={4} dot={{r: 4, strokeWidth: 0}} activeDot={{r: 8, stroke: '#FFFFFF', strokeWidth: 2}} />
                                    <Line type="monotone" dataKey="Actual" stroke="var(--accent)" strokeWidth={4} dot={{r: 4, strokeWidth: 0}} activeDot={{r: 8, stroke: '#FFFFFF', strokeWidth: 2}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forecasting;
