'use client';
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Users, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut,
  TrendingUp,
  Clock,
  AlertCircle,
  Calendar
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    clients: 47,
    invoices: 156,
    revenue: 87540,
    pending: 12300
  });

  useEffect(() => {
    // Animaciones de entrada
    const tl = gsap.timeline();
    
    // Configurar estados iniciales
    gsap.set('.dashboard-header', { opacity: 0, y: -50 });
    gsap.set('.stat-card', { opacity: 0, y: 30, scale: 0.9 });
    gsap.set('.chart-container', { opacity: 0, x: -50 });
    gsap.set('.recent-activity', { opacity: 0, x: 50 });
    gsap.set('.quick-actions', { opacity: 0, y: 50 });
    gsap.set('.floating-particles', { opacity: 0 });

    // Secuencia de animaciones
    tl.to('.dashboard-header', { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      ease: 'power2.out' 
    })
    .to('.stat-card', { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      duration: 0.6, 
      stagger: 0.1, 
      ease: 'back.out(1.7)' 
    }, '-=0.4')
    .to('.chart-container', { 
      opacity: 1, 
      x: 0, 
      duration: 0.8, 
      ease: 'power2.out' 
    }, '-=0.3')
    .to('.recent-activity', { 
      opacity: 1, 
      x: 0, 
      duration: 0.8, 
      ease: 'power2.out' 
    }, '-=0.6')
    .to('.quick-actions', { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: 'power2.out' 
    }, '-=0.4')
    .to('.floating-particles', { 
      opacity: 1, 
      duration: 1 
    }, '-=0.5');

    // Animación de números contadores
    gsap.to('.counter', {
      innerText: (i, target) => target.getAttribute('data-count'),
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      stagger: 0.2
    });

    // Animación continua de partículas
    gsap.to('.particle', {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        each: 0.3,
        from: 'random'
      }
    });

    // Efecto hover en tarjetas
    const cards = document.querySelectorAll('.stat-card, .action-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        gsap.to(card.querySelector('.card-icon'), { 
          rotation: 10, 
          scale: 1.1, 
          duration: 0.3 
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(card.querySelector('.card-icon'), { 
          rotation: 0, 
          scale: 1, 
          duration: 0.3 
        });
      });
    });

  }, []);

  const handleLogout = async () => {
    // Animación de salida
    gsap.to('.dashboard-container', {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        fetch('/api/auth/logout', { method: 'POST' })
          .then(() => window.location.href = '/login');
      }
    });
  };

  return (
    <div className="dashboard-page">
      {/* Partículas flotantes */}
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="emb-logo-small">EMB</div>
              <div>
                <h1 className="dashboard-title">Panel EMB</h1>
                <p className="dashboard-subtitle">Sistema de Gestión Integral</p>
              </div>
            </div>
            <div className="header-right">
              <div className="user-info">
                <span className="user-name">Bienvenido, Equipo EMB</span>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={18} />
                  Salir
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="card-icon">
              <Users size={24} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Clientes</h3>
              <p className="card-value counter" data-count="47">0</p>
              <span className="card-change positive">+12% este mes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="card-icon">
              <FileText size={24} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Facturas</h3>
              <p className="card-value counter" data-count="156">0</p>
              <span className="card-change positive">+8% este mes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="card-icon">
              <DollarSign size={24} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Ingresos</h3>
              <p className="card-value">€<span className="counter" data-count="87540">0</span></p>
              <span className="card-change positive">+15% este mes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="card-icon">
              <Clock size={24} />
            </div>
            <div className="card-content">
              <h3 className="card-title">Pendiente</h3>
              <p className="card-value">€<span className="counter" data-count="12300">0</span></p>
              <span className="card-change neutral">3 facturas</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Chart Section */}
          <div className="chart-container">
            <h2 className="section-title">Evolución de Ingresos</h2>
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[65, 78, 45, 89, 67, 92, 78, 85, 91, 76, 88, 94].map((height, i) => (
                  <div 
                    key={i} 
                    className="chart-bar" 
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <h2 className="section-title">Actividad Reciente</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <FileText size={16} />
                </div>
                <div className="activity-content">
                  <p className="activity-text">Nueva factura creada #2024-001</p>
                  <span className="activity-time">Hace 2 horas</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <Users size={16} />
                </div>
                <div className="activity-content">
                  <p className="activity-text">Cliente "Empresa XYZ" agregado</p>
                  <span className="activity-time">Hace 4 horas</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <DollarSign size={16} />
                </div>
                <div className="activity-content">
                  <p className="activity-text">Pago recibido €2,500</p>
                  <span className="activity-time">Ayer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          {[
            { icon: Users, label: 'Clientes', color: '#d4af37' },
            { icon: FileText, label: 'Facturación', color: '#2563eb' },
            { icon: BarChart3, label: 'Presupuestos', color: '#059669' },
            { icon: Settings, label: 'Dashboard', color: '#dc2626' }
          ].map((action, i) => (
            <div key={i} className="action-card" style={{ '--accent': action.color }}>
              <div className="card-icon">
                <action.icon size={20} />
              </div>
              <span className="action-label">{action.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
          position: relative;
          overflow-x: hidden;
        }

        .floating-particles {
          position: fixed;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: linear-gradient(45deg, #d4af37, #f4d03f);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
        }

        .dashboard-container {
          position: relative;
          z-index: 1;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 3rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .emb-logo-small {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: #000;
          font-size: 14px;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
          text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
        }

        .dashboard-subtitle {
          color: #d4af37;
          margin: 0;
          opacity: 0.8;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          color: #fff;
          font-weight: 500;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #ff6b6b;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(220, 53, 69, 0.3);
          transform: translateY(-2px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          transition: all 0.3s ease;
        }

        .card-content {
          flex: 1;
        }

        .card-title {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-value {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem 0;
        }

        .card-change {
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .card-change.positive {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .card-change.neutral {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
        }

        .main-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .chart-container, .recent-activity {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 2rem 0;
        }

        .chart-placeholder {
          height: 300px;
          display: flex;
          align-items: end;
          justify-content: center;
          padding: 2rem;
        }

        .chart-bars {
          display: flex;
          align-items: end;
          gap: 8px;
          height: 100%;
          width: 100%;
        }

        .chart-bar {
          flex: 1;
          background: linear-gradient(to top, #d4af37, #f4d03f);
          border-radius: 4px 4px 0 0;
          min-height: 20px;
          transition: all 0.3s ease;
          opacity: 0.8;
        }

        .chart-bar:hover {
          opacity: 1;
          transform: scaleY(1.1);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(40, 40, 40, 0.5);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: rgba(40, 40, 40, 0.8);
          transform: translateX(5px);
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          background: rgba(212, 175, 55, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
        }

        .activity-content {
          flex: 1;
        }

        .activity-text {
          color: #fff;
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
        }

        .activity-time {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .action-card .card-icon {
          width: 40px;
          height: 40px;
          background: var(--accent);
          border-radius: 8px;
          font-size: 14px;
        }

        .action-label {
          color: #fff;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .main-content {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
