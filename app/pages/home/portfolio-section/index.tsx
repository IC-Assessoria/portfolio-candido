'use client'

import { FiBriefcase, FiTag, FiCalendar, FiArrowUpRight } from 'react-icons/fi'
import SectionTitle from '@/app/components/section-title'
import Reveal from '@/app/components/reveal'
import TiltCard3D from '@/app/components/3d/tilt-card'
import Image from 'next/image'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  imageUrl?: string | null
  projectDate?: string | null
  order: number
}

interface PortfolioSectionProps {
  portfolio: PortfolioItem[]
}

export default function PortfolioSection({ portfolio }: PortfolioSectionProps) {
  if (!portfolio || portfolio.length === 0) return null

  return (
    <section id="portfolio" className="relative py-24 px-4 sm:px-6">
      <div className="container relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionTitle
              subtitle="Portfólio & Experiências"
              title="Projetos, consultorias e resultados práticos"
            />
            <p className="text-slate-400 text-sm sm:text-base mt-4">
              Conheça iniciativas desenvolvidas na área de vigilância em saúde, estruturação de dados e análises epidemiológicas estratégicas.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.1}>
              <TiltCard3D
                className="h-full rounded-2xl bg-slate-900/60 border border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 overflow-hidden flex flex-col group"
                maxTilt={8}
              >
                <div className="flex flex-col h-full">
                  {item.imageUrl ? (
                    <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-36 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-950 border-b border-white/[0.05] flex items-center justify-center text-amber-400/50">
                      <FiBriefcase size={38} />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-950/40 text-orange-400 border border-orange-500/30">
                          <FiTag size={11} />
                          {item.category}
                        </span>

                        {item.projectDate && (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                            <FiCalendar size={11} className="text-slate-500" />
                            {item.projectDate}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors mb-2.5">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-semibold text-slate-400 group-hover:text-orange-400 transition-colors">
                      <FiBriefcase size={14} className="text-orange-400" />
                      <span>Experiência Institucional</span>
                    </div>
                  </div>
                </div>
              </TiltCard3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
