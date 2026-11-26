'use client'

import { FiArrowUp, FiMail, FiMessageSquare, FiLinkedin, FiInstagram } from 'react-icons/fi'
import Logo from '@/app/components/brand/logo'
import { IC_ASSESSORIA_INFO } from '@/app/data/ic-assessoria'

interface FooterProps {
  contactSettings?: {
    whatsapp?: string
    email?: string
    linkedin?: string
    instagram?: string
  } | null
  siteSettings?: {
    siteName?: string
    tagline?: string
  } | null
}

export default function Footer({ contactSettings, siteSettings }: FooterProps = {}) {
  const { brand, contact: defaultContact } = IC_ASSESSORIA_INFO

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  const rawPhone = contactSettings?.whatsapp ? contactSettings.whatsapp.replace(/\D/g, '') : ''
  const whatsappHref = rawPhone
    ? rawPhone.startsWith('55')
      ? `https://wa.me/${rawPhone}`
      : `https://wa.me/55${rawPhone}`
    : defaultContact.channels[0].href

  const emailHref = contactSettings?.email ? `mailto:${contactSettings.email}` : defaultContact.channels[1].href

  const linkedinHref = contactSettings?.linkedin
    ? contactSettings.linkedin.startsWith('http')
      ? contactSettings.linkedin
      : `https://${contactSettings.linkedin}`
    : defaultContact.channels[2].href

  const instagramHref = contactSettings?.instagram
    ? contactSettings.instagram.startsWith('http')
      ? contactSettings.instagram
      : `https://instagram.com/${contactSettings.instagram.replace(/^@/, '')}`
    : null

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#07080c] pt-16 pb-12 overflow-hidden">
      {/* Top ambient orange line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
      />

      <div className="container flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
            <Logo size="md" />
            <p className="text-sm text-slate-400 max-w-lg mt-1">
              Assessoria técnica especializada em vigilância em saúde, monitoramento de indicadores, qualificação de bases de dados e apoio à gestão orientada por evidências.
            </p>
            <p className="text-xs text-orange-400/90 font-mono">
              Responsável Técnico: {brand.responsible}
            </p>
          </div>

          {/* Navigation Links in Footer */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <a href="#inicio" className="hover:text-orange-400 transition-colors">
              Início
            </a>
            <a href="#sobre" className="hover:text-orange-400 transition-colors">
              Sobre
            </a>
            <a href="#servicos" className="hover:text-orange-400 transition-colors">
              Serviços
            </a>
            <a href="#importancia-dados" className="hover:text-orange-400 transition-colors">
              Dados na Saúde
            </a>
            <a href="#diferenciais" className="hover:text-orange-400 transition-colors">
              Diferenciais
            </a>
            <a href="#portfolio" className="hover:text-orange-400 transition-colors">
              Portfólio
            </a>
            <a href="#artigos" className="hover:text-orange-400 transition-colors">
              Publicações
            </a>
            <a href="#contato" className="hover:text-orange-400 transition-colors">
              Contato
            </a>
          </div>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              <FiMessageSquare size={18} />
            </a>
            <a
              href={emailHref}
              aria-label="E-mail"
              className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 hover:text-orange-400 hover:border-orange-500/40 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
            >
              <FiMail size={18} />
            </a>
            <a
              href={linkedinHref}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 hover:text-sky-400 hover:border-sky-500/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
            >
              <FiLinkedin size={18} />
            </a>
            {instagramHref && (
              <a
                href={instagramHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 hover:text-pink-400 hover:border-pink-500/40 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all"
              >
                <FiInstagram size={18} />
              </a>
            )}

            <button
              onClick={scrollToTop}
              aria-label="Voltar ao topo"
              className="group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-950/30 transition-all duration-300"
            >
              <span>Topo</span>
              <FiArrowUp className="group-hover:-translate-y-0.5 transition-transform" size={14} />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-white/[0.05]" />

        <div className="flex flex-col items-center justify-center text-center text-xs text-slate-400 space-y-3 pt-2">
          <p>© 2026 IC Assessoria – Vigilância e Análise de Dados em Saúde.</p>
          <p>Todos os direitos reservados.</p>
          <p className="text-slate-300">
            Desenvolvido por{' '}
            <span className="text-orange-400 font-medium">Ednario Andrade</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
