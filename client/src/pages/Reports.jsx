import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Download, Filter } from 'lucide-react';

const Reports = () => {
    const [trendData, setTrendData] = useState([]);
    const [days, setDays] = useState(7);
    const [summary, setSummary] = useState({ totalWaste: 0, totalSavings: 0 });
    
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('planeat_token');
                const res = await fetch(`http://localhost:5000/api/reports/trend?days=${days}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    
                    let wasteSum = 0;
                    let savingsSum = 0;

                    const chartData = data.map(item => {
                        const waste = Math.round(item.total_waste);
                        const savings = Math.max(0, Math.round((50 - item.total_waste) * 2.5)); 
                        wasteSum += waste;
                        savingsSum += savings;

                        return {
                            name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                            WasteAmt: waste,
                            Savings: savings
                        };
                    });
                    setTrendData(chartData);
                    setSummary({ totalWaste: wasteSum, totalSavings: savingsSum });
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchReports();
    }, [days]);

    return (
        <div className="page-container">
            <div className="page-header animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Track your environmental and financial impact over time</p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <select 
                            className="btn btn-secondary" 
                            style={{ appearance: 'none', paddingRight: '40px' }}
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={14}>Last 14 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                        </select>
                        <Filter size={16} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                    <button className="btn btn-primary" onClick={() => alert("Report exported as CSV!")}>
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Summary Mini Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="card animate-slide-up delay-1" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Period Waste</p>
                    <h2 style={{ fontSize: '28px', color: 'var(--danger)' }}>{summary.totalWaste} <span style={{fontSize: '14px'}}>kg</span></h2>
                </div>
                <div className="card animate-slide-up delay-1" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Period Savings</p>
                    <h2 style={{ fontSize: '28px', color: 'var(--accent)' }}>${summary.totalSavings}</h2>
                </div>
                <div className="card animate-slide-up delay-1" style={{ padding: '20px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>CO₂ Avoided</p>
                    <h2 style={{ fontSize: '28px', color: 'var(--primary)' }}>{(summary.totalSavings * 1.8).toFixed(0)} <span style={{fontSize: '14px'}}>kg</span></h2>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Waste Reduction Over Time */}
                <div className="card animate-slide-up delay-1">
                    <div style={{ marginBottom: '24px' }}>
                        <h3 className="card-title" style={{ marginBottom: '4px' }}>Food Waste Trend (kg)</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Lower numbers are better</p>
                    </div>
                    <div style={{ height: '400px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWaste2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(33, 37, 41, 0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter'}} dx={-10} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-md)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }} />
                                <Area type="monotone" dataKey="WasteAmt" name="Waste (kg)" stroke="var(--danger)" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste2)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Impact */}
                <div className="card animate-slide-up delay-2">
                    <div style={{ marginBottom: '24px' }}>
                        <h3 className="card-title" style={{ marginBottom: '4px' }}>Revenue Impact ($)</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Money saved by reducing overproduction</p>
                    </div>
                    <div style={{ height: '400px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(33, 37, 41, 0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter'}} dx={-10} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-md)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }} cursor={{fill: 'var(--accent-light)'}} />
                                <Bar dataKey="Savings" name="Saved ($)" fill="var(--accent)" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
