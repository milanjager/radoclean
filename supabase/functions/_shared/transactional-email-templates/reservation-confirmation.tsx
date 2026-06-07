import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'RadoClean'

interface Extra { label?: string }

interface Props {
  name?: string
  packageType?: string
  formattedDate?: string
  preferredTime?: string
  address?: string
  city?: string
  extras?: Extra[]
  totalPrice?: number
  phone?: string
}

const ReservationConfirmationEmail = ({
  name, packageType, formattedDate, preferredTime, address, city, extras, totalPrice, phone,
}: Props) => (
  <Html lang="cs" dir="ltr">
    <Head />
    <Preview>Potvrzení rezervace úklidu — {formattedDate}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>✨ Děkujeme za rezervaci{name ? `, ${name}` : ''}!</Heading>
        <Text style={text}>
          Vaše rezervace byla úspěšně přijata. Níže najdete shrnutí detailů.
        </Text>

        <Section style={card}>
          <Text style={cardTitle}>📋 Detaily rezervace</Text>
          <Text style={row}><strong>Balíček:</strong> {packageType || '—'}</Text>
          <Text style={row}><strong>Datum:</strong> {formattedDate || '—'}</Text>
          <Text style={row}><strong>Čas:</strong> {preferredTime || '—'}</Text>
          <Text style={row}><strong>Adresa:</strong> {address || '—'}{city ? `, ${city}` : ''}</Text>
        </Section>

        {Array.isArray(extras) && extras.length > 0 && (
          <Section style={card}>
            <Text style={cardTitle}>🎁 Přídavné služby</Text>
            {extras.map((e, i) => (
              <Text key={i} style={row}>• {e?.label ?? ''}</Text>
            ))}
          </Section>
        )}

        <Section style={card}>
          <Text style={cardTitle}>💰 Celková cena</Text>
          <Text style={price}>{Number(totalPrice ?? 0).toLocaleString('cs-CZ')} Kč</Text>
        </Section>

        <Text style={text}>
          Brzy vás budeme kontaktovat{phone ? ` na čísle ${phone}` : ''} pro potvrzení termínu.
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
  component: ReservationConfirmationEmail,
  subject: 'Potvrzení rezervace úklidu — RadoClean',
  displayName: 'Potvrzení rezervace (zákazník)',
  previewData: {
    name: 'Jan Novák',
    packageType: 'Generální úklid - medium',
    formattedDate: 'pondělí 8. června 2026',
    preferredTime: '10:00 - 12:00',
    address: 'Veazska 1',
    city: 'Černošice',
    extras: [{ label: 'Vyčištění trouby a grilu' }],
    totalPrice: 5285,
    phone: '+420 739 580 935',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f8fafc', borderLeft: '4px solid #16a34a', padding: '14px 16px', margin: '0 0 16px', borderRadius: '4px' }
const cardTitle = { fontSize: '14px', fontWeight: 'bold', color: '#16a34a', margin: '0 0 10px' }
const row = { fontSize: '14px', color: '#0f172a', margin: '0 0 6px', lineHeight: '1.5' }
const price = { fontSize: '22px', fontWeight: 'bold', color: '#16a34a', margin: '0' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '0' }
const link = { color: '#16a34a', textDecoration: 'none' }
