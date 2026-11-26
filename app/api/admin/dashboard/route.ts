import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await authenticateRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const [
      servicesCount,
      servicesPublishedCount,
      articlesCount,
      articlesPublishedCount,
      projectsCount,
      projectsPublishedCount,
      mediaCount,
      messagesCount,
      unreadMessagesCount,
      recentServices,
      recentArticles,
      recentMessages,
    ] = await Promise.all([
      prisma.service.count(),
      prisma.service.count({ where: { published: true } }),
      prisma.article.count(),
      prisma.article.count({ where: { published: true } }),
      prisma.portfolioProject.count(),
      prisma.portfolioProject.count({ where: { published: true } }),
      prisma.media.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.service.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, updatedAt: true, published: true },
      }),
      prisma.article.findMany({
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, updatedAt: true, published: true },
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return NextResponse.json({
      counts: {
        services: servicesCount,
        servicesPublished: servicesPublishedCount,
        articles: articlesCount,
        articlesPublished: articlesPublishedCount,
        projects: projectsCount,
        projectsPublished: projectsPublishedCount,
        media: mediaCount,
        messages: messagesCount,
        unreadMessages: unreadMessagesCount,
      },
      recentMessages,
      recentActivity: [
        ...recentServices.map((s) => ({
          id: s.id,
          type: 'Serviço',
          title: s.title,
          updatedAt: s.updatedAt,
          published: s.published,
          editUrl: `/admin/services/${s.id}`,
        })),
        ...recentArticles.map((a) => ({
          id: a.id,
          type: 'Publicação',
          title: a.title,
          updatedAt: a.updatedAt,
          published: a.published,
          editUrl: `/admin/articles/${a.id}`,
        })),
      ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    })
  } catch (error: any) {
    console.error('[DASHBOARD ERROR]', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dados do dashboard.' },
      { status: 500 }
    )
  }
}
