import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validar campos requeridos
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username y password son requeridos' },
        { status: 400 }
      );
    }

    // Hacer petición al backend
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Error en la autenticación' },
        { status: response.status }
      );
    }

    // Configurar cookie segura
    const cookieStore = cookies();
    cookieStore.set('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 horas
      path: '/',
    });

    return NextResponse.json({ 
      success: true, 
      user: data.user 
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
