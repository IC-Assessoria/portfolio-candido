'use client'

import { useEffect, useState } from 'react'
import AdminGuard from '../components/admin-guard'
import {
  FiMail,
  FiCheckCircle,
  FiCircle,
  FiTrash2,
  FiExternalLink,
  FiRefreshCw,
  FiSearch,
  FiClock,
  FiMessageSquare,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const loadMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      } else {
        toast.error('Erro ao carregar mensagens.')
      }
    } catch {
      toast.error('Erro de conexão ao carregar mensagens.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const toggleRead = async (msg: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const newStatus = !msg.read
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, read: newStatus }),
      })
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: newStatus } : m))
        )
        if (selectedMessage?.id === msg.id) {
          setSelectedMessage((prev) => (prev ? { ...prev, read: newStatus } : null))
        }
        toast.success(newStatus ? 'Marcada como lida.' : 'Marcada como não lida.')
      }
    } catch {
      toast.error('Erro ao atualizar status.')
    }
  }

  const deleteMessage = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!confirm('Deseja realmente excluir esta mensagem?')) return

    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        if (selectedMessage?.id === id) setSelectedMessage(null)
        toast.success('Mensagem excluída com sucesso.')
      } else {
        toast.error('Falha ao excluir mensagem.')
      }
    } catch {
      toast.error('Erro de conexão ao excluir.')
    }
  }

  const filtered = messages.filter((m) => {
    if (filter === 'unread' && m.read) return false
    if (filter === 'read' && !m.read) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject && m.subject.toLowerCase().includes(q)) ||
      m.message.toLowerCase().includes(q)
    )
  })

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <AdminGuard>
      <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">
                Leads e Contatos
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Mensagens Recebidas
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Acompanhe as solicitações de assessoria e contatos enviados através do formulário do site.
            </p>
          </div>

          <button
            onClick={loadMessages}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium border border-white/10 transition-all w-max"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={14} />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-900/60 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              Todas ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'unread'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-900/60 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              Não lidas ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filter === 'read'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-900/60 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              Lidas ({messages.length - unreadCount})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/70 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Messages List / Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            <FiRefreshCw className="animate-spin inline-block mr-2" />
            Carregando mensagens...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-slate-900/30 border border-white/[0.06] p-8">
            <FiMail size={40} className="mx-auto text-slate-600 mb-3" />
            <h3 className="text-white font-semibold text-base mb-1">Nenhuma mensagem encontrada</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              {search
                ? 'Nenhuma mensagem corresponde aos termos da busca.'
                : 'Quando alguém preencher o formulário no site público, a mensagem aparecerá aqui.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg)
                  if (!msg.read) toggleRead(msg)
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !msg.read
                    ? 'bg-orange-950/20 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.06)]'
                    : 'bg-slate-900/50 border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={(e) => toggleRead(msg, e)}
                    title={msg.read ? 'Marcar como não lida' : 'Marcar como lida'}
                    className="mt-1 text-slate-500 hover:text-orange-400 transition-colors"
                  >
                    {msg.read ? (
                      <FiCheckCircle size={18} className="text-emerald-500" />
                    ) : (
                      <FiCircle size={18} className="text-orange-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-white text-sm">
                        {msg.name}
                      </h3>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                      )}
                      <span className="text-xs text-slate-500">
                        {msg.email}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-orange-400 mb-1">
                      {msg.subject || 'Sem assunto especificado'}
                    </p>

                    <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Contato IC Assessoria')}`}
                    onClick={(e) => e.stopPropagation()}
                    title="Responder por E-mail"
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 transition-all text-xs"
                  >
                    <FiMail size={14} />
                  </a>

                  <button
                    onClick={(e) => deleteMessage(msg.id, e)}
                    title="Excluir mensagem"
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all text-xs"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono text-orange-400">
                    Detalhes do Contato
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {selectedMessage.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedMessage.email}
                  </p>
                </div>

                <span className="text-xs font-mono text-slate-500">
                  {new Date(selectedMessage.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>

              {selectedMessage.subject && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Instituição / Assunto</span>
                  <p className="text-sm font-semibold text-white bg-slate-950/60 p-3 rounded-xl border border-white/[0.06]">
                    {selectedMessage.subject}
                  </p>
                </div>
              )}

              <div>
                <span className="text-xs text-slate-500 block mb-1">Mensagem</span>
                <p className="text-sm text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-white/[0.06] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => toggleRead(selectedMessage)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {selectedMessage.read ? 'Marcar como não lida' : 'Marcar como lida'}
                </button>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Contato IC Assessoria')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg shadow-orange-500/20 transition-all"
                  >
                    <FiMail size={14} />
                    <span>Responder por E-mail</span>
                  </a>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-medium border border-white/10 transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}
