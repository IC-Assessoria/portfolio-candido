'use client'

import {
  FiActivity,
  FiTrendingUp,
  FiCheckSquare,
  FiDatabase,
  FiFileText,
  FiTarget,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi'
import SectionTitle from '@/app/components/section-title'
import Reveal from '@/app/components/reveal'
import TiltCard3D from '@/app/components/3d/tilt-card'
import { IC_ASSESSORIA_INFO } from '@/app/data/ic-assessoria'

const ICON_MAP: Record<string, React.ReactNode> = {
  FiActivity: <FiActivity size={22} />,
  FiTrendingUp: <FiTrendingUp size={22} />,
  FiCheckSquare: <FiCheckSquare size={22} />,
  FiDatabase: <FiDatabase size={22} />,
  FiFileText: <FiFileText size={22} />,
  FiTarget: <FiTarget size={22} />,
}

export interface ServicesSectionProps {
  initialData?: Array<{
    id: string
    title: string
    shortDescription?: string
    description: string
    iconName?: string
    deliverables?: any
  }>
}

export default function ServicesSection({ initialData }: ServicesSectionProps = {}) {
  const { services: defaultServices } = IC_ASSESSORIA_INFO
  const services = initialData && initialData.length > 0 ? initialData : defaultServices

  return (
    <section id="servicos" className="container py-24 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <Reveal>
          <SectionTitle
            subtitle="Áreas de Atuação"
            title="Serviços e Soluções Especializadas"
          />
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mt-3 leading-relaxed">
            Assessoria técnica orientada para apoiar gestores e equipes na transformação de dados em instrumentos eficazes de planejamento, monitoramento e tomada de decisão.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href="#contato"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors group"
          >
            <span>Consultar disponibilidade</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </Reveal>
      </div>

      {/* Grid of 3D Tilt Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const deliverablesList: string[] = Array.isArray(service.deliverables)
            ? service.deliverables
            : typeof service.deliverables === 'string'
            ? JSON.parse(service.deliverables || '[]')
            : []

          return (
            <Reveal key={service.id} delay={Math.min(index * 0.08, 0.35)}>
              <TiltCard3D
                maxTilt={8}
                scale={1.02}
                perspective={1000}
                glareMaxOpacity={0.16}
                className="h-full"
              >
                <div className="group relative h-full flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-white/[0.08] hover:border-orange-500/40 hover:bg-slate-900/90 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_25px_-5px_rgba(249,115,22,0.25)]">
                  <div>
                    {/* Top Icon Badge - floats at Z:28px */}
                    <div
                      className="flex items-center justify-between mb-5"
                      style={{ transform: 'translateZ(28px)' }}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-105 group-hover:border-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                        {ICON_MAP[service.iconName || ''] || <FiActivity size={22} />}
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-500 group-hover:text-orange-400 transition-colors">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Title - floats at Z:20px */}
                    <h3
                      className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors"
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      {service.title}
                    </h3>

                    {/* Description - floats at Z:14px */}
                    <p
                      className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6"
                      style={{ transform: 'translateZ(14px)' }}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Deliverables / Scope - floats at Z:16px */}
                  {deliverablesList.length > 0 && (
                    <div
                      className="pt-4 border-t border-white/[0.06] space-y-2"
                      style={{ transform: 'translateZ(16px)' }}
                    >
                      <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-1.5">
                        Escopo de Apoio Técnico:
                      </p>
                      {deliverablesList.map((item) => (
                        <div key={item} className="flex items-start gap-2 text-xs text-slate-400">
                          <FiCheck className="text-orange-400 shrink-0 mt-0.5" size={13} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard3D>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
