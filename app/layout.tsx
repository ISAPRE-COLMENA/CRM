import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'CRM Colmena', description:'CRM agentes Isapre Colmena' };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es" suppressHydrationWarning><body>{children}</body></html>;
}