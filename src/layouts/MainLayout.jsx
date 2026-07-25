import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Floating particles background component
const Particles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${(i * 7) % 100}%`,
      size: (i % 4) + 2,
      duration: (i % 15) + 10,
      delay: i % 10,
      opacity: ((i % 5) / 10) + 0.1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? '#3B82F6' : p.id % 3 === 1 ? '#06B6D4' : '#22C55E',
            opacity: p.opacity,
            animation: `particle-drift ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#050D1A' }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none z-0" />
      
      {/* Ambient gradient orbs */}
      <div className="absolute pointer-events-none z-0"
        style={{ top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute pointer-events-none z-0"
        style={{ bottom: '-20%', right: '-10%', width: '60%', height: '60%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute pointer-events-none z-0"
        style={{ top: '40%', right: '20%', width: '30%', height: '30%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      
      {/* Floating particles */}
      <Particles />
      
      <Navbar />
      <main className="flex-grow pt-20 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
