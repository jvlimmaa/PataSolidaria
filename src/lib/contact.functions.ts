import { createServerFn } from '@tanstack/react-start'
import { contactSchema } from './contact-validation'

export const sendContactMessage = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { sendTemplateEmail } = await import('./email-templates/send-email')
    try {
      return await sendTemplateEmail('contact-message', '', {
        templateData: { nome: data.nome, email: data.email, mensagem: data.mensagem },
        replyTo: data.email,
        idempotencyKey: `contact-message-${data.submissionId}`,
      })
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'domain_not_verified') {
        throw new Error('O envio está aguardando a verificação do domínio. Entre em contato por patasolidariafatec@gmail.com.')
      }
      throw new Error('Não foi possível enviar a mensagem. Tente novamente mais tarde ou escreva para patasolidariafatec@gmail.com.')
    }
  })