import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import KPICard from '../components/ui/KPICard';
import AlertBanner from '../components/ui/AlertBanner';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Users, TrendingDown, DollarSign, Leaf } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: null,
    trend: [],
    latestPrediction: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('planeat_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [summaryRes, trendRes, latestRes] = await Promise.all([
          fetch('http://localhost:5000/api/reports/summary', { headers }),
          fetch('http://localhost:5000/api/reports/trend', { headers }),
          fetch('http://localhost:5000/api/predict/latest', { headers })
        ]);

        if (summaryRes.ok && trendRes.ok && latestRes.ok) {
          const summary = await summaryRes.json();
          const trend = await trendRes.json();
          const latestPrediction = await latestRes.json();
          setData({ summary, trend, latestPrediction });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data.summary) {
    return <LoadingSpinner text="Generating insights..." />;
  }

  // Format trend data for charts
  const chartData = data.trend.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    Waste: Math.round(item.total_waste),
    Consumed: Math.round(item.total_consumed)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <p style={{ margin: '0 0 12px 0', fontWeight: 700, fontSize: '15px' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: entry.color }}></div>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontFamily: 'Inter' }}>{entry.name}:</span>
              <span style={{ fontWeight: 700, fontSize: '15px' }}>{entry.value} kg</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container">
      <div className="page-header animate-slide-up">
        <h1 className="page-title">Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name.split(' ')[0]}</span></h1>
        <p className="page-subtitle">Here is your cafeteria's performance overview</p>
      </div>

      <div className="animate-slide-up delay-1">
          <AlertBanner 
            type="warning" 
            title="Smart Recommendation Detected" 
            message={`Based on ${data.latestPrediction?.weather || 'current'} conditions for tomorrow, we expect ${data.latestPrediction?.predicted_count || 'adjusted'} daily customers. We strongly suggest following the optimized menu plan to minimize waste.`}
            actionText="Review Menu Plan"
          />
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <KPICard 
          title="Predicted Tomorrow" 
          value={data.latestPrediction?.predicted_count || '---'} 
          icon={<Users size={24} />} 
          trend="neutral" 
          trendValue="Live" 
          color="danger"
          animationDelay="delay-1"
        />
        <KPICard 
          title="Waste Saved Today" 
          value={`${data.summary.wasteSavedToday} kg`} 
          icon={<TrendingDown size={24} />} 
          trend="up" 
          trendValue="8%" 
          color="accent"
          animationDelay="delay-2"
        />
        <KPICard 
          title="Revenue Impact" 
          value={`$${data.summary.revenueImpact}`} 
          icon={<DollarSign size={24} />} 
          trend="up" 
          trendValue="15%" 
          color="accent"
          animationDelay="delay-3"
        />
        <KPICard 
          title="Total CO2 Saved" 
          value={`${data.summary.totalWasteSaved * 2.5} kg`} 
          icon={<Leaf size={24} />} 
          color="primary"
          animationDelay="delay-3"
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px' }}>
        
        {/* Weekly Consumption vs Waste */}
        <div className="card animate-slide-up delay-2">
          <h3 className="card-title">Weekly Consumption vs Waste</h3>
          <div style={{ height: '320px', width: '100%', marginTop: '24px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(33, 37, 41, 0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ADB5BD', fontSize: 13, fontFamily: 'Inter'}} dy={12} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#ADB5BD', fontSize: 13, fontFamily: 'Inter'}} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(33, 37, 41, 0.02)'}} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '24px', fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }} />
                <Bar dataKey="Consumed" stackId="a" fill="var(--accent)" radius={[0, 0, 6, 6]} />
                <Bar dataKey="Waste" stackId="a" fill="var(--danger)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Savings Trend */}
        <div className="card animate-slide-up delay-3">
          <h3 className="card-title">Waste Trend Tracker</h3>
          <div style={{ height: '320px', width: '100%', marginTop: '24px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(33, 37, 41, 0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ADB5BD', fontSize: 13, fontFamily: 'Inter'}} dy={12} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#ADB5BD', fontSize: 13, fontFamily: 'Inter'}} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Waste" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorWaste)" activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--primary-hover)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
