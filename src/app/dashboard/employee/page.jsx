'use client';

import { useState, useEffect } from 'react';
import { 
  User, Calendar, DollarSign, FileText, 
  ChevronDown, ChevronRight, Clock, LogOut, 
  CheckCircle2, ArrowUpRight, CalendarOff, CalendarDays 
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

export default function EmployeeDashboard() {
  const [userName, setUserName] = useState('Hasan');
  const [clockedIn, setClockedIn] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [policyOpen, setPolicyOpen] = useState(false);
  const [orgData, setOrgData] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('Employee_userName') || localStorage.getItem('userName');
    if (storedName) setUserName(storedName);

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
    { id: 'policy-rules', label: 'Shift & Grace Rules', icon: Clock },
    { id: 'policy-leaves', label: 'Leave Entitlements', icon: CalendarOff },
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
                Employee Portal
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
              <User size={16} /> My Overview
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
              <Calendar size={16} /> Leaves & Holidays
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
              <Clock size={16} /> Attendance Logs
            </button>

            <button
              onClick={() => setActiveSection('salary')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '12px',
                background: activeSection === 'salary' ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(139, 92, 246, 0.18) 100%)' : 'transparent',
                border: activeSection === 'salary' ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid transparent',
                color: activeSection === 'salary' ? '#ffffff' : '#7dd3fc',
                fontSize: '13px', fontWeight: activeSection === 'salary' ? 'bold' : 'normal',
                cursor: 'pointer', textAlign: 'left'
              }}
            >
              <DollarSign size={16} /> Salary & Payslips
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
                  <FileText size={16} /> Company Policy
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
              💼 Shift Details
            </p>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
              Starts {orgData?.settings?.officeStart || '09:00'} (Grace: {orgData?.settings?.graceMinutes || 15}m)
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
              Welcome back, {userName}
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              {orgData?.settings?.companyName || 'Hasan Enterprises'} — Employee Self-Service Portal
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
                EM
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>{userName}</span>
              <ChevronDown size={14} color="#38bdf8" />
            </div>
          </div>
        </header>

        {activeSection === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div style={cardStyle}>
                <div style={{ fontSize: '11px', color: '#7dd3fc' }}>Leave Types Configured</div>
                <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>
                  {orgData?.leaveTypes?.length || 0} <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#94a3b8' }}>Categories</span>
                </div>
                <div style={{ fontSize: '11px', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Active yearly leave policy
                </div>
              </div>

              <div style={cardStyle}>
                <div style={{ fontSize: '11px', color: '#7dd3fc' }}>Official Shift Start</div>
                <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>{orgData?.settings?.officeStart || '09:00'}</div>
                <div style={{ fontSize: '11px', color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={12} /> {orgData?.settings?.graceMinutes || 15} mins grace period
                </div>
              </div>

              <div style={cardStyle}>
                <div style={{ fontSize: '11px', color: '#7dd3fc' }}>Upcoming Public Holidays</div>
                <div style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0' }}>{orgData?.holidays?.length || 0}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Weekends: {(orgData?.settings?.weekends || ['Saturday', 'Sunday']).join(', ')}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px' }}>Today&apos;s Attendance Punch</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: clockedIn ? '#6ee7b7' : '#fca5a5' }}>
                      {clockedIn ? 'Status: Clocked In' : 'Status: Clocked Out'}
                    </p>
                  </div>
                  <button
                    onClick={() => setClockedIn(!clockedIn)}
                    style={{
                      padding: '9px 16px', borderRadius: '8px', border: 'none',
                      background: clockedIn ? '#ef4444' : '#10b981',
                      color: '#ffffff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'
                    }}
                  >
                    {clockedIn ? 'Clock Out' : 'Clock In'}
                  </button>
                </div>
              </div>

              <div style={cardStyle}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Quick Links</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => setActiveSection('leaves')} style={{ padding: '8px 12px', borderRadius: '8px', background: '#040812', border: '1px solid #38bdf8', color: '#ffffff', fontSize: '12px', cursor: 'pointer' }}>
                    View Leave Quotas & Holidays
                  </button>
                  <button onClick={() => setActiveSection('policy-rules')} style={{ padding: '8px 12px', borderRadius: '8px', background: '#040812', border: '1px solid #34d399', color: '#ffffff', fontSize: '12px', cursor: 'pointer' }}>
                    Check Shift & Grace Rules
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'leaves' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>My Yearly Leave Entitlements</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(orgData?.leaveTypes || []).length === 0 && (
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>No leave quotas configured yet.</p>
                )}
                {(orgData?.leaveTypes || []).map((lt) => (
                  <div key={lt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#040812', borderRadius: '10px', fontSize: '13px' }}>
                    <span>{lt.name}</span>
                    <b style={{ color: '#6ee7b7' }}>{lt.quota > 0 ? `${lt.quota} Days / Year` : 'Unlimited (Unpaid)'}</b>
                  </div>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Official Public Holidays</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(orgData?.holidays || []).length === 0 && (
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>No public holidays scheduled yet.</p>
                )}
                {(orgData?.holidays || []).map((h) => (
                  <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#040812', borderRadius: '10px', fontSize: '13px' }}>
                    <b>{h.title}</b>
                    <span style={{ color: '#7dd3fc' }}>{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'attendance' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Attendance Rules & Daily Logs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ background: '#040812', padding: '12px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc' }}>Office Start Time</div>
                <b style={{ fontSize: '15px' }}>{orgData?.settings?.officeStart || '09:00'}</b>
              </div>
              <div style={{ background: '#040812', padding: '12px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc' }}>Late Grace Period</div>
                <b style={{ fontSize: '15px' }}>{orgData?.settings?.graceMinutes || 15} Minutes</b>
              </div>
              <div style={{ background: '#040812', padding: '12px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc' }}>Half-Day Minimum</div>
                <b style={{ fontSize: '15px' }}>{orgData?.settings?.halfDayHours || 5} Hours</b>
              </div>
            </div>
            <div style={{ padding: '14px', background: '#040812', borderRadius: '10px', fontSize: '12px', color: '#94a3b8' }}>
              No attendance history recorded yet.
            </div>
          </div>
        )}

        {activeSection === 'salary' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>My Salary & Monthly Payslips</h3>
            <div style={{ padding: '14px', background: '#040812', borderRadius: '10px', fontSize: '12px', color: '#94a3b8' }}>
              No payslips generated yet. Your monthly payslips will appear here once processed by HR.
            </div>
          </div>
        )}

        {activeSection === 'policy-rules' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Shift & Grace Rules</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc', fontSize: '11px' }}>Office Timing</div>
                <b>{orgData?.settings?.officeStart || '09:00'} (Grace: {orgData?.settings?.graceMinutes || 15} mins)</b>
              </div>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc', fontSize: '11px' }}>Half-Day Threshold</div>
                <b>Minimum {orgData?.settings?.halfDayHours || 5} Hours</b>
              </div>
              <div style={{ background: '#040812', padding: '14px', borderRadius: '10px' }}>
                <div style={{ color: '#7dd3fc', fontSize: '11px' }}>Weekly Off Days</div>
                <b>{(orgData?.settings?.weekends || ['Saturday', 'Sunday']).join(', ')}</b>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'policy-leaves' && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Company Leave Entitlements</h3>
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
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Public Holidays Calendar</h3>
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