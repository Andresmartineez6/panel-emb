
import './globals.css'
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Panel EMB - Gestión Integral',
  description: 'Sistema de gestión integral para EMB - Clientes, Facturación, Presupuestos',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
  
}
