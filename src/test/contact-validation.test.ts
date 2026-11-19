import { describe, expect, it } from 'vitest'
import { contactSchema } from '../lib/contact-validation'

describe('contact input', () => {
  const valid = { nome: 'Ana', email: 'ana@example.com', mensagem: 'Contato sobre minha ONG', submissionId: 'd6ba2e9b-59f8-4f23-8940-12531fcb51a1' }
  it('accepts a contact with a stable submission id', () => {
    expect(contactSchema.parse(valid).email).toBe('ana@example.com')
  })
  it('rejects malformed addresses and empty messages', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'invalid' }).success).toBe(false)
    expect(contactSchema.safeParse({ ...valid, mensagem: ' ' }).success).toBe(false)
  })
})