import type { Metadata } from 'next'
import { Inter, Chakra_Petch, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ConsoleLog } from '@/components/ConsoleLog'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PROJECT GHOST // PROTOCOL.EXE',
  description: 'Elons of AI — CRO Intelligence Platform',
  robots: 'noindex',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${chakraPetch.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="bg-obsidian text-bone font-sans font-light antialiased overflow-hidden h-full">
        <div className="dot-grid fixed inset-0 pointer-events-none" aria-hidden />
        <div className="relative h-full flex flex-col">
          {children}
          <ConsoleLog />
        </div>
      </body>
    </html>
  )
}
