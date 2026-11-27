'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, UserCheck, Calendar, UserPlus, 
  FileCheck, Search, ChevronDown, ChevronRight, CheckCircle, Clock3, 
  AlertCircle, LogOut, Clock, Layers, CalendarOff, CalendarDays, MapPin 
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

export default function HRDashboard() {
  const [hrName, setHrName] = useState('Hasan');
  const [activeSection, setActiveSection] = useState('overview');
  const [policyOpen, setPolicyOpen] = useState(false);
  const [orgData, setOrgData] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole && storedRole !== 'HR') {
      window.location.href = '/signup';
      return;
    }
    const storedName = localStorage.getItem('HR_userName') || localStorage.getItem('userName');
    if (storedName) setHrName(storedName);

    fetch('/api/org')
      .then((res) => res.json())
      .then((data) => setOrgData(data))
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signup';
  };

  const policySubItems = [
    { id: 'policy-rules', label: 'Office Timings & GPS', icon: Clock },
    { id: 'policy-depts', label: 'Departments List', icon: Layers },
    { id: 'policy-leaves', label: 'Leave Quotas', icon: CalendarOff },
    { id: 'policy-holidays', label: 'Public Holidays', icon: CalendarDays },
  ];

  const cardStyle = {
    background: 'rgba(9, 14, 26, 0.88)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '18px',
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
                People Operations
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setActiveSection('overview')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '12px',
                background: activeSection === 'overview' ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(139, 92, 246, 0.18) 100%)' : 'transparent',
                border: activeSection === 'overview' ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent',
                color: activeSection === 'overview' ? '#ffffff' : '#7dd3fc',
                fontSize: '13px', fontWeight: activeSection === 'overview' ? 'bold' : 'normal',
                cursor: 'pointer', textAlign: 'left'
              }}
            >
              <LayoutDashboard size={16} /> Overview
            </button>

            <button
              onClick={() => setActiveSection('attendance')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '12px',
                background: activeSection === 'attendance' ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(139, 92, 246, 0.18) 100%)' : 'transparent',
                border: activeSection === 'attendance' ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent',
                color: activeSection === 'attendance' ? '#ffffff' : '#7dd3fc',
                fontSize: '13px', fontWeight: activeSection === 'attendance' ? 'bold' : 'normal',
                cursor: 'pointer', textAlign: 'left'
              }}
            >
              <UserCheck size={16} /> Attendance Track
            </button>

            <button
              onClick={() => setActiveSection('leaves')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '12px',
                background: activeSection === 'leaves' ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(139, 92, 246, 0.18) 100%)' : 'transparent',
                border: activeSection === 'leaves' ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent',
                color: activeSection === 'leaves' ? '#ffffff' : '#7dd3fc',
                fontSize: '13px', fontWeight: activeSection === 'leaves' ? 'bold' : 'normal',
                cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Calendar size={16} /> Leave Approvals
            </button>

            <button
              onClick={() => setActiveSection('onboarding')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '12px',
                background: activeSection === 'onboarding' ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(139, 92, 246, 0.18) 100%)' : 'transparent',
                border: activeSection === 'onboarding' ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent',
                color: activeSection === 'onboarding' ? '#ffffff' : '#7dd3fc',
                fontSize: '13px', fontWeight: activeSection === 'onboarding' ? 'bold' : 'normal',
                cursor: 'pointer', textAlign: 'left'
              }}
            >
              <UserPlus size={16} /> Onboarding
            </button>

            <div>
              <button
                onClick={() => setPolicyOpen(!policyOpen)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: '12px',
                  background: activeSection.startsWith('policy') ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                  border: activeSection.startsWith('policy') ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                  color: activeSection.startsWith('policy') ? '#ffffff' : '#7dd3fc',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileCheck size={16} /> Policy Records
                </span>
                {policyOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {policyOpen && (
                <div style={{
                  marginTop: '4px',
                  marginLeft: '14px',
                  paddingLeft: '10px',
                  borderLeft: '1.5px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {policySubItems.map((sub) => {
                    const Icon = sub.icon;
                    const isSubActive = activeSection === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSection(sub.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '7px 10px', borderRadius: '8px',
                          background: isSubActive ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          border: 'none',
                          color: isSubActive ? '#ffffff' : '#94a3b8',
                          fontSize: '12px',
                          fontWeight: isSubActive ? 'bold' : 'normal',
                          cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        <Icon size={13} color="#34d399" /> {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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
              👥 HR Desk
            </p>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
              {orgData?.settings?.companyName || 'Hasan Enterprises'}
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
              HR Dashboard, {hrName}
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Employee records, attendance rates, and leave approvals.
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
                HR
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{hrName}</span>
              <ChevronDown size={14} color="#38bdf8" />
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#38bdf8' }} />
              <input 
                type="text" 
                placeholder="Search Staff..." 
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

        {activeSection === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div style={cardStyle}>
                <div style={{ fontSize: '11px', color: '#7dd3fc' }}>Active Departments</div>
                <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>{orgData?.departments?.length || 0}</div>
                <div style={{ fontSize: '11px', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={12} /> {orgData?.designations?.length || 0} designations active
                </div>
              </div>

              <div style={cardStyle}>
                <div style={{ fontSize: '11px', color: '#7dd3fc' }}>Registered Users</div>
                <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>{orgData?.users?.length || 0}</div>
                <div style={{ fontSize: '11px', color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock3 size={12} /> Active portal accounts
                </div>
              </div>

              <div style={cardStyle}>
                <div style={{ fontSize: '11px', color: '#7dd3fc' }}>Shift & Grace Policy</div>
                <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>{orgData?.settings?.officeStart || '09:00'}</div>
                <div style={{ fontSize: '11px', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> {orgData?.settings?.graceMinutes || 15} mins grace allowed
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={cardStyle}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>Quick Actions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => setActiveSection('onboarding')}
                    style={{
                      padding: '10px 12px',
                      background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
                      color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: '700',
                      cursor: 'pointer', textAlign: 'left', boxShadow: '0 4px 18px rgba(6, 182, 212, 0.35)'
                    }}
                  >
                    + Register New Staff
                  </button>
                  <button
                    onClick={() => setActiveSection('policy-rules')}
                    style={{
                      padding: '10px 12px', background: '#040812', color: '#e2e8f0',
                      border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', fontSize: '12px',
                      cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    📋 View Company Rules & Holidays
                  </button>
                  <button
                    onClick={() => setActiveSection('attendance')}
                    style={{
                      padding: '10px 12px', background: '#040812', color: '#e2e8f0',
                      border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', fontSize: '12px',
                      cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    🕒 Attendance & Geofence Overview
                  </button>
                </div>
              </div>

              <div style={cardStyle}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', color: '#e2e8f0' }}>Upcoming Public Holidays</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(orgData?.holidays || []).length === 0 && (
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>No upcoming holidays listed.</p>
                  )}
                  {(orgData?.holidays || []).map((h) => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#040812', borderRadius: '8px', fontSize: '12px' }}>
                      <b>{h.title}</b>
                      <span style={{ color: '#7dd3fc' }}>{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'attendance' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Daily Attendance & Shift Rules</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc' }}>Office Start & Grace</div>
                <b style={{ fontSize: '15px' }}>{orgData?.settings?.officeStart || '09:00'} (+{orgData?.settings?.graceMinutes || 15}m)</b>
              </div>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc' }}>Half-Day Minimum</div>
                <b style={{ fontSize: '15px' }}>{orgData?.settings?.halfDayHours || 5} Hours</b>
              </div>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc' }}>Office GPS Geofence</div>
                <b style={{ fontSize: '14px' }}>{orgData?.settings?.radiusMeters || 150}m radius</b>
              </div>
            </div>
            <div style={{ padding: '14px', background: '#040812', borderRadius: '10px', fontSize: '12px', color: '#94a3b8' }}>
              No attendance punches recorded for today.
            </div>
          </div>
        )}

        {activeSection === 'leaves' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Leave Requests & Yearly Quotas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {(orgData?.leaveTypes || []).length === 0 && (
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>No leave categories configured yet.</p>
              )}
              {(orgData?.leaveTypes || []).map((lt) => (
                <div key={lt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#040812', borderRadius: '10px', fontSize: '13px' }}>
                  <span>{lt.name}</span>
                  <b style={{ color: '#6ee7b7' }}>{lt.quota > 0 ? `${lt.quota} Days / Year` : 'Unlimited'}</b>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px', background: '#040812', borderRadius: '10px', fontSize: '12px', color: '#94a3b8' }}>
              No pending leave requests in queue.
            </div>
          </div>
        )}

        {activeSection === 'onboarding' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Staff Directory & Active Accounts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(orgData?.users || []).length === 0 && (
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>No staff accounts registered yet.</p>
              )}
              {(orgData?.users || []).map((u) => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#040812', borderRadius: '8px', fontSize: '12px' }}>
                  <span><b>{u.name}</b> — <span style={{ color: '#38bdf8' }}>{u.email}</span></span>
                  <span style={{ color: '#6ee7b7', fontWeight: 'bold' }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'policy-rules' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#34d399" /> Office Timings & Geofence Rules
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc', fontSize: '11px' }}>Company Name</div>
                <b>{orgData?.settings?.companyName || 'Not Set'}</b>
              </div>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc', fontSize: '11px' }}>Shift & Grace Period</div>
                <b>{orgData?.settings?.officeStart} (+{orgData?.settings?.graceMinutes} mins grace)</b>
              </div>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc', fontSize: '11px' }}>Half-Day & Weekends</div>
                <b>Under {orgData?.settings?.halfDayHours} hrs | {(orgData?.settings?.weekends || []).join(', ')}</b>
              </div>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc', fontSize: '11px' }}><MapPin size={12} style={{ display: 'inline' }} /> Geofence Location</div>
                <b>{orgData?.settings?.radiusMeters}m ({orgData?.settings?.latitude}, {orgData?.settings?.longitude})</b>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'policy-depts' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Company Departments ({orgData?.departments?.length || 0})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {(orgData?.departments || []).map((d) => (
                <div key={d.id} style={{ padding: '12px', background: '#040812', borderRadius: '10px', fontSize: '13px' }}>
                  <b>{d.name}</b> <span style={{ color: '#34d399' }}>({d.code})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'policy-leaves' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Yearly Leave Quotas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {(orgData?.leaveTypes || []).map((lt) => (
                <div key={lt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#040812', borderRadius: '10px', fontSize: '13px' }}>
                  <span>{lt.name}</span>
                  <b style={{ color: '#6ee7b7' }}>{lt.quota > 0 ? `${lt.quota} Days / Year` : 'Unlimited'}</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'policy-holidays' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Public Holidays</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(orgData?.holidays || []).map((h) => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#040812', borderRadius: '10px', fontSize: '13px' }}>
                  <b>{h.title}</b>
                  <span style={{ color: '#7dd3fc' }}>{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}