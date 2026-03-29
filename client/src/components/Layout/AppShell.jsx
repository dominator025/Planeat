import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, UtensilsCrossed, BarChart3, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AppShell = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/forecast', name: 'Demand Forecasting', icon: <TrendingUp size={20} /> },
        { path: '/menu', name: 'Menu Optimization', icon: <UtensilsCrossed size={20} /> },
        { path: '/reports', name: 'Reports', icon: <BarChart3 size={20} /> },
        { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="app-shell animate-slide-up">
            {/* Floating Sidebar */}
            <aside style={{
                width: '280px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '32px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)'
                }}>
                    <div style={{ 
                        color: 'white', 
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                        padding: '8px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(232, 93, 4, 0.3)'
                    }}>
                        <UtensilsCrossed size={24} />
                    </div>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                        Planeat
                    </span>
                </div>

                <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-light)', letterSpacing: '1px', textTransform: 'uppercase', padding: '0 16px 8px 16px' }}>Main Menu</div>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                backgroundColor: isActive ? 'rgba(232, 93, 4, 0.08)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: isActive ? 600 : 500,
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                transform: isActive ? 'translateX(4px)' : 'translateX(0)'
                            })}
                            onMouseEnter={(e) => {
                                if(!e.currentTarget.style.backgroundColor.includes('rgba(232')) {
                                   e.currentTarget.style.backgroundColor = 'rgba(248, 249, 250, 0.8)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if(!e.currentTarget.style.color.includes('var(--primary)')) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            {link.icon}
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ padding: '24px 16px', background: 'rgba(248, 249, 250, 0.5)' }}>
                    <div style={{ marginBottom: '16px', padding: '12px', background: '#FFFFFF', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name || 'Staff Member'}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>{user?.role === 'admin' ? 'Administrator' : 'Kitchen Staff'}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px',
                            borderRadius: '12px',
                            color: 'var(--danger)',
                            background: 'var(--danger-light)',
                            border: '1px solid transparent',
                            cursor: 'pointer',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(230, 57, 70, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 57, 70, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Floating Topbar */}
                <header style={{
                    height: '80px',
                    borderBottom: '1px solid rgba(33, 37, 41, 0.05)',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 40px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <span style={{ fontSize: '15px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '6px 16px',
                        background: '#FFFFFF',
                        borderRadius: '30px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            color: 'var(--accent)'
                        }}>
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{user?.institution || 'Demo Campus'}</span>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, paddingBottom: '40px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppShell;
