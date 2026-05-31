/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Link, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'

interface Props { token: string }

export const ReauthenticationEmail = ({ token }: Props) => (
  <Html lang="cs" dir="ltr">
    <Head />
    <Preview>Váš ověřovací kód RadoClean</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Ověření identity</Heading>
        <Text style={text}>Pro potvrzení vaší identity použijte následující kód:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Hr style={hr} />
        <Text style={footer}>
          Kód brzy vyprší. Pokud jste o ověření nežádali, tento email ignorujte.<br />
          <Link href="https://radoclean.cz" style={brandLink}>radoclean.cz</Link> · +420 603 425 692
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const codeStyle = { fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 'bold' as const, color: '#16a34a', letterSpacing: '4px', margin: '0 0 24px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center' as const }
const brandLink = { color: '#16a34a', textDecoration: 'none' }
const hr = { borderColor: '#e2e8f0', margin: '32px 0 16px' }
const footer = { fontSize: '12px', color: '#64748b', lineHeight: '1.6', margin: '0' }
