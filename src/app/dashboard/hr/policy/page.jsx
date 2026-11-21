'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, LayoutDashboard, UserCheck, Calendar, UserPlus,
  FileCheck, LogOut, Clock, MapPin, Layers, CalendarOff, CalendarDays
} from 'lucide-react';

export default function HRPolicyViewPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const boxStyle = {
    background: 'rgba(23, 13, 38, 0.8)',
    borderRadius: '16px',
    padding: '18px',
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
        width: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingRight: '16px',
        borderRight: '1px solid rgba(168, 85, 247, 0.15)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
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

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            <a href="/dashboard/hr/policy" style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
              borderRadius: '12px', background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.3) 0%, rgba(107, 33, 168, 0.15) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold'
            }}>
              <FileCheck size={16} color="#d8b4fe" /> Policy Records
            </a>
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
            Company Policies & Setup (View Only)
          </h1>
          <p style={{ fontSize: '12px', color: '#c084fc', margin: '4px 0 0 0' }}>
            Admin-configured attendance rules, departments, leave quotas, and public holidays.
          </p>
        </div>

        {loading ? (
          <div style={boxStyle}>Loading company policies...</div>
        ) : (
          <>
            {/* Office Rules & Location */}
            <div style={boxStyle}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f3e8ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#a855f7" /> Office Timings & Geofence Rules
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px' }}>
                <div style={{ background: '#140924', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ color: '#c084fc' }}>Company</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>{data?.settings?.companyName || 'Not Set'}</div>
                </div>
                <div style={{ background: '#140924', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ color: '#c084fc' }}>Shift & Grace</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                    {data?.settings?.officeStart} (+{data?.settings?.graceMinutes}m grace)
                  </div>
                </div>
                <div style={{ background: '#140924', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ color: '#c084fc' }}>Half-Day & Weekends</div>
                  <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '4px' }}>
                    Under {data?.settings?.halfDayHours}h | {(data?.settings?.weekends || []).join(', ')}
                  </div>
                </div>
                <div style={{ background: '#140924', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> Geofence Radius
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                    {data?.settings?.radiusMeters}m ({data?.settings?.latitude}, {data?.settings?.longitude})
                  </div>
                </div>
              </div>
            </div>

            {/* Departments, Leave Quotas, Holidays */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {/* Departments */}
              <div style={boxStyle}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={15} color="#a855f7" /> Departments ({data?.departments?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(data?.departments || []).length === 0 && <p style={{ fontSize: '12px', color: '#c084fc' }}>No departments added by Admin yet.</p>}
                  {(data?.departments || []).map((d) => (
                    <div key={d.id} style={{ padding: '10px', background: '#140924', borderRadius: '8px', fontSize: '12px' }}>
                      <b>{d.name}</b> <span style={{ color: '#a855f7' }}>({d.code})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave Quotas */}
              <div style={boxStyle}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarOff size={15} color="#a855f7" /> Leave Quotas
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(data?.leaveTypes || []).length === 0 && <p style={{ fontSize: '12px', color: '#c084fc' }}>No leave types configured yet.</p>}
                  {(data?.leaveTypes || []).map((lt) => (
                    <div key={lt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#140924', borderRadius: '8px', fontSize: '12px' }}>
                      <span>{lt.name}</span>
                      <b style={{ color: '#86efac' }}>{lt.quota > 0 ? `${lt.quota} Days/Yr` : 'Unlimited'}</b>
                    </div>
                  ))}
                </div>
              </div>

              {/* Public Holidays */}
              <div style={boxStyle}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarDays size={15} color="#a855f7" /> Public Holidays
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(data?.holidays || []).length === 0 && <p style={{ fontSize: '12px', color: '#c084fc' }}>No public holidays added yet.</p>}
                  {(data?.holidays || []).map((h) => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#140924', borderRadius: '8px', fontSize: '12px' }}>
                      <span>{h.title}</span>
                      <span style={{ color: '#c084fc' }}>{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}