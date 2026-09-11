const ADMIN_SESSION_KEY = 'etec_admin_session_token';

export const DEFAULT_ADMIN_EMAIL = 'admin@etec.sp.gov.br';
export const DEFAULT_ADMIN_PASS = 'etec123';

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    return Boolean(session && session === 'authenticated_admin');
  } catch {
    return false;
  }
}

export function setAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated_admin');
  } catch (e) {
    console.error(e);
  }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    console.error(e);
  }
}

