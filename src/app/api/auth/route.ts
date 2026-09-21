import { NextResponse } from 'next/server';
import { clearAdminSessionCookie, isValidAdminCredentials, setAdminSessionCookie } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!isValidAdminCredentials(email, password)) {
      return NextResponse.json(
        { success: false, error: 'E-mail ou senha incorretos' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        name: 'Administrador ETEC Boituva',
        email: String(process.env.ADMIN_EMAIL || '').trim(),
      },
    });

    await setAdminSessionCookie(response);
    return response;
  } catch (error) {
    console.error('Erro na API /api/auth:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao autenticar' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logout realizado com sucesso' });
  clearAdminSessionCookie(response);
  return response;
}

