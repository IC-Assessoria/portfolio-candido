'use client'

import { HiArrowNarrowRight } from 'react-icons/hi'
import {
  FiActivity,
  FiTrendingUp,
  FiDatabase,
  FiShield,
  FiCheckCircle,
  FiFileText,
} from 'react-icons/fi'
import Button from '@/app/components/button'
import Reveal from '@/app/components/reveal'
import Logo from '@/app/components/brand/logo'
import TiltCard3D from '@/app/components/3d/tilt-card'
import HealthDataGlobe3D from '@/app/components/3d/health-data-globe'
import { IC_ASSESSORIA_INFO } from '@/app/data/ic-assessoria'

export interface HeroSectionProps {
  initialData?: {
    badgeText?: string
    heroTitle?: string
    heroSubtitle?: string
    primaryCtaText?: string
    primaryCtaLink?: string
    secondaryCtaText?: string
    secondaryCtaLink?: string
    statsData?: Array<{ value: string; label: string; highlight: string }> | any
  }
}

export default function HeroSection({ initialData }: HeroSectionProps = {}) {
  const { hero } = IC_ASSESSORIA_INFO

  const badgeText = initialData?.badgeText || hero.badge
  const heroTitle = initialData?.heroTitle || hero.title
  const heroSubtitle = initialData?.heroSubtitle || hero.subtitle
  const primaryCtaText = initialData?.primaryCtaText || 'Fale com a Assessoria'
  const primaryCtaLink = initialData?.primaryCtaLink || '#contato'
  const secondaryCtaText = initialData?.secondaryCtaText || 'Conhecer Serviços'
  const secondaryCtaLink = initialData?.secondaryCtaLink || '#servicos'
  const rawStats = initialData?.statsData
  const stats = Array.isArray(rawStats) && rawStats.length > 0 ? rawStats : hero.stats

  return (
    <section
      id="inicio"
      className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-28 pb-16 lg:py-28 overflow-hidden"
    >
      {/* Ambient Orange & Warm Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-orange-600/15 blur-[140px] rounded-full"
      />

      <div className="container relative z-10 flex items-center justify-between flex-col lg:flex-row gap-12 lg:gap-14">
        {/* Left Column: Presentation, Title, Value Prop, CTAs */}
        <Reveal className="w-full lg:max-w-[620px]">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-orange-950/40 border border-orange-500/35 backdrop-blur-md mb-6 shadow-[0_0_18px_rgba(249,115,22,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="font-mono text-xs font-semibold text-orange-300">
              {badgeText}
            </span>
          </div>

          <div className="mb-4">
            <Logo size="md" showTagline={false} className="mb-3" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.12]">
            {heroTitle}
          </h1>

          <p className="text-slate-300 my-6 text-base sm:text-lg leading-relaxed max-w-xl">
            {heroSubtitle}
          </p>

          {/* Quick Pillars Highlights with 3D elevation */}
          <div className="grid grid-cols-3 gap-3 py-4 my-6 border-y border-white/[0.08] max-w-lg">
            {stats.map((stat: any, i: number) => (
              <div
                key={stat.label || i}
                className={`flex flex-col transition-all duration-300 hover:-translate-y-1 hover:text-orange-200 cursor-default ${
                  i !== 0 ? 'border-l border-white/[0.08] pl-3.5 sm:pl-4' : ''
                }`}
              >
                <span className="font-bold text-white text-base sm:text-lg flex items-center gap-1">
                  {stat.value}
                </span>
                <span className="text-xs text-orange-400/90 font-medium mt-0.5">
                  {stat.label}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                  {stat.highlight}
                </span>
              </div>
            ))}
          </div>

          {/* Area Badges */}
          <div className="flex flex-wrap gap-2 max-w-lg mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-slate-300 hover:border-orange-500/40 hover:-translate-y-0.5 transition-all">
              <FiActivity className="text-orange-400" size={13} />
              Vigilância em Saúde
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-slate-300 hover:border-orange-500/40 hover:-translate-y-0.5 transition-all">
              <FiTrendingUp className="text-orange-400" size={13} />
              Monitoramento de Indicadores
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-slate-300 hover:border-orange-500/40 hover:-translate-y-0.5 transition-all">
              <FiDatabase className="text-orange-400" size={13} />
              Qualificação de Dados
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a href={primaryCtaLink}>
              <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all">
                <span>{primaryCtaText}</span>
                <HiArrowNarrowRight size={18} />
              </Button>
            </a>

            <a href={secondaryCtaLink}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto hover:-translate-y-0.5 transition-all">
                <FiFileText size={16} className="text-orange-400" />
                <span>{secondaryCtaText}</span>
              </Button>
            </a>
          </div>
        </Reveal>

        {/* Right Column: 3D Interactive Situational Health Intelligence Showcase */}
        <Reveal delay={0.15} className="relative w-full lg:w-auto shrink-0 flex items-center justify-center">
          {/* Ambient Glow behind card */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-orange-600/30 via-amber-500/20 to-transparent blur-3xl opacity-80 pointer-events-none"
          />

          {/* Interactive 3D Tilt Card */}
          <TiltCard3D
            maxTilt={10}
            scale={1.02}
            perspective={1100}
            enableGlare={true}
            glareMaxOpacity={0.22}
            className="w-full max-w-[450px]"
          >
            <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white/[0.09] via-slate-900/85 to-[#07080c] border border-white/10 backdrop-blur-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.15)] overflow-hidden">
              {/* Header of showcase card - floats at Z:24px */}
              <div
                className="flex items-center justify-between pb-4 border-b border-white/[0.08]"
                style={{ transform: 'translateZ(24px)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                    <FiActivity size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Painel Situacional de Saúde
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Monitoramento Estratégico Contínuo
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SISTEMA ATIVO
                </span>
              </div>

              {/* Central 3D Globe Visualizer - floats at Z:35px */}
              <div
                className="my-3 py-2 flex items-center justify-center"
                style={{ transform: 'translateZ(35px)' }}
              >
                <HealthDataGlobe3D size={250} />
              </div>

              {/* Simulated Live Analytics Gauges - floats at Z:28px */}
              <div
                className="grid grid-cols-2 gap-3 mb-4"
                style={{ transform: 'translateZ(28px)' }}
              >
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/30 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Qualidade da Base</span>
                    <FiCheckCircle className="text-emerald-400" size={13} />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    98.4<span className="text-orange-400 text-sm">%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Consistência validada</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-orange-500/30 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Metas Pactuadas</span>
                    <FiTrendingUp className="text-orange-400" size={13} />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    100<span className="text-orange-400 text-sm">%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Monitoramento em dia</p>
                </div>
              </div>

              {/* Key Focus Lines - floats at Z:20px */}
              <div
                className="space-y-2.5"
                style={{ transform: 'translateZ(20px)' }}
              >
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-orange-950/30 border border-orange-500/20">
                  <div className="flex items-center gap-2 text-slate-200">
                    <FiShield className="text-orange-400" size={14} />
                    <span>Vigilância Epidemiológica</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-orange-300">
                    Oportuna
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FiDatabase className="text-orange-400" size={14} />
                    <span>Sistemas de Informação</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Integrados
                  </span>
                </div>
              </div>

              {/* Card Footer Badge - floats at Z:22px */}
              <div
                className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between"
                style={{ transform: 'translateZ(22px)' }}
              >
                <span className="text-[11px] text-slate-400">
                  Responsável Técnico:
                </span>
                <span className="text-xs font-semibold text-orange-300 font-mono">
                  Antônio Cândido
                </span>
              </div>
            </div>
          </TiltCard3D>
        </Reveal>
      </div>
    </section>
  )
}
