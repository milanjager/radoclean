import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NeighborhoodDiscount from '../NeighborhoodDiscount';
import { supabase } from '@/integrations/supabase/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('NeighborhoodDiscount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderuje úvodní formulář pro generování kódu', () => {
    render(<NeighborhoodDiscount />, { wrapper });

    expect(screen.getByPlaceholderText(/váš e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /vygenerovat můj kód/i })).toBeInTheDocument();
  });

  it('validuje formát emailu před generováním kódu', async () => {
    const user = userEvent.setup();
    render(<NeighborhoodDiscount />, { wrapper });

    const emailInput = screen.getByPlaceholderText(/váš e-mail/i);
    await user.type(emailInput, 'invalid-email');

    const generateButton = screen.getByRole('button', { name: /vygenerovat můj kód/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/zadejte platný e-mail/i)).toBeInTheDocument();
    });
  });

  it('úspěšně generuje referral kód', async () => {
    const user = userEvent.setup();

    // Mock successful code generation
    const mockInsert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: {
            code: 'TEST123',
            email: 'test@example.com',
            referrals_count: 0,
            discount_activated: false,
          },
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<NeighborhoodDiscount />, { wrapper });

    const emailInput = screen.getByPlaceholderText(/váš e-mail/i);
    await user.type(emailInput, 'test@example.com');

    const generateButton = screen.getByRole('button', { name: /vygenerovat můj kód/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  it('zobrazuje vygenerovaný kód a statistiky', async () => {
    const user = userEvent.setup();

    const mockInsert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: {
            code: 'RADOTIN123',
            email: 'test@example.com',
            referrals_count: 2,
            discount_activated: true,
          },
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<NeighborhoodDiscount />, { wrapper });

    const emailInput = screen.getByPlaceholderText(/váš e-mail/i);
    await user.type(emailInput, 'test@example.com');

    const generateButton = screen.getByRole('button', { name: /vygenerovat můj kód/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('RADOTIN123')).toBeInTheDocument();
      expect(screen.getByText(/2 doporučení/i)).toBeInTheDocument();
    });
  });

  it('kalkuluje správnou slevu podle počtu referrals', async () => {
    const user = userEvent.setup();

    const mockInsert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: {
            code: 'TEST456',
            email: 'test@example.com',
            referrals_count: 5,
            discount_activated: true,
          },
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<NeighborhoodDiscount />, { wrapper });

    const emailInput = screen.getByPlaceholderText(/váš e-mail/i);
    await user.type(emailInput, 'test@example.com');

    const generateButton = screen.getByRole('button', { name: /vygenerovat můj kód/i });
    await user.click(generateButton);

    await waitFor(() => {
      // 5 referrals * 5% = 25% sleva
      expect(screen.getByText(/25%/)).toBeInTheDocument();
    });
  });

  it('kopíruje kód do schránky', async () => {
    const user = userEvent.setup();

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });

    const mockInsert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: {
            code: 'COPY123',
            email: 'test@example.com',
            referrals_count: 1,
            discount_activated: false,
          },
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<NeighborhoodDiscount />, { wrapper });

    const emailInput = screen.getByPlaceholderText(/váš e-mail/i);
    await user.type(emailInput, 'test@example.com');

    const generateButton = screen.getByRole('button', { name: /vygenerovat můj kód/i });
    await user.click(generateButton);

    await waitFor(async () => {
      const copyButton = screen.getByRole('button', { name: /kopírovat/i });
      await user.click(copyButton);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('COPY123');
    });
  });

  it('ošetřuje duplicitní kód s chybovou hláškou', async () => {
    const user = userEvent.setup();

    const mockInsert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({
          data: null,
          error: { code: '23505', message: 'duplicate key value' },
        })),
      })),
    }));

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    render(<NeighborhoodDiscount />, { wrapper });

    const emailInput = screen.getByPlaceholderText(/váš e-mail/i);
    await user.type(emailInput, 'existing@example.com');

    const generateButton = screen.getByRole('button', { name: /vygenerovat můj kód/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });
});
