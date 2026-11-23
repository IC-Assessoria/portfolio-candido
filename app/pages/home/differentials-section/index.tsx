'use client'

import SectionTitle from '@/app/components/section-title'
import Reveal from '@/app/components/reveal'
import TiltCard3D from '@/app/components/3d/tilt-card'
import { IC_ASSESSORIA_INFO } from '@/app/data/ic-assessoria'
import { FiCheckCircle } from 'react-icons/fi'

export default function DifferentialsSection() {
  const { differentials } = IC_ASSESSORIA_INFO

  return (
    <section id="diferenciais" className="container py-24 relative">
      <div className="max-w-3xl mb-14">
        <Reveal>
          <SectionTitle
            subtitle="Nossos Princípios"
            title="Diferenciais que balizam a atuação da IC Assessoria"
          />
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Metodologia rigorosa e compromisso técnico com a qualidade dos dados para gerar subsídios reais de aprimoramento na gestão em saúde.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {differentials.map((diff, index) => (
          <Reveal key={diff.number} delay={Math.min(index * 0.08, 0.35)}>
            <TiltCard3D
              maxTilt={8}
              scale={1.02}
              perspective={1000}
              glareMaxOpacity={0.16}
              className="h-full"
            >
              <div className="group h-full p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-white/[0.08] hover:border-orange-500/40 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(249,115,22,0.2)]">
                <div>
                  <div
                    className="flex items-center justify-between mb-5"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    <span className="font-mono text-2xl font-extrabold text-orange-500/80 group-hover:text-orange-400 transition-colors drop-shadow-[0_0_12px_rgba(249,115,22,0.3)]">
                      {diff.number}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-orange-300 bg-orange-950/50 border border-orange-500/30 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.15)]">
                      {diff.highlight}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-bold text-white mb-2.5 group-hover:text-orange-300 transition-colors"
                    style={{ transform: 'translateZ(18px)' }}
                  >
                    {diff.title}
                  </h3>

                  <p
                    className="text-xs sm:text-sm text-slate-300 leading-relaxed"
                    style={{ transform: 'translateZ(14px)' }}
                  >
                    {diff.description}
                  </p>
                </div>

                <div
                  className="pt-5 mt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-slate-400 group-hover:text-slate-300 transition-colors"
                  style={{ transform: 'translateZ(16px)' }}
                >
                  <FiCheckCircle className="text-orange-400 shrink-0" size={14} />
                  <span>Padrão de Excelência IC Assessoria</span>
                </div>
              </div>
            </TiltCard3D>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
