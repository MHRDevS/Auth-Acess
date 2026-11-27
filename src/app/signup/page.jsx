'use client';

import { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn,
  ShieldCheck, Layers, LockKeyhole, Cpu, Terminal, CheckCircle2,
  Volume2, VolumeX, Fingerprint
} from 'lucide-react';

function useCyberAudio(enabled) {
  const ctxRef = useRef(null);

  const getCtx = () => {
    if (!enabled || typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  const playTick = (freq = 720, dur = 0.03) => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + dur);
    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  };

  const playSwitch = (high = true) => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    const base = high ? 520 : 410;
    osc.frequency.setValueAtTime(base, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(base * 1.45, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const playWarpLaunch = () => {
    const ctx = getCtx();
    if (!ctx) return;
    [330, 440, 660, 880].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.05);
      osc.frequency.exponentialRampToValueAtTime(f * 1.35, ctx.currentTime + 0.48);
      gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + 0.5);
    });
  };

  return { playTick, playSwitch, playWarpLaunch };
}

function SmoothCyberCanvas({ warpMode }) {
  const canvasRef = useRef(null);
  const warpRef = useRef(warpMode);
  warpRef.current = warpMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const mouse = { x: -1000, y: -1000 };
    const ripples = [];
    const sparks = [];
    const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#38bdf8'];

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onClick = (e) => {
      if (ripples.length > 6) ripples.shift();
      ripples.push({ x: e.clientX, y: e.clientY, r: 6, alpha: 0.85 });
      for (let s = 0; s < 12; s++) {
        const angle = (Math.PI * 2 * s) / 12;
        const speed = 2.4 + Math.random() * 2.8;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[s % colors.length]
        });
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    const nodes = Array.from({ length: 34 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      r: (i % 3) + 1.4,
      color: colors[i % colors.length]
    }));

    const maxDistSq = 140 * 140;
    const mouseDistSq = 185 * 185;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.5;

      for (let k = ripples.length - 1; k >= 0; k--) {
        const rip = ripples[k];
        rip.r += 5.5;
        rip.alpha -= 0.025;
        if (rip.alpha <= 0) {
          ripples.splice(k, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${rip.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      for (let s = sparks.length - 1; s >= 0; s--) {
        const sp = sparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.94;
        sp.vy *= 0.94;
        sp.alpha -= 0.032;
        if (sp.alpha <= 0) {
          sparks.splice(s, 1);
          continue;
        }
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.fillRect(sp.x - 1.5, sp.y - 1.5, 3, 3);
      }
      ctx.globalAlpha = 1;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (warpRef.current) {
          n.x += (n.x - cx) * 0.06;
          n.y += (n.y - cy) * 0.06;
          if (n.x < 0 || n.x > canvas.width || n.y < 0 || n.y > canvas.height) {
            n.x = cx + (Math.random() - 0.5) * 100;
            n.y = cy + (Math.random() - 0.5) * 100;
          }
        } else {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
          if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < maxDistSq) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dSq / maxDistSq) * 0.24})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        const mdSq = mdx * mdx + mdy * mdy;
        if (mdSq < mouseDistSq) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - mdSq / mouseDistSq) * 0.52})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}

