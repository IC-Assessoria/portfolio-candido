import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await authenticateRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('[ADMIN MESSAGES GET ERROR]', error)
    return NextResponse.json(
      { error: 'Erro ao carregar mensagens.' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const session = await authenticateRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, read } = body

    if (!id || typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'ID e status de leitura são obrigatórios.' },
        { status: 400 }
      )
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { read },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[ADMIN MESSAGES PATCH ERROR]', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar mensagem.' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const session = await authenticateRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID da mensagem é obrigatório.' },
        { status: 400 }
      )
    }

    await prisma.contactMessage.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[ADMIN MESSAGES DELETE ERROR]', error)
    return NextResponse.json(
      { error: 'Erro ao excluir mensagem.' },
      { status: 500 }
    )
  }
}
