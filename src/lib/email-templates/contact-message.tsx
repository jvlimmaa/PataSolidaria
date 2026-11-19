import { Body, Container, Head, Heading, Html, Preview, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props { nome?: string; email?: string; mensagem?: string }
function ContactMessage({ nome = 'Visitante', email = '', mensagem = '' }: Props) {
  return <Html lang="pt-BR"><Head /><Preview>Nova mensagem de {nome}</Preview><Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}><Container style={{ padding: '24px', maxWidth: '560px' }}><Heading>Pata Solidária</Heading><Text>Nova mensagem pelo site</Text><Text>Nome: {nome}<br />E-mail: {email}</Text><Text style={{ whiteSpace: 'pre-wrap' }}>{mensagem}</Text></Container></Body></Html>
}
export const template = {
  component: ContactMessage,
  subject: 'Nova mensagem pelo site — Pata Solidária',
  displayName: 'Contato com a equipe',
  to: 'patasolidariafatec@gmail.com',
  previewData: { nome: 'Visitante de exemplo', email: 'visitante@example.com', mensagem: 'Gostaria de conhecer o sistema para minha ONG.' },
} satisfies TemplateEntry