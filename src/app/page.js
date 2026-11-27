'use client';

import { useEffect } from 'react';

export default function HomeRedirect() {
  useEffect(() => {
    window.location.href = '/signup';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#02040a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#5eead4',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      letterSpacing: '0.5px'
    }}>
      Launching Hasan Enterprise Workforce OS...
    </div>
  );
}