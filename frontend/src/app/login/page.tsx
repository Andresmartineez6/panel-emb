'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Animaciones de entrada
    const tl = gsap.timeline();
    
    tl.set('.login-container', { opacity: 0, y: 50 })
      .set('.emb-logo', { scale: 0, rotation: -180 })
      .set('.login-title', { opacity: 0, y: -30 })
      .set('.login-subtitle', { opacity: 0 })
      .set('.form-group', { opacity: 0, x: -50 })
      .set('.login-btn', { opacity: 0, scale: 0.8 })
      .set('.particles', { opacity: 0 });

    // Secuencia de animaciones
    tl.to('.login-container', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
      .to('.emb-logo', { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5')
      .to('.login-title', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to('.login-subtitle', { opacity: 1, duration: 0.8, text: 'Sistema de Gestión Integral • Acceso Restringido', ease: 'none' }, '-=0.2')
      .to('.form-group', { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.3')
      .to('.login-btn', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.2')
      .to('.particles', { opacity: 1, duration: 1 }, '-=0.5');

    // Animación de partículas
    gsap.to('.particle', {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        each: 0.2,
        from: 'random'
      }
    });

    // Efecto de respiración en el logo
    gsap.to('.emb-logo', {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Animación de loading
    gsap.to('.login-btn', { scale: 0.95, duration: 0.1 });
    gsap.to('.login-form', { opacity: 0.7, duration: 0.3 });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        // Animación de éxito
        gsap.to('.login-container', { 
          scale: 1.1, 
          opacity: 0, 
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => router.push('/dashboard')
        });
      } else {
        const data = await response.json();
        setError(data.message || 'Credenciales incorrectas');
        
        // Animación de error
        gsap.to('.login-form', { x: -10, duration: 0.1 })
          .to('.login-form', { x: 10, duration: 0.1 })
          .to('.login-form', { x: 0, duration: 0.1 })
          .to('.login-form', { opacity: 1, duration: 0.3 });
      }
    } catch (error) {
      setError('Error de conexión');
      gsap.to('.login-form', { opacity: 1, duration: 0.3 });
    } finally {
      setLoading(false);
      gsap.to('.login-btn', { scale: 1, duration: 0.2 });
    }
  };

  return (
    <div className="login-page">
      {/* Partículas de fondo */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }} />
        ))}
      </div>

      {/* Contenedor principal */}
      <div className="login-container">
        <div className="login-box">
          {/* Logo y título */}
          <div className="login-header">
            <div className="emb-logo">
              <span className="logo-text">EMB</span>
            </div>
            <h1 className="login-title">Panel EMB</h1>
            <p className="login-subtitle"></p>
          </div>

          {/* Formulario */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Usuario"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                className="form-input"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="login-btn"
            >
              {loading ? 'Verificando...' : 'Acceder'}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>© 2024 EMB • Acceso Restringido</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: linear-gradient(45deg, #d4af37, #f4d03f);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }

        .login-container {
          z-index: 1;
        }

        .login-box {
          background: rgba(20, 20, 20, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          padding: 3rem;
          width: 420px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(212, 175, 55, 0.1);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .emb-logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .logo-text {
          font-family: 'Arial Black', sans-serif;
          font-size: 24px;
          font-weight: 900;
          color: #000;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .login-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
        }

        .login-subtitle {
          color: #d4af37;
          font-size: 0.9rem;
          opacity: 0.8;
          height: 20px;
        }

        .login-form {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.5rem;
          background: rgba(40, 40, 40, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
          transform: translateY(-2px);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .error-message {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #ff6b6b;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          text-align: center;
        }

        .login-btn {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border: none;
          border-radius: 12px;
          color: #000;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(212, 175, 55, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        @media (max-width: 480px) {
          .login-box {
            width: 90vw;
            padding: 2rem;
          }
          
          .login-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
