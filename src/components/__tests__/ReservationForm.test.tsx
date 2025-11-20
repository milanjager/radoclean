import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReservationForm from '../ReservationForm';
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

describe('ReservationForm', () => {
  const mockProps = {
    packageType: 'small',
    basePrice: 1800,
    selectedExtras: [],
    totalPrice: 1800,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderuje formulář se všemi požadovanými poli', () => {
    render(<ReservationForm {...mockProps} />, { wrapper });

    expect(screen.getByLabelText(/jméno a příjmení/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefon/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ulice a číslo popisné/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/datum úklidu/i)).toBeInTheDocument();
  });

  it('zobrazuje správnou celkovou cenu', () => {
    render(<ReservationForm {...mockProps} />, { wrapper });

    expect(screen.getByText('1 800 Kč')).toBeInTheDocument();
  });

  it('validuje povinná pole při odeslání', async () => {
    const user = userEvent.setup();
    render(<ReservationForm {...mockProps} />, { wrapper });

    const submitButton = screen.getByRole('button', { name: /rezervovat/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/jméno je povinné/i)).toBeInTheDocument();
    });
  });

  it('validuje formát emailu', async () => {
    const user = userEvent.setup();
    render(<ReservationForm {...mockProps} />, { wrapper });

    const emailInput = screen.getByLabelText(/e-mail/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /rezervovat/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/neplatný e-mail/i)).toBeInTheDocument();
    });
  });

  it('validuje formát telefonního čísla', async () => {
    const user = userEvent.setup();
    render(<ReservationForm {...mockProps} />, { wrapper });

    const phoneInput = screen.getByLabelText(/telefon/i);
    await user.type(phoneInput, '123');

    const submitButton = screen.getByRole('button', { name: /rezervovat/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/telefonní číslo musí mít alespoň 9 číslic/i)).toBeInTheDocument();
    });
  });

  it('úspěšně odešle formulář s platnými daty', async () => {
    const user = userEvent.setup();
    
    // Mock successful Supabase insert
    const mockInsert = vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ 
          data: { id: '123' }, 
          error: null 
        })),
      })),
    }));

    const mockInvoke = vi.fn(() => Promise.resolve({ 
      data: { success: true }, 
      error: null 
    }));

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
    } as any);

    vi.mocked(supabase.functions.invoke).mockImplementation(mockInvoke);

    render(<ReservationForm {...mockProps} />, { wrapper });

    // Vyplnění formuláře
    await user.type(screen.getByLabelText(/jméno a příjmení/i), 'Jan Novák');
    await user.type(screen.getByLabelText(/e-mail/i), 'jan@example.com');
    await user.type(screen.getByLabelText(/telefon/i), '+420739580935');
    await user.type(screen.getByLabelText(/ulice a číslo popisné/i), 'Hlavní 123');
    await user.type(screen.getByLabelText(/psč/i), '15600');

    const submitButton = screen.getByRole('button', { name: /rezervovat/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  it('zobrazuje cenu s extras', () => {
    const propsWithExtras = {
      ...mockProps,
      selectedExtras: [
        { id: 'dog', label: 'Mám psa nebo kočku', price: 200 },
        { id: 'windows-outside', label: 'Mytí oken z vnější strany', price: 400 },
      ],
      totalPrice: 2400,
    };

    render(<ReservationForm {...propsWithExtras} />, { wrapper });

    expect(screen.getByText('2 400 Kč')).toBeInTheDocument();
  });

  it('aplikuje referral slevu', async () => {
    const user = userEvent.setup();

    // Mock referral code check
    const mockSelect = vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn(() => Promise.resolve({
          data: {
            code: 'TEST123',
            referrals_count: 3,
            discount_activated: true,
          },
          error: null,
        })),
      })),
    }));

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
    } as any);

    render(<ReservationForm {...mockProps} />, { wrapper });

    const referralInput = screen.getByPlaceholderText(/zadejte referral kód/i);
    await user.type(referralInput, 'TEST123');

    // Počkat na validaci kódu
    await waitFor(() => {
      expect(mockSelect).toHaveBeenCalled();
    });
  });
});
