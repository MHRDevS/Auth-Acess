'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Settings, Layers, Shield, CalendarOff,
  CalendarDays, UserCog, LogOut, Save, Plus, Trash2, MapPin,
  CheckCircle2, AlertCircle, KeyRound, Power, ChevronDown, ChevronRight
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

export default function OrganizationSetupPage() {
  const router = useRouter();
  const [tab, setTab] = useState('company');
  const [menuOpen, setMenuOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  const [companyName, setCompanyName] = useState('Hasan Enterprises');
  const [industry, setIndustry] = useState('Software & IT');
  const [officeStart, setOfficeStart] = useState('09:00');
  const [graceMinutes, setGraceMinutes] = useState(15);
  const [halfDayHours, setHalfDayHours] = useState(5);
  const [weekends, setWeekends] = useState(['Saturday', 'Sunday']);
  const [latitude, setLatitude] = useState('24.8607');
  const [longitude, setLongitude] = useState('67.0011');
  const [radiusMeters, setRadiusMeters] = useState(150);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [users, setUsers] = useState([]);

  const [deptName, setDeptName] = useState('');
  const [desigTitle, setDesigTitle] = useState('');
  const [desigDept, setDesigDept] = useState('');
  const [roleName, setRoleName] = useState('');
  const [accessLevel, setAccessLevel] = useState('HR');
  const [permissions, setPermissions] = useState('Manage Employees, Attendance & Leave Approvals');
  const [leaveName, setLeaveName] = useState('');
  const [leaveQuota, setLeaveQuota] = useState(14);
  const [holidayTitle, setHolidayTitle] = useState('');
  const [holidayDate, setHolidayDate] = useState('');

  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPass, setUPass] = useState('123456');
  const [uRole, setURole] = useState('HR');

  const showMessage = (text, type = 'success') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 3000);
  };

  const loadData = async () => {
    try {
      const res = await fetch('/api/org');
      const data = await res.json();

      if (res.ok) {
        if (data.settings) {
          setCompanyName(data.settings.companyName || 'Hasan Enterprises');
          setIndustry(data.settings.industry || 'Software & IT');
          setOfficeStart(data.settings.officeStart || '09:00');
          setGraceMinutes(data.settings.graceMinutes || 15);
          setHalfDayHours(data.settings.halfDayHours || 5);
          setWeekends(data.settings.weekends || ['Saturday', 'Sunday']);
          setLatitude(data.settings.latitude || '24.8607');
          setLongitude(data.settings.longitude || '67.0011');
          setRadiusMeters(data.settings.radiusMeters || 150);
        }
        setDepartments(data.departments || []);
        setDesignations(data.designations || []);
        setEmployeeRoles(data.employeeRoles || []);
        setLeaveTypes(data.leaveTypes || []);
        setHolidays(data.holidays || []);
        setUsers(data.users || []);
      }
    } catch (err) {
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveSettings = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SAVE_SETTINGS',
        payload: {
          companyName,
          industry,
          officeStart,
          graceMinutes: Number(graceMinutes),
          halfDayHours: Number(halfDayHours),
          weekends,
          latitude,
          longitude,
          radiusMeters: Number(radiusMeters)
        }
      })
    });
    const data = await res.json();
    showMessage(data.message, res.ok ? 'success' : 'error');
  };

  const handleWeekendClick = (day) => {
    if (weekends.includes(day)) {
      setWeekends(weekends.filter((d) => d !== day));
    } else {
      setWeekends([...weekends, day]);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      showMessage('Browser does not support GPS', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        showMessage('Office GPS coordinates captured!', 'success');
      },
      () => showMessage('Location permission denied', 'error')
    );
  };

  const postAction = async (action, payload, clearFn) => {
    const res = await fetch('/api/org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    const data = await res.json();
    if (res.ok) {
      if (clearFn) clearFn();
      showMessage(data.message, 'success');
      loadData();
    } else {
      showMessage(data.message, 'error');
    }
  };

  const deleteItem = async (collectionName, id) => {
    const res = await fetch(`/api/org?collection=${collectionName}&id=${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      showMessage('Item removed');
      loadData();
    }
  };

  const updateUser = async (id, type, extra = {}) => {
    const res = await fetch('/api/org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_USER',
        payload: { id, type, ...extra }
      })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(data.message);
      loadData();
    }
  };

  const subMenuItems = [
    { id: 'company', label: 'Company & Rules', icon: Settings },
    { id: 'departments', label: 'Depts & Designations', icon: Layers },
    { id: 'roles', label: 'Roles & Access', icon: Shield },
    { id: 'leaves', label: 'Leave Quotas', icon: CalendarOff },
    { id: 'holidays', label: 'Public Holidays', icon: CalendarDays },
    { id: 'users', label: 'User Accounts', icon: UserCog },
  ];

  const boxStyle = {
    background: 'rgba(9, 14, 26, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(56, 189, 248, 0.25)'
  };

  const fieldStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#040812',
    border: '1px solid rgba(56, 189, 248, 0.28)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const auroraBtn = {
    padding: '10px 16px',
    background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 16px rgba(6, 182, 212, 0.35)'
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
              <div style={{ fontSize: '15px', fontWeight: 'bold' }}>Hasan</div>
              <div style={{
                fontSize: '11px', fontWeight: '700',
                background: 'linear-gradient(90deg, #34d399, #38bdf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Organization Setup
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => router.push('/dashboard/admin')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '10px', background: 'transparent', border: 'none',
                color: '#7dd3fc', fontSize: '13px', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <LayoutDashboard size={16} /> Overview
            </button>

            <div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: '12px',
                  background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.25) 0%, rgba(139, 92, 246, 0.18) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  color: '#ffffff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Settings size={16} color="#5eead4" /> Organization Setup
                </span>
                {menuOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {menuOpen && (
                <div style={{
                  marginTop: '6px',
                  marginLeft: '14px',
                  paddingLeft: '10px',
                  borderLeft: '1.5px solid rgba(56, 189, 248, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {subMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = tab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 12px', borderRadius: '8px',
                          background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          border: isSelected ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid transparent',
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          fontSize: '12px',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <Icon size={14} color={isSelected ? '#34d399' : '#38bdf8'} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/signup';
          }}
          className="logout-btn"
        >
          <LogOut size={15} className="logout-icon" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '24px', fontWeight: 'bold', margin: 0,
            background: 'linear-gradient(90deg, #ffffff 0%, #6ee7b7 60%, #c4b5fd 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Organization Setup — {subMenuItems.find((i) => i.id === tab)?.label}
          </h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Configure company details, timings, locations, departments, roles, leave quotas, holidays & user accounts.
          </p>
        </div>

        {msg && (
          <div style={{
            padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: msgType === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
            border: `1px solid ${msgType === 'error' ? '#ef4444' : '#10b981'}`,
            color: msgType === 'error' ? '#fca5a5' : '#6ee7b7'
          }}>
            {msgType === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{msg}</span>
          </div>
        )}

        {loading ? (
          <div style={boxStyle}>Loading organization data...</div>
        ) : (
          <>
            {tab === 'company' && (
              <form onSubmit={saveSettings} style={boxStyle}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px' }}>Company Details, Office Timings & Attendance Rules</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#7dd3fc', marginBottom: '5px' }}>Company Name *</label>
                    <input type="text" style={fieldStyle} value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#7dd3fc', marginBottom: '5px' }}>Industry / Sector</label>
                    <input type="text" style={fieldStyle} value={industry} onChange={(e) => setIndustry(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#7dd3fc', marginBottom: '5px' }}>Office Start Time</label>
                    <input type="time" style={fieldStyle} value={officeStart} onChange={(e) => setOfficeStart(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#7dd3fc', marginBottom: '5px' }}>Grace Period (Minutes)</label>
                    <input type="number" style={fieldStyle} value={graceMinutes} onChange={(e) => setGraceMinutes(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#7dd3fc', marginBottom: '5px' }}>Half-Day Minimum Hours</label>
                    <input type="number" style={fieldStyle} value={halfDayHours} onChange={(e) => setHalfDayHours(e.target.value)} />
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#7dd3fc', marginBottom: '6px' }}>Weekend / Weekly Off Days</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleWeekendClick(day)}
                        style={{
                          padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
                          background: weekends.includes(day) ? 'linear-gradient(135deg, #10b981, #06b6d4)' : '#040812',
                          border: '1px solid rgba(56, 189, 248, 0.3)', color: '#ffffff'
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '18px', padding: '14px', background: '#040812', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={15} color="#34d399" /> Attendance Location & Radius
                    </span>
                    <button type="button" onClick={getLocation} style={{
                      padding: '5px 10px', background: 'rgba(16, 185, 129, 0.16)', border: '1px solid #34d399',
                      borderRadius: '8px', color: '#6ee7b7', fontSize: '11px', cursor: 'pointer'
                    }}>
                      📍 Capture Current GPS
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#7dd3fc' }}>Latitude</label>
                      <input type="text" style={fieldStyle} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#7dd3fc' }}>Longitude</label>
                      <input type="text" style={fieldStyle} value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#7dd3fc' }}>Allowed Radius (Meters)</label>
                      <input type="number" style={fieldStyle} value={radiusMeters} onChange={(e) => setRadiusMeters(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '18px' }}>
                  <button type="submit" style={auroraBtn}>
                    <Save size={15} /> Save Company Settings
                  </button>
                </div>
              </form>
            )}

            {tab === 'departments' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Departments</h3>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <input type="text" style={fieldStyle} placeholder="e.g. Engineering, HR, Sales" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
                    <button onClick={() => deptName.trim() && postAction('ADD_DEPARTMENT', { name: deptName }, () => setDeptName(''))} style={auroraBtn}>
                      <Plus size={15} /> Add
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {departments.map((d) => (
                      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#040812', borderRadius: '8px' }}>
                        <span style={{ fontSize: '13px' }}>{d.name} <small style={{ color: '#34d399' }}>({d.code})</small></span>
                        <button onClick={() => deleteItem('departments', d.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Designations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    <input type="text" style={fieldStyle} placeholder="e.g. Senior Developer, HR Officer" value={desigTitle} onChange={(e) => setDesigTitle(e.target.value)} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select style={fieldStyle} value={desigDept} onChange={(e) => setDesigDept(e.target.value)}>
                        <option value="">Select Department</option>
                        {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                      <button onClick={() => desigTitle.trim() && postAction('ADD_DESIGNATION', { title: desigTitle, department: desigDept }, () => setDesigTitle(''))} style={auroraBtn}>
                        <Plus size={15} /> Add
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {designations.map((des) => (
                      <div key={des.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#040812', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{des.title}</div>
                          <div style={{ fontSize: '10px', color: '#7dd3fc' }}>{des.department}</div>
                        </div>
                        <button onClick={() => deleteItem('designations', des.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'roles' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '16px' }}>
                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Define Role & Access Level</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#7dd3fc' }}>Custom Role Name</label>
                      <input type="text" style={fieldStyle} placeholder="e.g. Department Head, Payroll Officer" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#7dd3fc' }}>System Access Tier</label>
                      <select style={fieldStyle} value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
                        <option value="Admin">Admin (Company-wide Full Control)</option>
                        <option value="HR">HR (People Operations & Approvals)</option>
                        <option value="Employee">Employee (Self-Service Only)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#7dd3fc' }}>Allowed Permissions</label>
                      <input type="text" style={fieldStyle} value={permissions} onChange={(e) => setPermissions(e.target.value)} />
                    </div>
                    <button
                      onClick={() => roleName.trim() && postAction('ADD_ROLE', { roleName, accessLevel, permissions }, () => setRoleName(''))}
                      style={auroraBtn}
                    >
                      <Plus size={15} /> Save Role Definition
                    </button>
                  </div>
                </div>

                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>System Access Hierarchy & Custom Roles</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ padding: '10px', background: '#040812', borderRadius: '8px', borderLeft: '3px solid #8b5cf6', fontSize: '12px' }}>
                      <b>Admin Access:</b> Full organization setup, rules, payroll lock, audit logs & user management.
                    </div>
                    <div style={{ padding: '10px', background: '#040812', borderRadius: '8px', borderLeft: '3px solid #38bdf8', fontSize: '12px' }}>
                      <b>HR Access:</b> Employee onboarding, salary setup, attendance & leave approvals, payroll draft.
                    </div>
                    <div style={{ padding: '10px', background: '#040812', borderRadius: '8px', borderLeft: '3px solid #10b981', fontSize: '12px' }}>
                      <b>Employee Access:</b> Self check-in/out, leave requests, own payslips & policy view.
                    </div>
                  </div>

                  {employeeRoles.map((r) => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#040812', borderRadius: '8px', marginTop: '6px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                          {r.roleName} <span style={{ fontSize: '10px', color: '#6ee7b7', background: 'rgba(16,185,129,0.2)', padding: '2px 6px', borderRadius: '4px' }}>{r.accessLevel}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{r.permissions}</div>
                      </div>
                      <button onClick={() => deleteItem('employee_roles', r.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'leaves' && (
              <div style={boxStyle}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Leave Types & Yearly Quotas</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', maxWidth: '500px' }}>
                  <input type="text" style={fieldStyle} placeholder="e.g. Annual Leave, Sick Leave, Casual" value={leaveName} onChange={(e) => setLeaveName(e.target.value)} />
                  <input type="number" style={{ ...fieldStyle, width: '110px' }} value={leaveQuota} onChange={(e) => setLeaveQuota(e.target.value)} />
                  <button onClick={() => leaveName.trim() && postAction('ADD_LEAVE_TYPE', { name: leaveName, quota: leaveQuota }, () => setLeaveName(''))} style={auroraBtn}>
                    <Plus size={15} /> Add
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {leaveTypes.map((lt) => (
                    <div key={lt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#040812', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{lt.name}</div>
                        <div style={{ fontSize: '11px', color: '#6ee7b7' }}>
                          {lt.quota > 0 ? `${lt.quota} Days / Year` : 'Unlimited (Unpaid)'}
                        </div>
                      </div>
                      <button onClick={() => deleteItem('leave_types', lt.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'holidays' && (
              <div style={boxStyle}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Public Holidays</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', maxWidth: '500px' }}>
                  <input type="text" style={fieldStyle} placeholder="Holiday Name (e.g. Independence Day)" value={holidayTitle} onChange={(e) => setHolidayTitle(e.target.value)} />
                  <input type="date" style={{ ...fieldStyle, width: '170px' }} value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} />
                  <button onClick={() => holidayTitle.trim() && holidayDate && postAction('ADD_HOLIDAY', { title: holidayTitle, date: holidayDate }, () => { setHolidayTitle(''); setHolidayDate(''); })} style={auroraBtn}>
                    <Plus size={15} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {holidays.map((h) => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#040812', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13px' }}><b>{h.title}</b> — <span style={{ color: '#7dd3fc' }}>{h.date}</span></span>
                      <button onClick={() => deleteItem('holidays', h.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'users' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '16px' }}>
                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Create User Account</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" style={fieldStyle} placeholder="Username" value={uName} onChange={(e) => setUName(e.target.value)} />
                    <input type="email" style={fieldStyle} placeholder="Work Email" value={uEmail} onChange={(e) => setUEmail(e.target.value)} />
                    <input type="text" style={fieldStyle} placeholder="Temporary Password" value={uPass} onChange={(e) => setUPass(e.target.value)} />
                    <select style={fieldStyle} value={uRole} onChange={(e) => setURole(e.target.value)}>
                      <option value="HR">HR</option>
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button
                      onClick={() => uName.trim() && uEmail.trim() && postAction('CREATE_USER', { name: uName, email: uEmail, password: uPass, role: uRole }, () => { setUName(''); setUEmail(''); })}
                      style={auroraBtn}
                    >
                      <Plus size={15} /> Create Account
                    </button>
                  </div>
                </div>

                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Manage User Accounts ({users.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {users.map((u) => (
                      <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#040812', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{u.name}</div>
                          <div style={{ fontSize: '11px', color: '#38bdf8' }}>{u.email}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <select
                            value={u.role}
                            onChange={(e) => updateUser(u.id, 'CHANGE_ROLE', { role: e.target.value })}
                            style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid #38bdf8', borderRadius: '6px', padding: '4px 6px', fontSize: '11px' }}
                          >
                            <option value="Admin">Admin</option>
                            <option value="HR">HR</option>
                            <option value="Employee">Employee</option>
                          </select>

                          <button onClick={() => updateUser(u.id, 'RESET_PASSWORD')} style={{
                            padding: '5px 8px', borderRadius: '6px', border: '1px solid #38bdf8',
                            background: 'transparent', color: '#7dd3fc', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                            <KeyRound size={12} /> Reset
                          </button>

                          <button onClick={() => updateUser(u.id, 'TOGGLE_ACTIVE', { active: !u.active })} style={{
                            padding: '5px 8px', borderRadius: '6px', border: 'none',
                            background: u.active ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                            color: u.active ? '#6ee7b7' : '#fca5a5', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                            <Power size={12} /> {u.active ? 'Active' : 'Blocked'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}