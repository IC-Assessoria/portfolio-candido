import localFont from 'next/font/local'
import { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import AppToaster from './components/toaster'
import { getSiteSettings } from '@/lib/data'

const inter = localFont({
  src: [
    {
      path: './fonts/inter-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/inter-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/inter-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
})

const plexMono = localFont({
  src: [
    {
      path: './fonts/ibm-plex-mono-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/ibm-plex-mono-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-plex-mono',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const title =
    settings.seoTitle ||
    `${settings.siteName} – ${settings.tagline} | Antônio Cândido`
  const description =
    settings.seoDescription ||
    'Fortalecimento da gestão em saúde por meio da qualificação, organização, monitoramento e análise de informações estratégicas. Assessoria técnica por Antônio Cândido.'
  const keywords = settings.seoKeywords
    ? settings.seoKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : [
        'IC Assessoria',
        'Antônio Cândido',
        'Vigilância em Saúde',
        'Análise de Dados em Saúde',
        'Monitoramento de Indicadores',
        'Gestão em Saúde',
        'Sistemas de Informação em Saúde',
        'Qualificação de Dados',
      ]

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Antônio Cândido' }],
    icons: {
      icon: settings.faviconUrl || '/favicon.svg',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
    },
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans relative bg-slate-950 text-slate-100 selection:bg-orange-500/30 selection:text-orange-100">
        <AppToaster />
        {children}
      </body>
    </html>
  )
}
