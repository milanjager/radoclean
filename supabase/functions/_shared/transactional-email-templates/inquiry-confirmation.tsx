import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'RadoClean'

interface Props {
  name?: string
  message?: string
}

const InquiryConfirmationEmail = ({ name, message }: Props) => (
  <Html lang="cs" dir="ltr">
    <Head />
    <Preview>Děkujeme za vaši poptávku — ozveme se vám do 2 hodin</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {name ? `Děkujeme, ${name}!` : 'Děkujeme za vaši poptávku!'}
        </Heading>
        <Text style={text}>
          Vaše zpráva byla úspěšně doručena. Ozveme se vám do 2 hodin
          ve všední dny (Po–Pá 8:00–18:00).
        </Text>

        {message && (
          <Section style={quoteBox}>
            <Text style={quoteLabel}>Vaše zpráva:</Text>
            <Text style={quoteText}>{message}</Text>
          </Section>
        )}

        <Text style={text}>
          Potřebujete nás kontaktovat dříve? Zavolejte nám na{' '}
          <strong>+420 603 425 692</strong>.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          S pozdravem,<br />
          Tým {SITE_NAME}<br />
          <a href="https://radoclean.cz" style={link}>radoclean.cz</a>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InquiryConfirmationEmail,
  subject: 'Potvrzení vaší poptávky — RadoClean',
  displayName: 'Potvrzení poptávky (zákazník)',
  previewData: { name: 'Jan Novák', message: 'Potřebuji uklidit 2kk v Radotíně.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const quoteBox = { backgroundColor: '#f1f5f9', borderLeft: '4px solid #16a34a', padding: '12px 16px', margin: '16px 0', borderRadius: '4px' }
const quoteLabel = { fontSize: '12px', color: '#64748b', textTransform: 'uppercase' as const, margin: '0 0 4px', fontWeight: 'bold' }
const quoteText = { fontSize: '14px', color: '#0f172a', margin: '0', whiteSpace: 'pre-wrap' as const }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '0' }
const link = { color: '#16a34a', textDecoration: 'none' }
