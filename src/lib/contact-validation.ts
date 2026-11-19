import { z } from 'zod'

export const contactSchema = z.object({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  mensagem: z.string().trim().min(1).max(5000),
  submissionId: z.string().uuid(),
})