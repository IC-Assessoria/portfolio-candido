import axios from 'axios'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const bodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  subject: z.string().optional(),
  message: z.string().min(1, 'Mensagem é obrigatória'),
})

const WEBHOOK_URL = process.env.WEBHOOK_URL

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = bodySchema.parse(body)

    // Save lead/message to database
    let savedMessage = null
    try {
      savedMessage = await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject: subject || null,
          message,
        },
      })
    } catch (dbError) {
      console.error('[Contact API] Erro ao gravar mensagem no banco:', dbError)
    }

    // If webhook is configured, dispatch notification to Discord
    if (WEBHOOK_URL) {
      try {
        const messageData = {
          embeds: [
            {
              title: 'Nova Mensagem de Contato – IC Assessoria',
              color: 0xf97316, // Orange
              fields: [
                {
                  name: 'Nome',
                  value: name,
                  inline: true,
                },
                {
                  name: 'E-mail',
                  value: email,
                  inline: true,
                },
                {
                  name: 'Instituição / Assunto',
                  value: subject || 'Não informado',
                  inline: false,
                },
                {
                  name: 'Mensagem',
                  value: message,
                },
              ],
              footer: {
                text: 'IC Assessoria – Vigilância e Análise de Dados em Saúde',
              },
              timestamp: new Date().toISOString(),
            },
          ],
        }

        await axios.post(WEBHOOK_URL, messageData, { timeout: 4000 })
      } catch (webhookErr) {
        console.warn('[Contact API] Webhook indisponível ou com falha:', webhookErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso!',
      id: savedMessage?.id,
    })
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json(
      { error: 'Falha ao processar mensagem. Verifique os dados informados.' },
      { status: 400 },
    )
  }
}
