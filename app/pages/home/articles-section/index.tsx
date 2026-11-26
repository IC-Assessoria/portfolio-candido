'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFileText, FiCalendar, FiUser, FiArrowRight, FiX } from 'react-icons/fi'
import SectionTitle from '@/app/components/section-title'
import Reveal from '@/app/components/reveal'
import TiltCard3D from '@/app/components/3d/tilt-card'
import Image from 'next/image'

interface ArticleItem {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImageUrl?: string | null
  author: string
  publishedAt?: Date | string | null
  createdAt: Date | string
}

interface ArticlesSectionProps {
  articles: ArticleItem[]
}

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)

  if (!articles || articles.length === 0) return null

  return (
    <section id="artigos" className="relative py-24 px-4 sm:px-6">
      {/* Background Subtle Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.06),transparent_60%)]"
      />

      <div className="container relative z-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionTitle
              subtitle="Conteúdos & Publicações"
              title="Artigos, análises e informes técnicos em saúde"
            />
            <p className="text-slate-400 text-sm sm:text-base mt-4">
              Acompanhe reflexões, metodologias e orientações técnicas sobre vigilância, monitoramento e qualificação de indicadores em saúde.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => {
            const dateStr = article.publishedAt || article.createdAt
            const formattedDate = dateStr
              ? new Date(dateStr).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : ''

            return (
              <Reveal key={article.id} delay={index * 0.1}>
                <TiltCard3D
                  className="h-full rounded-2xl bg-slate-900/60 border border-white/[0.08] hover:border-orange-500/40 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                  maxTilt={8}
                >
                  <div
                    onClick={() => setSelectedArticle(article)}
                    className="flex flex-col h-full"
                  >
                    {/* Cover Image if available */}
                    {article.coverImageUrl ? (
                      <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
                        <Image
                          src={article.coverImageUrl}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-36 bg-gradient-to-br from-slate-900 via-orange-950/20 to-slate-950 border-b border-white/[0.05] flex items-center justify-center text-orange-400/50">
                        <FiFileText size={42} />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-3">
                          {formattedDate && (
                            <span className="flex items-center gap-1.5">
                              <FiCalendar className="text-orange-400" size={13} />
                              {formattedDate}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <FiUser className="text-slate-500" size={13} />
                            {article.author}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-2 mb-3">
                          {article.title}
                        </h3>

                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-orange-400 group-hover:text-orange-300">
                        <span>Ler publicação</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                      </div>
                    </div>
                  </div>
                </TiltCard3D>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                aria-label="Fechar"
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-3">
                <span className="flex items-center gap-1.5">
                  <FiUser className="text-orange-400" size={13} />
                  {selectedArticle.author}
                </span>
                {selectedArticle.publishedAt && (
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-slate-500" size={13} />
                    {new Date(selectedArticle.publishedAt).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                {selectedArticle.title}
              </h2>

              {selectedArticle.coverImageUrl && (
                <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-6 bg-slate-950">
                  <Image
                    src={selectedArticle.coverImageUrl}
                    alt={selectedArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/20 text-slate-300 text-sm mb-6 italic leading-relaxed">
                {selectedArticle.excerpt}
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all"
                >
                  Fechar Leitura
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
