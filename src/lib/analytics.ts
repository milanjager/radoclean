// Google Analytics 4 helper functions

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
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
};

// Track phone click
export const trackPhoneClick = () => {
  trackEvent('phone_click', {
    event_category: 'engagement',
    event_label: 'header_phone',
  });
};

// Track email click
export const trackEmailClick = () => {
  trackEvent('email_click', {
    event_category: 'engagement',
    event_label: 'contact_email',
  });
};
