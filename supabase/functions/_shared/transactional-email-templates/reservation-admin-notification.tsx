import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Img,
} from 'npm:@react-email/components@0.0.22'

const LOGO_URL = 'https://radoclean.cz/rado-clean-logo.png'
import type { TemplateEntry } from './registry.ts'

interface Extra { label?: string }

interface Props {
  name?: string
  email?: string
  phone?: string
  packageType?: string
  formattedDate?: string
  preferredTime?: string
  address?: string
  city?: string
  postalCode?: string
  extras?: Extra[]
  totalPrice?: number
  notes?: string
}

const ReservationAdminNotification = ({
  name, email, phone, packageType, formattedDate, preferredTime,
  address, city, postalCode, extras, totalPrice, notes,
}: Props) => (
  <Html lang="cs" dir="ltr">
    <Head />
    <Preview>Nová rezervace od {name || 'zákazníka'} — {formattedDate}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="RadoClean" width="160" height="auto" style={{ margin: '0 0 20px', display: 'block' }} />
        <Heading style={h1}>🔔 Nová rezervace z webu</Heading>

        <Section style={infoBox}>
          <Text style={row}><strong>Jméno:</strong> {name || '—'}</Text>
          <Text style={row}><strong>Email:</strong>{' '}
            <a href={`mailto:${email}`} style={link}>{email || '—'}</a>
          </Text>
          <Text style={row}><strong>Telefon:</strong>{' '}
            <a href={`tel:${phone}`} style={link}>{phone || '—'}</a>
          </Text>
        </Section>

        <Section style={card}>
          <Text style={cardTitle}>📋 Detaily úklidu</Text>
          <Text style={row}><strong>Balíček:</strong> {packageType || '—'}</Text>
          <Text style={row}><strong>Datum:</strong> {formattedDate || '—'}</Text>
          <Text style={row}><strong>Čas:</strong> {preferredTime || '—'}</Text>
          <Text style={row}><strong>Adresa:</strong> {address || '—'}{city ? `, ${city}` : ''}{postalCode ? `, ${postalCode}` : ''}</Text>
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

        {notes && (
          <Section style={card}>
            <Text style={cardTitle}>📝 Poznámka</Text>
            <Text style={row}>{notes}</Text>
          </Section>
        )}

        <Hr style={hr} />
        <Text style={footer}>
          Potvrďte rezervaci se zákazníkem co nejdříve.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ReservationAdminNotification,
  subject: (data: Record<string, any>) =>
    `Nová rezervace od ${data?.name || 'zákazníka'} — ${data?.formattedDate || ''}`,
  displayName: 'Nová rezervace (admin)',
  to: 'veronika@radoclean.cz',
  previewData: {
    name: 'Jan Novák',
    email: 'jan@example.cz',
    phone: '+420 739 580 935',
    packageType: 'Generální úklid - medium',
    formattedDate: 'pondělí 8. června 2026',
    preferredTime: '10:00 - 12:00',
    address: 'Veazska 1',
    city: 'Černošice',
    postalCode: '12345',
    extras: [{ label: 'Vyčištění trouby a grilu' }],
    totalPrice: 5285,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 20px' }
const infoBox = { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px', margin: '0 0 16px' }
const card = { backgroundColor: '#f8fafc', borderLeft: '4px solid #16a34a', padding: '14px 16px', margin: '0 0 16px', borderRadius: '4px' }
const cardTitle = { fontSize: '14px', fontWeight: 'bold', color: '#16a34a', margin: '0 0 10px' }
const row = { fontSize: '14px', color: '#0f172a', margin: '0 0 6px', lineHeight: '1.5' }
const price = { fontSize: '22px', fontWeight: 'bold', color: '#16a34a', margin: '0' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#64748b', margin: '0' }
const link = { color: '#16a34a', textDecoration: 'none' }
