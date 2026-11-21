'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, User, Calendar, DollarSign, FileText,
  Clock, LogOut, CalendarDays, CalendarOff
} from 'lucide-react';

export default function EmployeePolicyPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicy = async () => {
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
    loadPolicy();
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
              <div style={{ fontSize: '11px', color: '#c084fc' }}>Employee Portal</div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/dashboard/employee" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#c084fc', textDecoration: 'none', fontSize: '13px' }}>
              <User size={16} /> My Overview
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#c084fc', textDecoration: 'none', fontSize: '13px' }}>
              <Calendar size={16} /> Leaves & Holidays
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#c084fc', textDecoration: 'none', fontSize: '13px' }}>
              <Clock size={16} /> Attendance Logs
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', color: '#c084fc', textDecoration: 'none', fontSize: '13px' }}>
              <DollarSign size={16} /> Salary & Payslips
            </a>
            <a href="/dashboard/employee/policy" style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
              borderRadius: '12px', background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.3) 0%, rgba(107, 33, 168, 0.15) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold'
            }}>
              <FileText size={16} color="#d8b4fe" /> Company Policy
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
            Company Policy & Holiday Calendar
          </h1>
          <p style={{ fontSize: '12px', color: '#c084fc', margin: '4px 0 0 0' }}>
            Official shift timings, attendance rules, leave quotas, and upcoming public holidays.
          </p>
        </div>

        {loading ? (
          <div style={boxStyle}>Loading policy details...</div>
        ) : (
          <>
            <div style={boxStyle}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#f3e8ff' }}>Attendance & Shift Guidelines</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px' }}>
                <div style={{ background: '#140924', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ color: '#c084fc' }}>Office Start & Grace Time</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                    {data?.settings?.officeStart} (Grace: {data?.settings?.graceMinutes} mins)
                  </div>
                </div>
                <div style={{ background: '#140924', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ color: '#c084fc' }}>Half-Day Rule</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                    Marked if worked under {data?.settings?.halfDayHours} hours
                  </div>
                </div>
                <div style={{ background: '#140924', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ color: '#c084fc' }}>Weekly Off Days</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                    {(data?.settings?.weekends || []).join(', ')}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={boxStyle}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarOff size={15} color="#a855f7" /> Annual Leave Entitlements
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(data?.leaveTypes || []).length === 0 && <p style={{ fontSize: '12px', color: '#c084fc' }}>No leave types defined yet.</p>}
                  {(data?.leaveTypes || []).map((lt) => (
                    <div key={lt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#140924', borderRadius: '8px', fontSize: '12px' }}>
                      <span>{lt.name}</span>
                      <b style={{ color: '#86efac' }}>{lt.quota > 0 ? `${lt.quota} Days / Year` : 'Unlimited (Unpaid)'}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div style={boxStyle}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarDays size={15} color="#a855f7" /> Public Holidays
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(data?.holidays || []).length === 0 && <p style={{ fontSize: '12px', color: '#c084fc' }}>No public holidays announced yet.</p>}
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