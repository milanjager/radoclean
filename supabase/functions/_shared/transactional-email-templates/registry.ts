/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as inquiryConfirmation } from './inquiry-confirmation.tsx'
import { template as inquiryAdminNotification } from './inquiry-admin-notification.tsx'
import { template as reservationConfirmation } from './reservation-confirmation.tsx'
import { template as reservationAdminNotification } from './reservation-admin-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'inquiry-confirmation': inquiryConfirmation,
  'inquiry-admin-notification': inquiryAdminNotification,
  'reservation-confirmation': reservationConfirmation,
  'reservation-admin-notification': reservationAdminNotification,
}