function ScrambleHeading({ text }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%';
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < iteration) return text[idx];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      iteration += 1;
      if (iteration >= text.length) {
        setDisplayText(text);
        clearInterval(interval);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStage, setAuthStage] = useState(0);
  const [liveTime, setLiveTime] = useState('');
  const [sfxEnabled, setSfxEnabled] = useState(true);

  const { playTick, playSwitch, playWarpLaunch } = useCyberAudio(sfxEnabled);

  const cardRef = useRef(null);
  const spotlightRef = useRef(null);
  const rafRef = useRef(null);

  // Force reset spinner/overlay whenever /signup mounts or user navigates back
  useEffect(() => {
    setLoading(false);
    setAuthStage(0);
    setError('');
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.5;
      const rotateX = ((y - centerY) / centerY) * -2.2;
      const rotateY = ((x - centerX) / centerX) * 2.2;

      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(380px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.14), rgba(139, 92, 246, 0.05) 45%, transparent 75%)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const switchMode = (loginMode) => {
    playSwitch(loginMode);
    setIsLogin(loginMode);
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const switchRole = (selectedRole) => {
    playSwitch(selectedRole === 'HR');
    setRole(selectedRole);
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: 'Awaiting Key', color: '#475569' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 9) score++;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: 'Basic', color: '#f43f5e' };
    if (score === 2) return { level: 2, label: 'Moderate', color: '#f59e0b' };
    if (score === 3) return { level: 3, label: 'Strong', color: '#06b6d4' };
    return { level: 4, label: 'Fortress', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);

  const readiness = isLogin
    ? (email ? 50 : 0) + (password.length >= 4 ? 50 : 0)
    : (name ? 34 : 0) + (email ? 33 : 0) + (password.length >= 6 ? 33 : 0);

  const rawSeed = `${name}${email}${password}${role}`;
  let hVal = 2166136261;
  for (let i = 0; i < rawSeed.length; i++) {
    hVal ^= rawSeed.charCodeAt(i);
    hVal = Math.imul(hVal, 16777619);
  }
  const hexHash = rawSeed
    ? `0x${(hVal >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(0, 4)}...${(hVal >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(4)}`
    : '0x8F4C...E29A';

  const handleSubmit = async (e) => {
    e.preventDefault();
    playWarpLaunch();
    setError('');
    setLoading(true);
    setAuthStage(1);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin ? { email, password } : { name, email, password, role };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Authentication failed.');
        setLoading(false);
        setAuthStage(0);
        return;
      }

      setAuthStage(2);
      const userRole = data.role || role;
      const userName = data.name || name || 'Hasan';

      localStorage.clear();
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userName', userName);
      localStorage.setItem(`${userRole}_userName`, userName);
      localStorage.setItem('userEmail', email);

      setTimeout(() => setAuthStage(3), 250);

      // Hard navigation prevents Next.js from caching the loading overlay
      setTimeout(() => {
        if (userRole === 'Admin') window.location.href = '/dashboard/admin';
        else if (userRole === 'HR') window.location.href = '/dashboard/hr';
        else window.location.href = '/dashboard/employee';
      }, 650);

    } catch (err) {
      setError('Server connection error.');
      setLoading(false);
      setAuthStage(0);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px 12px 40px',
    background: 'rgba(3, 6, 14, 0.95)',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  };

  const activeAccent = !isLogin && role === 'HR' ? '#a78bfa' : '#34d399';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#02040a',
      backgroundImage: `
        radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.22) 0%, transparent 45%),
        radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.24) 0%, transparent 45%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SmoothCyberCanvas warpMode={loading} />

      <style>{`
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(62deg) translateY(0px); }
          100% { transform: perspective(500px) rotateX(62deg) translateY(40px); }
        }
        @keyframes spinOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes gyro3D {
          0% { transform: rotateX(68deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(68deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes sonarPulse {
          0% { transform: scale(0.68); opacity: 0.75; }
          100% { transform: scale(1.48); opacity: 0; }
        }
        @keyframes prismFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes laserScan {
          0%, 100% { transform: translateY(6px); opacity: 0.3; }
          50% { transform: translateY(68px); opacity: 1; }
        }
        @keyframes eqWave {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        @keyframes holoShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideFadeIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes liveBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .gpu-layer {
          will-change: transform;
          transform: translateZ(0);
        }
        .input-holo:focus {
          border-color: #38bdf8 !important;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.18), 0 0 18px rgba(16, 185, 129, 0.25) !important;
        }
        .cta-holo:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(6, 182, 212, 0.5), 0 0 22px rgba(139, 92, 246, 0.4) !important;
        }
        .cta-holo:active {
          transform: translateY(0px) scale(0.98);
        }
      `}</style>

      <div
        className="gpu-layer"
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '-20%',
          right: '-20%',
          height: '46vh',
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.11) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.11) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 10%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.85) 10%, transparent 95%)',
          animation: 'gridMove 2s linear infinite',
          pointerEvents: 'none'
        }}
      />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="gpu-layer"
        style={{
          width: '100%',
          maxWidth: '980px',
          padding: '2px',
          borderRadius: '30px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.92), 0 0 55px rgba(6, 182, 212, 0.18)',
          zIndex: 2
        }}
      >
        <div
          className="gpu-layer"
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'conic-gradient(from 0deg, transparent 0%, transparent 55%, #10b981 70%, #38bdf8 82%, #8b5cf6 94%, transparent 100%)',
            animation: 'spinOrbit 5s linear infinite',
            zIndex: 0
          }}
        />

        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          background: 'rgba(8, 12, 24, 0.96)',
          borderRadius: '28px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1
        }}>
          <div
            ref={spotlightRef}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* LEFT PANEL */}
          <div style={{
            padding: '36px 32px',
            background: 'linear-gradient(155deg, rgba(12, 24, 40, 0.95) 0%, rgba(4, 7, 15, 0.99) 100%)',
            borderRight: '1px solid rgba(56, 189, 248, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(6, 182, 212, 0.5)'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.6px' }}>HASAN</div>
                  <div style={{
                    fontSize: '11px', fontWeight: '700',
                    background: 'linear-gradient(90deg, #34d399, #38bdf8)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>
                    ENTERPRISE WORKFORCE OS
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSfxEnabled(!sfxEnabled)}
                  title="Toggle Cyber Audio FX"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '4px 8px', borderRadius: '20px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: sfxEnabled ? '#38bdf8' : '#64748b',
                    fontSize: '10px', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  {sfxEnabled ? <Volume2 size={11} /> : <VolumeX size={11} />}
                </button>

                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 10px', borderRadius: '20px',
                  background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)',
                  fontSize: '10px', color: '#6ee7b7', fontWeight: 'bold'
                }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#10b981', boxShadow: '0 0 8px #10b981',
                    animation: 'liveBlink 1.5s infinite'
                  }} />
                  LIVE
                </span>
              </div>
            </div>

            <div style={{
              margin: '22px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                padding: '0 6px'
              }}>
                <div style={{
                  padding: '6px 11px',
                  borderRadius: '10px',
                  background: 'rgba(10, 18, 34, 0.95)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  fontSize: '10px',
                  color: '#6ee7b7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Cpu size={12} /> {isLogin ? 'JWT Session' : `${role} Tier`}
                </div>

                <div style={{
                  padding: '6px 11px',
                  borderRadius: '10px',
                  background: 'rgba(10, 18, 34, 0.95)',
                  border: '1px solid rgba(167, 139, 250, 0.45)',
                  fontSize: '10px',
                  color: '#ddd6fe',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <ShieldCheck size={12} /> {hexHash}
                </div>
              </div>

              <div style={{
                width: '180px',
                height: '180px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div
                  className="gpu-layer"
                  style={{
                    position: 'absolute',
                    inset: '14px',
                    borderRadius: '50%',
                    border: `1.5px solid ${activeAccent}`,
                    animation: 'sonarPulse 3s ease-out infinite'
                  }}
                />

                <div
                  className="gpu-layer"
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(56, 189, 248, 0.55)',
                    animation: 'gyro3D 8s linear infinite'
                  }}
                />

                <div
                  className="gpu-layer"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '1.5px dashed rgba(56, 189, 248, 0.42)',
                    animation: 'spinOrbit 12s linear infinite'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-4.5px',
                    left: '50%',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 12px #10b981'
                  }} />
                </div>

                <div
                  className="gpu-layer"
                  style={{
                    position: 'absolute',
                    inset: '22px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(139, 92, 246, 0.45)',
                    borderTopColor: '#38bdf8',
                    borderBottomColor: '#10b981',
                    animation: 'spinReverse 7.5s linear infinite'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#a78bfa',
                    boxShadow: '0 0 12px #a78bfa'
                  }} />
                </div>

                <div
                  className="gpu-layer"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '24px',
                    background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.22) 0%, rgba(15, 23, 42, 0.96) 50%, rgba(139, 92, 246, 0.28) 100%)',
                    border: `1.5px solid ${activeAccent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 36px rgba(6, 182, 212, 0.4)',
                    animation: 'prismFloat 4s ease-in-out infinite',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <ShieldCheck size={36} color={activeAccent} />
                  <div
                    className="gpu-layer"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2.5px',
                      background: 'linear-gradient(90deg, transparent, #34d399, #38bdf8, transparent)',
                      boxShadow: '0 0 10px #38bdf8',
                      animation: 'laserScan 2.4s ease-in-out infinite'
                    }}
                  />
                </div>
              </div>

              <h2 style={{
                fontSize: '20px',
                fontWeight: '800',
                textAlign: 'center',
                margin: '16px 0 6px 0',
                background: 'linear-gradient(90deg, #ffffff 0%, #6ee7b7 50%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Unified People & Access Core
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', margin: 0, maxWidth: '300px', lineHeight: '1.5' }}>
                Real-time attendance geofencing, role-based governance, and automated workforce policies in one secure workspace.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '12px',
                background: 'rgba(4, 8, 18, 0.85)', border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '11px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                  <Layers size={14} color="#34d399" /> Neural Telemetry Stream
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '16px' }}>
                  {[0, 0.2, 0.4, 0.1, 0.3].map((delay, idx) => (
                    <span
                      key={idx}
                      className="gpu-layer"
                      style={{
                        width: '3px',
                        height: '15px',
                        borderRadius: '2px',
                        background: idx % 2 === 0 ? '#10b981' : '#38bdf8',
                        animation: `eqWave 1s ease-in-out ${delay}s infinite`
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: '12px',
                background: 'rgba(4, 8, 18, 0.85)', border: '1px solid rgba(139, 92, 246, 0.25)',
                fontSize: '11px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                  <Terminal size={14} color="#a78bfa" /> Node Clock: {liveTime}
                </span>
                <span style={{ color: '#ddd6fe', fontWeight: 'bold', fontFamily: 'monospace' }}>120FPS</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            key={`${isLogin ? 'login' : 'register'}-${role}`}
            style={{
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
              animation: 'slideFadeIn 0.3s ease-out'
            }}
          >
            {loading && authStage > 0 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(4, 7, 15, 0.96)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '28px',
                textAlign: 'center'
              }}>
                <div
                  className="gpu-layer"
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '50%',
                    border: '2.5px solid rgba(56, 189, 248, 0.2)',
                    borderTopColor: '#10b981',
                    borderRightColor: '#8b5cf6',
                    animation: 'spinOrbit 0.8s linear infinite',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 28px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <CheckCircle2 size={26} color="#34d399" />
                </div>

                <div style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  background: 'linear-gradient(90deg, #6ee7b7, #38bdf8, #c4b5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {authStage === 1 && '01 // Verifying Credentials...'}
                  {authStage === 2 && '02 // Locking Role Permissions...'}
                  {authStage === 3 && '03 // Launching Command Deck...'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', width: '210px' }}>
                  {[1, 2, 3].map((st) => (
                    <div
                      key={st}
                      style={{
                        height: '4px',
                        borderRadius: '4px',
                        background: authStage >= st ? '#10b981' : 'rgba(255,255,255,0.1)',
                        boxShadow: authStage >= st ? '0 0 10px #10b981' : 'none',
                        transition: 'all 0.25s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'rgba(3, 6, 14, 0.95)',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.16)',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => switchMode(false)}
                style={{
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: !isLogin ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)' : 'transparent',
                  color: !isLogin ? '#ffffff' : '#94a3b8'
                }}
              >
                Register Account
              </button>
              <button
                type="button"
                onClick={() => switchMode(true)}
                style={{
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isLogin ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)' : 'transparent',
                  color: isLogin ? '#ffffff' : '#94a3b8'
                }}
              >
                Sign In
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '23px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                <ScrambleHeading text={isLogin ? 'Access Workspace' : `Create ${role} Profile`} />
              </h1>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 9px', borderRadius: '20px',
                background: readiness >= 100 ? 'rgba(16, 185, 129, 0.18)' : 'rgba(15, 23, 42, 0.9)',
                border: `1px solid ${readiness >= 100 ? '#34d399' : 'rgba(56, 189, 248, 0.25)'}`,
                fontSize: '10px', fontWeight: '700',
                color: readiness >= 100 ? '#6ee7b7' : '#7dd3fc'
              }}>
                <Fingerprint size={12} /> {readiness}%
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 18px 0' }}>
              {isLogin ? 'Enter your credentials to launch your dashboard' : 'Select your organizational role to get started'}
            </p>

            {error && (
              <div style={{
                padding: '10px 12px', marginBottom: '14px', borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444',
                color: '#fca5a5', fontSize: '12px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              {!isLogin && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '5px', color: '#cbd5e1' }}>
                    USERNAME *
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <User size={15} color="#38bdf8" style={{ position: 'absolute', left: '13px' }} />
                    <input
                      type="text"
                      name={`name-${role}`}
                      autoComplete="off"
                      placeholder="Username"
                      className="input-holo"
                      style={inputStyle}
                      value={name}
                      onChange={(e) => { setName(e.target.value); playTick(760); }}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '5px', color: '#cbd5e1' }}>
                  WORK EMAIL ADDRESS *
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={15} color="#38bdf8" style={{ position: 'absolute', left: '13px' }} />
                  <input
                    type="email"
                    name={`email-${isLogin ? 'login' : role}`}
                    autoComplete="new-email"
                    placeholder={isLogin ? 'user@company.com' : role === 'HR' ? 'hr@company.com' : 'employee@company.com'}
                    className="input-holo"
                    style={inputStyle}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); playTick(820); }}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '5px', color: '#cbd5e1' }}>
                    PORTAL ACCESS ROLE *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => switchRole('Employee')}
                      style={{
                        padding: '10px',
                        borderRadius: '11px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: role === 'Employee' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(3, 6, 14, 0.92)',
                        border: role === 'Employee' ? '1.5px solid #34d399' : '1px solid rgba(255,255,255,0.08)',
                        color: role === 'Employee' ? '#6ee7b7' : '#94a3b8'
                      }}
                    >
                      Employee
                    </button>

                    <button
                      type="button"
                      onClick={() => switchRole('HR')}
                      style={{
                        padding: '10px',
                        borderRadius: '11px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: role === 'HR' ? 'rgba(139, 92, 246, 0.24)' : 'rgba(3, 6, 14, 0.92)',
                        border: role === 'HR' ? '1.5px solid #a78bfa' : '1px solid rgba(255,255,255,0.08)',
                        color: role === 'HR' ? '#ddd6fe' : '#94a3b8'
                      }}
                    >
                      HR Specialist
                    </button>
                  </div>
                  <p style={{ fontSize: '10px', color: '#64748b', margin: '6px 0 0 0', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <LockKeyhole size={12} color="#38bdf8" />
                    <span>Admin accounts are provisioned internally by system owners.</span>
                  </p>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#cbd5e1' }}>
                    PASSWORD *
                  </label>
                  {!isLogin && (
                    <span style={{ fontSize: '10px', fontWeight: '700', color: strength.color }}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={15} color="#38bdf8" style={{ position: 'absolute', left: '13px' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name={`password-${isLogin ? 'login' : role}`}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="input-holo"
                    style={inputStyle}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); playTick(880); }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => { setShowPass(!showPass); playTick(960); }}
                    style={{
                      position: 'absolute', right: '12px', background: 'transparent',
                      border: 'none', color: '#38bdf8', cursor: 'pointer'
                    }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {!isLogin && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', marginTop: '7px' }}>
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        style={{
                          height: '3.5px',
                          borderRadius: '4px',
                          background: strength.level >= seg ? strength.color : 'rgba(255,255,255,0.08)',
                          boxShadow: strength.level >= seg ? `0 0 8px ${strength.color}` : 'none',
                          transition: 'all 0.25s ease'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cta-holo gpu-layer"
                style={{
                  marginTop: '6px',
                  padding: '13px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  background: 'linear-gradient(270deg, #10b981, #06b6d4, #8b5cf6, #10b981)',
                  backgroundSize: '300% 300%',
                  animation: 'holoShimmer 5s ease infinite',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 30px rgba(6, 182, 212, 0.38)'
                }}
              >
                {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                {isLogin ? 'Launch Dashboard' : `Create ${role} Account`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}