import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  phone?: string
  message?: string
}

const InquiryAdminNotification = ({ name, email, phone, message }: Props) => (
  <Html lang="cs" dir="ltr">
    <Head />
    <Preview>Nová poptávka od {name || 'zákazníka'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔔 Nová poptávka z webu</Heading>

        <Section style={infoBox}>
          <Text style={row}><strong>Jméno:</strong> {name || '—'}</Text>
          <Text style={row}><strong>Email:</strong>{' '}
            <a href={`mailto:${email}`} style={link}>{email || '—'}</a>
          </Text>
          <Text style={row}><strong>Telefon:</strong>{' '}
            <a href={`tel:${phone}`} style={link}>{phone || '—'}</a>
          </Text>
        </Section>

        <Text style={label}>Zpráva:</Text>
        <Section style={quoteBox}>
          <Text style={quoteText}>{message || '—'}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Odpovězte zákazníkovi do 2 hodin pro maximální konverzi.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InquiryAdminNotification,
  subject: (data: Record<string, any>) =>
    `Nová poptávka od ${data?.name || 'zákazníka'}`,
  displayName: 'Nová poptávka (admin)',
  to: 'veronika@radoclean.cz',
  previewData: {
    name: 'Jan Novák',
    email: 'jan@example.cz',
    phone: '+420 603 425 692',
    message: 'Potřebuji uklidit 2kk v Radotíně.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px' }
const infoBox = { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px', margin: '0 0 20px' }
const row = { fontSize: '14px', color: '#0f172a', margin: '0 0 8px', lineHeight: '1.5' }
const label = { fontSize: '13px', color: '#64748b', textTransform: 'uppercase' as const, fontWeight: 'bold', margin: '0 0 8px' }
const quoteBox = { backgroundColor: '#f1f5f9', borderLeft: '4px solid #16a34a', padding: '12px 16px', margin: '0 0 16px', borderRadius: '4px' }
const quoteText = { fontSize: '14px', color: '#0f172a', margin: '0', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#64748b', margin: '0' }
const link = { color: '#16a34a', textDecoration: 'none' }
