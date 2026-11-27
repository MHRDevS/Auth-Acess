'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Layers, Shield, CalendarOff, CalendarDays, 
  UserCog, DollarSign, Settings, LogOut, TrendingUp, AlertCircle, 
  Search, ChevronDown, ChevronRight, Activity 
} from 'lucide-react';

function CrownLogo() {
  return (
    <div style={{
      width: '42px',
      height: '42px',
      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 22px rgba(6, 182, 212, 0.45)'
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
      </svg>
    </div>
  );
}

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState('Hasan');
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole && storedRole !== 'Admin') {
      window.location.href = '/signup';
      return;
    }
    const storedName = localStorage.getItem('Admin_userName') || localStorage.getItem('userName');
    if (storedName) setAdminName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signup';
  };

  const orgSubItems = [
    { label: 'Company & Rules', icon: Settings },
    { label: 'Depts & Designations', icon: Layers },
    { label: 'Roles & Access', icon: Shield },
    { label: 'Leave Quotas', icon: CalendarOff },
    { label: 'Public Holidays', icon: CalendarDays },
    { label: 'User Accounts', icon: UserCog },
  ];

  const cardStyle = {
    background: 'rgba(9, 14, 26, 0.88)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid rgba(56, 189, 248, 0.22)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)'
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#02040a',
      backgroundImage: `
        radial-gradient(circle at 12% 15%, rgba(16, 185, 129, 0.24) 0%, transparent 45%),
        radial-gradient(circle at 88% 85%, rgba(139, 92, 246, 0.26) 0%, transparent 45%),
        linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 100% 100%, 34px 34px, 34px 34px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes logoutShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(244, 63, 94, 0.35);
          background: linear-gradient(90deg, rgba(225, 29, 72, 0.14) 0%, rgba(159, 18, 57, 0.22) 50%, rgba(225, 29, 72, 0.14) 100%);
          background-size: 200% auto;
          color: #fda4af;
          cursor: pointer;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }
        .logout-btn:hover {
          background: linear-gradient(90deg, #e11d48 0%, #be123c 50%, #e11d48 100%);
          background-size: 200% auto;
          animation: logoutShimmer 2.5s linear infinite;
          border-color: rgba(254, 205, 211, 0.7);
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(225, 29, 72, 0.45), 0 0 16px rgba(244, 63, 94, 0.35);
        }
        .logout-btn:active {
          transform: translateY(0px) scale(0.96);
        }
        .logout-btn .logout-icon {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .logout-btn:hover .logout-icon {
          transform: translateX(4px) scale(1.1);
        }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingRight: '16px',
        borderRight: '1px solid rgba(56, 189, 248, 0.16)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '26px' }}>
            <CrownLogo />
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>Hasan</div>
              <div style={{
                fontSize: '11px', fontWeight: '700',
                background: 'linear-gradient(90deg, #34d399, #38bdf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Workforce OS
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <a href="/dashboard/admin" style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
              borderRadius: '12px', background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(139, 92, 246, 0.18) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold'
            }}>
              <LayoutDashboard size={16} color="#5eead4" /> Overview
            </a>

            <div>
              <button
                onClick={() => setOrgMenuOpen(!orgMenuOpen)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: '10px',
                  background: orgMenuOpen ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  border: 'none', color: '#7dd3fc', fontSize: '13px',
                  fontWeight: '600', cursor: 'pointer'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Settings size={16} /> Organization Setup
                </span>
                {orgMenuOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {orgMenuOpen && (
                <div style={{
                  marginTop: '4px',
                  marginLeft: '14px',
                  paddingLeft: '10px',
                  borderLeft: '1.5px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {orgSubItems.map((sub, i) => {
                    const Icon = sub.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => router.push('/dashboard/admin/setup')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '7px 10px', borderRadius: '8px',
                          background: 'transparent', border: 'none',
                          color: '#94a3b8', fontSize: '12px', cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        <Icon size={13} color="#34d399" /> {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#7dd3fc', textDecoration: 'none', fontSize: '13px' }}>
              <DollarSign size={16} /> Payroll Audits
            </a>
          </nav>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            background: 'rgba(9, 14, 26, 0.9)',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(56, 189, 248, 0.22)'
          }}>
            <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#6ee7b7' }}>
              ⚡ Executive Center
            </p>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
              Audit controls & privileges active.
            </p>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={15} className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '16px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: '24px', fontWeight: '800', margin: 0,
              background: 'linear-gradient(90deg, #ffffff 0%, #6ee7b7 60%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Admin Dashboard, {adminName}
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Manage system access, policies, and organization parameters.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(9, 14, 26, 0.9)', padding: '5px 12px',
              borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.35)'
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 'bold'
              }}>
                AD
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{adminName}</span>
              <ChevronDown size={14} color="#38bdf8" />
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#38bdf8' }} />
              <input 
                type="text" 
                placeholder="Search Audits..." 
                style={{
                  background: 'rgba(4, 7, 15, 0.9)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '16px',
                  padding: '6px 12px 6px 30px',
                  color: '#ffffff',
                  fontSize: '12px',
                  outline: 'none',
                  width: '140px'
                }}
              />
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <div style={cardStyle}>
            <div style={{ fontSize: '11px', color: '#7dd3fc' }}>Total Headcount</div>
            <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0', color: '#ffffff' }}>42</div>
            <div style={{ fontSize: '11px', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> +4 active this month
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '11px', color: '#7dd3fc' }}>Monthly Payroll Cost</div>
            <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0', color: '#ffffff' }}>$45,200</div>
            <div style={{ fontSize: '11px', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> Within allocated budget
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: '11px', color: '#7dd3fc' }}>Retention Health</div>
            <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0', color: '#ffffff' }}>95.8%</div>
            <div style={{ fontSize: '11px', color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={12} /> Steady organizational rate
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1fr', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.16)', border: '1px solid rgba(52, 211, 153, 0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Activity size={20} color="#34d399" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>System Operational</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6ee7b7' }}>All services running</p>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>Quick Configurations</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => router.push('/dashboard/admin/setup')}
                  style={{
                    padding: '10px 12px',
                    background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
                    color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '700',
                    cursor: 'pointer', textAlign: 'left', boxShadow: '0 4px 18px rgba(6, 182, 212, 0.35)'
                  }}
                >
                  + Create HR / Staff Login
                </button>
                <button
                  onClick={() => router.push('/dashboard/admin/setup')}
                  style={{
                    padding: '10px 12px', background: '#040812', color: '#e2e8f0',
                    border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', fontSize: '12px',
                    cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  ⚙️ Organization Setup
                </button>
                <button style={{
                  padding: '10px 12px', background: '#040812', color: '#e2e8f0',
                  border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', fontSize: '12px',
                  cursor: 'pointer', textAlign: 'left'
                }}>
                  📊 Export Audit Log
                </button>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>Pending Approvals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Ali Khan', role: 'HR Manager', time: '10m ago' },
                { name: 'Sara Ahmed', role: 'Employee', time: '1h ago' },
                { name: 'Bilal Raza', role: 'Lead', time: '3h ago' },
              ].map((req, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 11px', background: '#040812', borderRadius: '10px',
                  border: '1px solid rgba(56, 189, 248, 0.16)'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{req.name} ({req.role})</div>
                    <div style={{ fontSize: '9px', color: '#7dd3fc' }}>{req.time}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Approve</button>
                    <button style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>Recent Audit Trail</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div style={{ background: '#040812', padding: '9px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.16)' }}>
                <div style={{ fontWeight: 'bold' }}>🔐 Admin Login Recorded</div>
                <div style={{ fontSize: '9px', color: '#7dd3fc' }}>Just now by {adminName}</div>
              </div>
              <div style={{ background: '#040812', padding: '9px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.16)' }}>
                <div style={{ fontWeight: 'bold' }}>👥 Role Assigned</div>
                <div style={{ fontSize: '9px', color: '#7dd3fc' }}>Permissions updated</div>
              </div>
              <div style={{ background: '#040812', padding: '9px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.16)' }}>
                <div style={{ fontWeight: 'bold' }}>📄 Policy Updated</div>
                <div style={{ fontSize: '9px', color: '#7dd3fc' }}>2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}