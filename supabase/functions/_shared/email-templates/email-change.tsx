/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'

interface Props {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ oldEmail, newEmail, confirmationUrl }: Props) => (
  <Html lang="cs" dir="ltr">
    <Head />
    <Preview>Potvrďte změnu emailu v RadoClean</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Potvrzení změny emailu</Heading>
        <Text style={text}>
          Požádali jste o změnu emailu v RadoClean z{' '}
          <Link href={`mailto:${oldEmail}`} style={brandLink}>{oldEmail}</Link>{' '}
          na <Link href={`mailto:${newEmail}`} style={brandLink}>{newEmail}</Link>.
        </Text>
        <Button style={button} href={confirmationUrl}>Potvrdit změnu emailu</Button>
        <Hr style={hr} />
        <Text style={footer}>
          Pokud jste o změnu nežádali, okamžitě zabezpečte svůj účet.<br />
          <Link href="https://radoclean.cz" style={brandLink}>radoclean.cz</Link> · +420 603 425 692
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 24px' }
const brandLink = { color: '#16a34a', textDecoration: 'none' }
const button = { backgroundColor: '#16a34a', color: '#ffffff', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '8px', padding: '14px 24px', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e2e8f0', margin: '32px 0 16px' }
const footer = { fontSize: '12px', color: '#64748b', lineHeight: '1.6', margin: '0' }
