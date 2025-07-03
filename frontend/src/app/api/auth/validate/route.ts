
import { NextRequest, NextResponse } from 'next/server';


const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { valid: false, error: 'No token found' },
        { status: 401 }
      );
    }

    //validar token con el backend
    const response = await fetch(`${BACKEND_URL}/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { valid: false, error: 'Token inválido' },
        { status: 401 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      valid: true,
      user: data.user
    });

  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json(
      { valid: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }

}
