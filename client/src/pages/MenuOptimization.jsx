import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, AlertCircle, CheckCircle, TrendingDown, ArrowRight } from 'lucide-react';

const MenuOptimization = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const token = localStorage.getItem('planeat_token');
            const dateStr = new Date().toISOString().split('T')[0];
            
            // Try fetching today's saved plan first
            const savedRes = await fetch(`http://localhost:5000/api/menu/daily/${dateStr}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (savedRes.ok) {
                const savedData = await savedRes.json();
                if (savedData.length > 0) {
                    const parsedData = savedData.map(item => ({
                        ...item,
                        suggested: item.suggested_qty,
                        actual: item.actual_qty,
                    }));
                    setMenuItems(parsedData);
                    setLoading(false);
                    return;
                }
            }

            // Fallback: Generate from base items if no plan explicitly saved yet for today
            const [itemsRes, predictRes] = await Promise.all([
                fetch('http://localhost:5000/api/menu/items', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/predict/latest', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (itemsRes.ok && predictRes.ok) {
                const data = await itemsRes.json();
                const latest = await predictRes.json();
                
                // Calculate scale based on prediction vs a baseline of 800
                const predictionValue = latest?.predicted_count || 800;
                const dynamicScale = predictionValue / 800;
                
                const itemsWithQty = data.map(item => ({
                    ...item,
                    suggested: Math.round(item.base_quantity * dynamicScale),
                    actual: Math.round(item.base_quantity * dynamicScale),
                    status: 'optimal'
                }));
                setMenuItems(itemsWithQty);
            }
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (id, newQty) => {
        setMenuItems(prev => prev.map(item => {
            if (item.id === id) {
                const num = parseInt(newQty) || 0;
                let stat = 'optimal';
                if (num > item.suggested * 1.1) {
                    stat = 'risk'; 
                } else if (num < item.suggested * 0.9) {
                     stat = 'under';
                }
                
                return { ...item, actual: num, status: stat };
            }
            return item;
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('planeat_token');
            const dateStr = new Date().toISOString().split('T')[0];
            
            const payload = {
                date: dateStr,
                items: menuItems
            };

            const res = await fetch('http://localhost:5000/api/menu/daily', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Daily Menu Quantities Successfully Saved to Database!");
            } else {
                alert("Error saving data.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Error processing save.");
        }
    };

    if (loading) return <div>Loading menu data...</div>;

    const getStatusColors = (status) => {
        if (status === 'risk') return { bg: 'var(--danger-light)', color: 'var(--danger)', icon: <AlertCircle size={20} /> };
        if (status === 'under') return { bg: '#FFFBEB', color: '#F5A623', icon: <AlertTriangle size={20} /> };
        return { bg: 'var(--accent-light)', color: 'var(--accent)', icon: <CheckCircle size={20} /> };
    };

    return (
        <div className="page-container">
            <div className="page-header animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Menu Optimization</h1>
                    <p className="page-subtitle">Adjust cooking quantities to match predicted demand</p>
                </div>
                <button 
                    onClick={handleSave} 
                    className="btn btn-primary" 
                    style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '16px' }}
                >
                    <Save size={20} /> Confirm Plan
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {menuItems.map((item, index) => {
                    const statusConfig = getStatusColors(item.status);
                    
                    return (
                        <div key={item.id} className={`card animate-slide-up delay-${(index % 3) + 1}`} style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr auto auto auto', 
                            alignItems: 'center', 
                            gap: '32px',
                            padding: '24px 32px',
                            borderRadius: '24px',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            borderLeft: `6px solid ${statusConfig.color}`
                        }}>
                            
                            {/* Item Info */}
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>{item.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ 
                                        padding: '4px 12px', 
                                        backgroundColor: '#F8F9FA', 
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '20px', 
                                        fontSize: '12px', 
                                        fontWeight: 700,
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* AI Suggestion */}
                            <div style={{ textAlign: 'center', background: 'var(--bg-main)', padding: '16px 24px', borderRadius: '16px' }}>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Suggestion</p>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                                    {item.suggested} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-light)' }}>{item.unit}</span>
                                </div>
                            </div>

                            <ArrowRight color="var(--border-color)" strokeWidth={3} size={24} />

                            {/* Staff Input */}
                            <div style={{ position: 'relative' }}>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actual Prep</p>
                                <div style={{ position: 'relative', width: '160px' }}>
                                    <input 
                                        type="number"
                                        value={item.actual}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '16px 48px 16px 20px',
                                            border: `2px solid ${item.status === 'optimal' ? 'var(--border-color)' : statusConfig.color}`,
                                            borderRadius: '16px',
                                            fontSize: '24px',
                                            fontWeight: 800,
                                            color: 'var(--text-main)',
                                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                            outline: 'none',
                                            fontFamily: 'Outfit, sans-serif',
                                            background: '#FFFFFF',
                                            boxShadow: item.status !== 'optimal' ? `0 0 0 4px ${statusConfig.bg}` : 'none'
                                        }}
                                        onFocus={(e) => {
                                            if (item.status === 'optimal') {
                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(232, 93, 4, 0.1)';
                                            }
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = item.status === 'optimal' ? 'var(--border-color)' : statusConfig.color;
                                            e.currentTarget.style.boxShadow = item.status !== 'optimal' ? `0 0 0 4px ${statusConfig.bg}` : 'none';
                                        }}
                                    />
                                    <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '16px' }}>
                                        {item.unit}
                                    </span>
                                </div>
                            </div>

                            {/* Status Indicator */}
                            <div style={{ 
                                width: '220px',
                                padding: '16px', 
                                background: statusConfig.bg, 
                                borderRadius: '16px',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px', 
                                color: statusConfig.color, 
                                fontWeight: 700, 
                                fontSize: '15px' 
                            }}>
                                {statusConfig.icon}
                                {item.status === 'optimal' && 'Optimal Quantity'}
                                {item.status === 'risk' && 'Overproduction Risk'}
                                {item.status === 'under' && 'Shortage Expected'}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MenuOptimization;
