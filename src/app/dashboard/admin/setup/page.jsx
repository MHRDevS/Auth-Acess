'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, LayoutDashboard, Settings, Layers, Shield, CalendarOff,
  CalendarDays, UserCog, LogOut, Save, Plus, Trash2, MapPin,
  CheckCircle2, AlertCircle, KeyRound, Power
} from 'lucide-react';

export default function OrganizationSetupPage() {
  const router = useRouter();
  const [tab, setTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  // Company details & attendance rules
  const [companyName, setCompanyName] = useState('Hasan Enterprises');
  const [industry, setIndustry] = useState('Software & IT');
  const [officeStart, setOfficeStart] = useState('09:00');
  const [graceMinutes, setGraceMinutes] = useState(15);
  const [halfDayHours, setHalfDayHours] = useState(5);
  const [weekends, setWeekends] = useState(['Saturday', 'Sunday']);
  const [latitude, setLatitude] = useState('24.8607');
  const [longitude, setLongitude] = useState('67.0011');
  const [radiusMeters, setRadiusMeters] = useState(150);

  // Lists
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [users, setUsers] = useState([]);

  // Inputs
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

  // User account inputs
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
      showMessage('Browser GPS support nahi karta', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        showMessage('Office GPS location capture ho gayi!', 'success');
      },
      () => showMessage('Location permission deny ho gayi', 'error')
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
      showMessage('Item delete ho gaya');
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

  const boxStyle = {
    background: 'rgba(23, 13, 38, 0.85)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(168, 85, 247, 0.25)'
  };

  const fieldStyle = {
    width: '100%',
    padding: '10px 12px',
    background: '#140924',
    border: '1px solid #3b1d60',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const purpleBtn = {
    padding: '10px 16px',
    background: 'linear-gradient(90deg, #9333ea 0%, #6b21a8 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
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
              <div style={{ fontSize: '15px', fontWeight: 'bold' }}>Hasan</div>
              <div style={{ fontSize: '11px', color: '#c084fc' }}>Organization Setup</div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => router.push('/dashboard/admin')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '10px', background: 'transparent', border: 'none',
                color: '#c084fc', fontSize: '13px', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <LayoutDashboard size={16} /> Admin Dashboard
            </button>

            <button
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                borderRadius: '10px', background: 'rgba(147, 51, 234, 0.25)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#ffffff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <Settings size={16} color="#d8b4fe" /> Organization Setup
            </button>
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            router.push('/');
          }}
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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Organization Foundation & Setup
          </h1>
          <p style={{ fontSize: '12px', color: '#c084fc', margin: '4px 0 0 0' }}>
            Configure company details, timings, locations, departments, designations, roles, leave quotas, holidays & user accounts.
          </p>
        </div>

        {msg && (
          <div style={{
            padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: msgType === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
            border: `1px solid ${msgType === 'error' ? '#ef4444' : '#22c55e'}`,
            color: msgType === 'error' ? '#fca5a5' : '#86efac'
          }}>
            {msgType === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{msg}</span>
          </div>
        )}

        {/* 6 Navigation Tabs covering every setup requirement */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'company', label: '1. Company & Rules', icon: Settings },
            { id: 'departments', label: '2. Depts & Designations', icon: Layers },
            { id: 'roles', label: '3. Roles & Access', icon: Shield },
            { id: 'leaves', label: '4. Leave Quotas', icon: CalendarOff },
            { id: 'holidays', label: '5. Public Holidays', icon: CalendarDays },
            { id: 'users', label: '6. User Accounts', icon: UserCog },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{
                  padding: '9px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer',
                  background: tab === item.id ? '#7e22ce' : '#170d26',
                  border: '1px solid rgba(168, 85, 247, 0.35)', color: '#ffffff',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Icon size={14} /> {item.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={boxStyle}>Loading organization data...</div>
        ) : (
          <>
            {/* TAB 1: COMPANY DETAILS, TIMINGS, GRACE PERIOD, WEEKENDS & LOCATION */}
            {tab === 'company' && (
              <form onSubmit={saveSettings} style={boxStyle}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px' }}>Company Details, Office Timings & Attendance Rules</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#c084fc', marginBottom: '5px' }}>Company Name *</label>
                    <input type="text" style={fieldStyle} value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#c084fc', marginBottom: '5px' }}>Industry / Sector</label>
                    <input type="text" style={fieldStyle} value={industry} onChange={(e) => setIndustry(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#c084fc', marginBottom: '5px' }}>Office Start Time</label>
                    <input type="time" style={fieldStyle} value={officeStart} onChange={(e) => setOfficeStart(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#c084fc', marginBottom: '5px' }}>Grace Period (Minutes)</label>
                    <input type="number" style={fieldStyle} value={graceMinutes} onChange={(e) => setGraceMinutes(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#c084fc', marginBottom: '5px' }}>Half-Day Minimum Hours</label>
                    <input type="number" style={fieldStyle} value={halfDayHours} onChange={(e) => setHalfDayHours(e.target.value)} />
                  </div>
                </div>

                {/* Weekends */}
                <div style={{ marginTop: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#c084fc', marginBottom: '6px' }}>Weekend / Weekly Off Days</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleWeekendClick(day)}
                        style={{
                          padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer',
                          background: weekends.includes(day) ? '#7e22ce' : '#140924',
                          border: '1px solid #3b1d60', color: '#ffffff'
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attendance Geofence Location */}
                <div style={{ marginTop: '18px', padding: '14px', background: '#140924', borderRadius: '12px', border: '1px solid #3b1d60' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={15} color="#a855f7" /> Attendance Location & Radius
                    </span>
                    <button type="button" onClick={getLocation} style={{
                      padding: '5px 10px', background: '#2e1065', border: '1px solid #a855f7',
                      borderRadius: '8px', color: '#e9d5ff', fontSize: '11px', cursor: 'pointer'
                    }}>
                      📍 Capture Current GPS
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#c084fc' }}>Latitude</label>
                      <input type="text" style={fieldStyle} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#c084fc' }}>Longitude</label>
                      <input type="text" style={fieldStyle} value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#c084fc' }}>Allowed Radius (Meters)</label>
                      <input type="number" style={fieldStyle} value={radiusMeters} onChange={(e) => setRadiusMeters(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '18px' }}>
                  <button type="submit" style={purpleBtn}>
                    <Save size={15} /> Save Company Settings
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: DEPARTMENTS & DESIGNATIONS */}
            {tab === 'departments' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Departments</h3>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <input type="text" style={fieldStyle} placeholder="e.g. Engineering, HR, Sales" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
                    <button onClick={() => deptName.trim() && postAction('ADD_DEPARTMENT', { name: deptName }, () => setDeptName(''))} style={purpleBtn}>
                      <Plus size={15} /> Add
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {departments.map((d) => (
                      <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#140924', borderRadius: '8px' }}>
                        <span style={{ fontSize: '13px' }}>{d.name} <small style={{ color: '#a855f7' }}>({d.code})</small></span>
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
                      <button onClick={() => desigTitle.trim() && postAction('ADD_DESIGNATION', { title: desigTitle, department: desigDept }, () => setDesigTitle(''))} style={purpleBtn}>
                        <Plus size={15} /> Add
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {designations.map((des) => (
                      <div key={des.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#140924', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{des.title}</div>
                          <div style={{ fontSize: '10px', color: '#c084fc' }}>{des.department}</div>
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

            {/* TAB 3: EMPLOYEE ROLES & ACCESS LEVELS */}
            {tab === 'roles' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '16px' }}>
                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Define Role & Access Level</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#c084fc' }}>Custom Role Name</label>
                      <input type="text" style={fieldStyle} placeholder="e.g. Department Head, Payroll Officer" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#c084fc' }}>System Access Tier</label>
                      <select style={fieldStyle} value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
                        <option value="Admin">Admin (Company-wide Full Control)</option>
                        <option value="HR">HR (People Operations & Approvals)</option>
                        <option value="Employee">Employee (Self-Service Only)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#c084fc' }}>Allowed Permissions</label>
                      <input type="text" style={fieldStyle} value={permissions} onChange={(e) => setPermissions(e.target.value)} />
                    </div>
                    <button
                      onClick={() => roleName.trim() && postAction('ADD_ROLE', { roleName, accessLevel, permissions }, () => setRoleName(''))}
                      style={purpleBtn}
                    >
                      <Plus size={15} /> Save Role Definition
                    </button>
                  </div>
                </div>

                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>System Access Hierarchy & Custom Roles</h3>
                  {/* Core Built-in Access Levels */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ padding: '10px', background: '#1c0f30', borderRadius: '8px', borderLeft: '3px solid #a855f7', fontSize: '12px' }}>
                      <b>Admin Access:</b> Full organization setup, rules, payroll lock, audit logs & user management.
                    </div>
                    <div style={{ padding: '10px', background: '#1c0f30', borderRadius: '8px', borderLeft: '3px solid #38bdf8', fontSize: '12px' }}>
                      <b>HR Access:</b> Employee onboarding, salary setup, attendance & leave approvals, payroll draft.
                    </div>
                    <div style={{ padding: '10px', background: '#1c0f30', borderRadius: '8px', borderLeft: '3px solid #4ade80', fontSize: '12px' }}>
                      <b>Employee Access:</b> Self check-in/out, leave requests, own payslips & policy view.
                    </div>
                  </div>

                  {/* Custom Created Roles */}
                  {employeeRoles.map((r) => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#140924', borderRadius: '8px', marginTop: '6px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                          {r.roleName} <span style={{ fontSize: '10px', color: '#d8b4fe', background: '#581c87', padding: '2px 6px', borderRadius: '4px' }}>{r.accessLevel}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#c084fc' }}>{r.permissions}</div>
                      </div>
                      <button onClick={() => deleteItem('employee_roles', r.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: LEAVE TYPES & YEARLY QUOTAS */}
            {tab === 'leaves' && (
              <div style={boxStyle}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Leave Types & Yearly Quotas</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', maxWidth: '500px' }}>
                  <input type="text" style={fieldStyle} placeholder="e.g. Annual Leave, Sick Leave, Casual" value={leaveName} onChange={(e) => setLeaveName(e.target.value)} />
                  <input type="number" style={{ ...fieldStyle, width: '110px' }} value={leaveQuota} onChange={(e) => setLeaveQuota(e.target.value)} />
                  <button onClick={() => leaveName.trim() && postAction('ADD_LEAVE_TYPE', { name: leaveName, quota: leaveQuota }, () => setLeaveName(''))} style={purpleBtn}>
                    <Plus size={15} /> Add
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {leaveTypes.map((lt) => (
                    <div key={lt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#140924', borderRadius: '10px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{lt.name}</div>
                        <div style={{ fontSize: '11px', color: '#86efac' }}>
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

            {/* TAB 5: PUBLIC HOLIDAYS */}
            {tab === 'holidays' && (
              <div style={boxStyle}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Public Holidays</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', maxWidth: '500px' }}>
                  <input type="text" style={fieldStyle} placeholder="Holiday Name (e.g. Independence Day)" value={holidayTitle} onChange={(e) => setHolidayTitle(e.target.value)} />
                  <input type="date" style={{ ...fieldStyle, width: '170px' }} value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} />
                  <button onClick={() => holidayTitle.trim() && holidayDate && postAction('ADD_HOLIDAY', { title: holidayTitle, date: holidayDate }, () => { setHolidayTitle(''); setHolidayDate(''); })} style={purpleBtn}>
                    <Plus size={15} /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {holidays.map((h) => (
                    <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#140924', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13px' }}><b>{h.title}</b> — <span style={{ color: '#c084fc' }}>{h.date}</span></span>
                      <button onClick={() => deleteItem('holidays', h.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: USER ACCOUNTS MANAGEMENT */}
            {tab === 'users' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '16px' }}>
                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Create User Account</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" style={fieldStyle} placeholder="Full Name" value={uName} onChange={(e) => setUName(e.target.value)} />
                    <input type="email" style={fieldStyle} placeholder="Work Email" value={uEmail} onChange={(e) => setUEmail(e.target.value)} />
                    <input type="text" style={fieldStyle} placeholder="Temporary Password" value={uPass} onChange={(e) => setUPass(e.target.value)} />
                    <select style={fieldStyle} value={uRole} onChange={(e) => setURole(e.target.value)}>
                      <option value="HR">HR</option>
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button
                      onClick={() => uName.trim() && uEmail.trim() && postAction('CREATE_USER', { name: uName, email: uEmail, password: uPass, role: uRole }, () => { setUName(''); setUEmail(''); })}
                      style={purpleBtn}
                    >
                      <Plus size={15} /> Create Account
                    </button>
                  </div>
                </div>

                <div style={boxStyle}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Manage User Accounts ({users.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {users.map((u) => (
                      <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#140924', borderRadius: '8px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{u.name}</div>
                          <div style={{ fontSize: '11px', color: '#a855f7' }}>{u.email}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <select
                            value={u.role}
                            onChange={(e) => updateUser(u.id, 'CHANGE_ROLE', { role: e.target.value })}
                            style={{ background: '#24123d', color: '#e9d5ff', border: '1px solid #6b21a8', borderRadius: '6px', padding: '4px 6px', fontSize: '11px' }}
                          >
                            <option value="Admin">Admin</option>
                            <option value="HR">HR</option>
                            <option value="Employee">Employee</option>
                          </select>

                          <button onClick={() => updateUser(u.id, 'RESET_PASSWORD')} style={{
                            padding: '5px 8px', borderRadius: '6px', border: '1px solid #a855f7',
                            background: 'transparent', color: '#e9d5ff', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                            <KeyRound size={12} /> Reset
                          </button>

                          <button onClick={() => updateUser(u.id, 'TOGGLE_ACTIVE', { active: !u.active })} style={{
                            padding: '5px 8px', borderRadius: '6px', border: 'none',
                            background: u.active ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                            color: u.active ? '#86efac' : '#fca5a5', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
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