'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated, setAdminSession, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEFAULT_ADMIN_PASS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setAdminSession();
        router.push('/admin');
      } else {
        setError(data.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch {
      // Fallback para autenticação local
      if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASS) {
        setAdminSession();
        router.push('/admin');
      } else {
        setError('Erro ao conectar ao servidor de autenticação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar isAdmin={true} />

      <main className="container content py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="admin-card p-4 p-md-5">
              <div className="text-center mb-4">
                <div
                  className="brand-icon mx-auto mb-3"
                  style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: 56, height: 56 }}
                >
                  <i className="bi bi-shield-lock-fill fs-2"></i>
                </div>
                <h2 className="fw-bold mb-1">Acesso Administrativo</h2>
                <p className="text-muted small">
                  Gerenciador do cardápio semanal da ETEC Boituva
                </p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span className="small">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">E-mail institucional</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small">Senha de acesso</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="alert alert-info py-2 small mb-4">
                  <i className="bi bi-info-circle me-1"></i>
                  Credenciais padrão de teste:<br />
                  <strong>admin@etec.sp.gov.br</strong> / <strong>etec123</strong>
                </div>

                <button
                  type="submit"
                  className="btn btn-etec-primary w-100 py-2 d-flex justify-content-center align-items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>Entrar no Painel</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <Link href="/" className="text-decoration-none text-muted small">
                  <i className="bi bi-arrow-left me-1"></i>
                  Voltar para o cardápio público
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

