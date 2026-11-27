'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, LayoutDashboard, UserCheck, Calendar, UserPlus,
  FileCheck, LogOut, Clock, MapPin, Layers, CalendarOff, CalendarDays,
  ChevronDown, ChevronRight
} from 'lucide-react';

export default function HRPolicyViewPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [policyOpen, setPolicyOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('rules');

  useEffect(() => {
    const loadOrg = async () => {
      try {
        const res = await fetch('/api/org');
        const json = await res.json();
        if (res.ok) setData(json);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrg();
  }, []);

  const policySubItems = [
    { id: 'rules', label: 'Office Timings & GPS', icon: Clock },
    { id: 'depts', label: 'Departments List', icon: Layers },
    { id: 'leaves', label: 'Leave Quotas', icon: CalendarOff },
    { id: 'holidays', label: 'Public Holidays', icon: CalendarDays },
  ];

  const boxStyle = {
    background: 'rgba(23, 13, 38, 0.8)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(168, 85, 247, 0.22)'
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 10%, #1e1136 0%, #0d0617 60%, #05020a 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingRight: '16px',
        borderRight: '1px solid rgba(168, 85, 247, 0.15)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '26px' }}>
            <div style={{
              width: '42px', height: '42px',
              background: 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Building2 size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800' }}>Hasan</div>
              <div style={{ fontSize: '11px', color: '#c084fc' }}>People Operations</div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <a href="/dashboard/hr" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#c084fc', textDecoration: 'none', fontSize: '13px' }}>
              <LayoutDashboard size={16} /> Overview
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#c084fc', textDecoration: 'none', fontSize: '13px' }}>
              <UserCheck size={16} /> Attendance Track
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#c084fc', textDecoration: 'none', fontSize: '13px' }}>
              <Calendar size={16} /> Leave Approvals
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#c084fc', textDecoration: 'none', fontSize: '13px' }}>
              <UserPlus size={16} /> Onboarding
            </a>

            {/* Expandable Policy Records Folder */}
            <div>
              <button
                onClick={() => setPolicyOpen(!policyOpen)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: '12px',
                  background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.3) 0%, rgba(107, 33, 168, 0.15) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#ffffff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileCheck size={16} color="#d8b4fe" /> Policy Records
                </span>
                {policyOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {policyOpen && (
                <div style={{
                  marginTop: '6px',
                  marginLeft: '14px',
                  paddingLeft: '10px',
                  borderLeft: '1.5px solid rgba(168, 85, 247, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {policySubItems.map((sub) => {
                    const Icon = sub.icon;
                    const active = activeTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveTab(sub.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 10px', borderRadius: '8px',
                          background: active ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                          border: active ? '1px solid rgba(216, 180, 254, 0.35)' : '1px solid transparent',
                          color: active ? '#ffffff' : '#c084fc',
                          fontSize: '12px', fontWeight: active ? 'bold' : 'normal',
                          cursor: 'pointer', textAlign: 'left'
                        }}
                      >
                        <Icon size={13} color={active ? '#e9d5ff' : '#a855f7'} /> {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        <button
          onClick={() => { localStorage.clear(); router.push('/'); }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5',
            cursor: 'pointer', fontWeight: 'bold', fontSize: '12px'
          }}
        >
          <LogOut size={15} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>
            Policy Records — {policySubItems.find((i) => i.id === activeTab)?.label}
          </h1>
          <p style={{ fontSize: '12px', color: '#c084fc', margin: '4px 0 0 0' }}>
            Read-only organizational policies, shift timings, quotas, and holidays configured by Admin.
          </p>
        </div>

        {loading ? (
          <div style={boxStyle}>Loading company policies...</div>
        ) : (
          <>
            {activeTab === 'rules' && (
              <div style={boxStyle}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f3e8ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="#a855f7" /> Office Timings & Geofence Rules
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px' }}>
                  <div style={{ background: '#140924', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ color: '#c084fc' }}>Company Name</div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '4px' }}>{data?.settings?.companyName || 'Not Set'}</div>
                  </div>
                  <div style={{ background: '#140924', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ color: '#c084fc' }}>Shift & Grace Period</div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '4px' }}>
                      {data?.settings?.officeStart} (+{data?.settings?.graceMinutes} mins grace)
                    </div>
                  </div>
                  <div style={{ background: '#140924', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ color: '#c084fc' }}>Half-Day & Weekly Offs</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                      Under {data?.settings?.halfDayHours} hrs | {(data?.settings?.weekends || []).join(', ')}
                    </div>
                  </div>
                  <div style={{ background: '#140924', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> Geofence Location & Radius
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                      {data?.settings?.radiusMeters}m ({data?.settings?.latitude}, {data?.settings?.longitude})
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'depts' && (
              <div style={boxStyle}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Company Departments ({data?.departments?.length || 0})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {(data?.departments || []).length === 0 && <p style={{ fontSize: '12px', color: '#c084fc' }}>No departments added by Admin yet.</p>}
                  {(data?.departments || []).map((d) => (
                    <div key={d.id} style={{ padding: '12px', background: '#140924', borderRadius: '10px', fontSize: '13px' }}>
                      <b>{d.name}</b> <span style={{ color: '#a855f7' }}>({d.code})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'leaves' && (
              <div style={boxStyle}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Yearly Leave Quotas</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {(data?.leaveTypes || []).length === 0 && <p style={{ fontSize: '12px', color: '#c084fc' }}>No leave types configured yet.</p>}
                  {(data?.leaveTypes || []).map((lt) => (
                    <div key={lt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#140924', borderRadius: '10px', fontSize: '13px' }}>
                      <span>{lt.name}</span>
                      <b style={{ color: '#86efac' }}>{lt.quota > 0 ? `${lt.quota} Days/Yr` : 'Unlimited'}</b>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'holidays' && (
              <div style={boxStyle}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Public Holidays</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(data?.holidays || []).length === 0 && <p style={{ fontSize: '12px', color: '#c084fc' }}>No public holidays added yet.</p>}
                  {(data?.holidays || []).map((h) => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#140924', borderRadius: '10px', fontSize: '13px' }}>
                      <b>{h.title}</b>
                      <span style={{ color: '#c084fc' }}>{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}