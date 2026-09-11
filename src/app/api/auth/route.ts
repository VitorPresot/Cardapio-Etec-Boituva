import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const validEmail = process.env.ADMIN_EMAIL || 'admin@etec.sp.gov.br';
    const validPassword = process.env.ADMIN_PASSWORD || 'etec123';

    if (email === validEmail && password === validPassword) {
      return NextResponse.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          name: 'Administrador ETEC Boituva',
          email: validEmail,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'E-mail ou senha incorretos' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro na API /api/auth:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno ao autenticar' },
      { status: 500 }
    );
  }
}

