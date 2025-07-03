'use client';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Animación de carga y redirección automática
    const tl = gsap.timeline();
    
    // Configurar estados iniciales
    gsap.set('.loading-container', { opacity: 0, scale: 0.8 });
    gsap.set('.emb-logo', { scale: 0, rotation: -180 });
    gsap.set('.loading-text', { opacity: 0, y: 20 });
    gsap.set('.loading-bar', { scaleX: 0 });
    gsap.set('.particles', { opacity: 0 });

    // Secuencia de animación
    tl.to('.loading-container', { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' })
      .to('.emb-logo', { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)' }, '-=0.4')
      .to('.loading-text', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to('.particles', { opacity: 1, duration: 0.8 }, '-=0.5')
      .to('.loading-bar', { scaleX: 1, duration: 2, ease: 'power2.inOut' }, '-=0.3')
      .to('.loading-container', { 
        opacity: 0, 
        scale: 1.2, 
        duration: 0.5, 
        ease: 'power2.in',
        onComplete: () => router.push('/login')
      }, '+=0.5');

    // Animación de partículas
    gsap.to('.particle', {
      y: -30,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        each: 0.2,
        from: 'random'
      }
    });

    // Pulso del logo
    gsap.to('.emb-logo', {
      boxShadow: '0 0 50px rgba(212, 175, 55, 0.8)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

  }, [router]);

  return (
    <div className="loading-page">
      {/* Partículas de fondo */}
      <div className="particles">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }} />
        ))}
      </div>

      {/* Contenedor principal */}
      <div className="loading-container">
        <div className="emb-logo">
          <span className="logo-text">EMB</span>
        </div>
        
        <h1 className="loading-text main-title">Panel EMB</h1>
        <p className="loading-text subtitle">Sistema de Gestión Integral</p>
        <p className="loading-text description">Iniciando aplicación segura...</p>
        
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
        
        <div className="loading-text security-note">
          🔒 Acceso Restringido • Solo Personal EMB
        </div>
      </div>

      <style jsx>{`
        .loading-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: linear-gradient(45deg, #d4af37, #f4d03f);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
        }

        .loading-container {
          text-align: center;
          z-index: 1;
        }

        .emb-logo {
          width: 120px;
          height: 120px;
          margin: 0 auto 2rem;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(212, 175, 55, 0.3);
          position: relative;
        }

        .emb-logo::before {
          content: '';
          position: absolute;
          width: 140px;
          height: 140px;
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          animation: rotate 3s linear infinite;
        }

        .emb-logo::after {
          content: '';
          position: absolute;
          width: 160px;
          height: 160px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 50%;
          border-top-color: transparent;
          border-right-color: transparent;
          animation: rotate 4s linear infinite reverse;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .logo-text {
          font-family: 'Arial Black', sans-serif;
          font-size: 36px;
          font-weight: 900;
          color: #000;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          z-index: 1;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 1rem 0;
          text-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
          letter-spacing: -0.02em;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #d4af37;
          margin: 0 0 0.5rem 0;
          font-weight: 400;
          opacity: 0.9;
        }

        .description {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 3rem 0;
          font-weight: 300;
        }

        .loading-bar-container {
          width: 300px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin: 0 auto 2rem;
          overflow: hidden;
          position: relative;
        }

        .loading-bar {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #f4d03f, #d4af37);
          border-radius: 2px;
          transform-origin: left;
          position: relative;
        }

        .loading-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .security-note {
          font-size: 0.9rem;
          color: rgba(212, 175, 55, 0.8);
          margin: 2rem 0 0 0;
          padding: 1rem 2rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 25px;
          display: inline-block;
          backdrop-filter: blur(10px);
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2.5rem;
          }
          
          .emb-logo {
            width: 80px;
            height: 80px;
          }
          
          .logo-text {
            font-size: 24px;
          }
          
          .loading-bar-container {
            width: 250px;
          }
        }
      `}</style>
    </div>
  );
}
