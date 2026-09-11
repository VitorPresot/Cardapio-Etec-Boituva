'use client';

import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isAdmin = false }) => {
  return (
    <nav className="navbar navbar-custom">
      <div className="container py-2 d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand brand d-flex align-items-center">
          <span className="brand-icon">
            <i className="bi bi-egg-fried"></i>
          </span>
          <span>ETEC Boituva</span>
        </Link>

        <div>
          {isAdmin ? (
            <Link href="/" className="nav-admin-btn d-flex align-items-center gap-2">
              <i className="bi bi-eye"></i>
              <span>Ver Cardápio Público</span>
            </Link>
          ) : (
            <Link href="/admin" className="nav-admin-btn d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock"></i>
              <span>Painel Admin</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

