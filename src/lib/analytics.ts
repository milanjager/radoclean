// Google Analytics 4 + Microsoft Clarity helper functions

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (
  eventName: string,
  parameters?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Microsoft Clarity — send custom event for conversion goals
export const trackClarityEvent = (eventName: string) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', eventName);
  }
};

// Track reservation form submission
export const trackReservationConversion = (
  packageType: string,
  totalPrice: number,
  extras?: string[]
) => {
  trackEvent('generate_lead', {
    currency: 'CZK',
    value: totalPrice,
  });

  trackEvent('reservation_submitted', {
    package_type: packageType,
    total_price: totalPrice,
    extras: extras?.join(', ') || 'none',
    currency: 'CZK',
  });

  trackClarityEvent('reservation_submitted');
};

// Track reservation form start
export const trackReservationStart = (packageType: string) => {
  trackEvent('begin_checkout', {
    package_type: packageType,
  });
};

// Track contact form submission
export const trackContactSubmission = () => {
  trackEvent('contact_form_submitted');
  trackClarityEvent('inquiry_submitted');
};

// Track phone click
export const trackPhoneClick = () => {
  trackEvent('phone_click', {
    event_category: 'engagement',
    event_label: 'header_phone',
  });
  trackClarityEvent('phone_click');
};

// Track email click
export const trackEmailClick = () => {
  trackEvent('email_click', {
    event_category: 'engagement',
    event_label: 'contact_email',
  });
  trackClarityEvent('email_click');
};

// Track reservation CTA button clicks (before form fill)
export const trackReservationCTAClick = (location: string) => {
  trackEvent('reservation_cta_click', {
    event_category: 'engagement',
    event_label: location,
  });
  trackClarityEvent('reservation_cta_click');
};
