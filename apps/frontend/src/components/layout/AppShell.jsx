import React, { useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppShell() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();

  if (!token) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Desktop Sidebar */}
      <div style={{ display: 'none' }} className="sidebar-desktop">
        <Sidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Mobile Top Bar */}
      <div style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--topbar-height)', background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)', alignItems: 'center',
        padding: '0 16px', zIndex: 200, gap: 12,
      }} className="topbar-mobile">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
          background: 'transparent', border: 'none', color: 'var(--text-primary)',
          fontSize: '1.3rem', cursor: 'pointer', padding: 4,
        }}>☰</button>
        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>IT Assets</div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }}
          onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: mobileMenuOpen ? 0 : '-100%', height: '100vh',
        zIndex: 160, transition: 'left 0.25s ease',
      }} className="sidebar-mobile">
        <Sidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <main style={{
        flex: 1, minHeight: '100vh',
        paddingLeft: 'var(--sidebar-width)',
        paddingTop: 0,
      }} className="main-content">
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .topbar-mobile { display: flex !important; }
          .main-content { padding-left: 0 !important; padding-top: var(--topbar-height) !important; }
        }
        @media (min-width: 769px) {
          .sidebar-desktop { display: block !important; }
          .topbar-mobile { display: none !important; }
          .sidebar-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
