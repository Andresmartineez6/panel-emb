import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // Eliminar cookie de autenticación
    cookieStore.delete('auth_token');

    return NextResponse.json({ 
      success: true, 
      message: 'Sesión cerrada correctamente' 
    });

  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error cerrando sesión' },
      { status: 500 }
    );
  }
}
