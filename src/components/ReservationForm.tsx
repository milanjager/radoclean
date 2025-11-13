import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CalendarIcon, CheckCircle2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";

const reservationSchema = z.object({
  name: z.string().min(2, "Jméno musí mít alespoň 2 znaky").max(100),
  email: z.string().email("Zadejte platnou emailovou adresu").max(255),
  phone: z.string().min(9, "Zadejte platné telefonní číslo").max(20),
  address: z.string().min(5, "Zadejte platnou adresu").max(200),
  city: z.string().min(2, "Zadejte město").max(100),
  postalCode: z.string().optional(),
  preferredDate: z.date({ required_error: "Vyberte datum" }),
  preferredTime: z.string().min(1, "Vyberte čas"),
  notes: z.string().max(1000).optional(),
});

interface ReservationFormProps {
  packageType: string;
  basePrice: number;
  selectedExtras: { id: string; label: string; price: number }[];
  totalPrice: number;
  frequency?: string;
}

const ReservationForm = ({ packageType, basePrice, selectedExtras, totalPrice, frequency }: ReservationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Černošice",
    postalCode: "",
    preferredTime: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
  ];

  const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = reservationSchema.parse({
        ...formData,
        preferredDate: date,
      });

      const { error } = await supabase.from("reservations").insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          city: validatedData.city,
          postal_code: validatedData.postalCode || null,
          package_type: frequency ? `${packageType} (${frequency})` : packageType,
          extras: selectedExtras.map(e => ({ id: e.id, label: e.label, price: e.price })),
          base_price: basePrice,
          extras_price: extrasPrice,
          total_price: totalPrice,
          preferred_date: format(validatedData.preferredDate, "yyyy-MM-dd"),
          preferred_time: validatedData.preferredTime,
          notes: validatedData.notes || null,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "✅ Rezervace úspěšně odeslána!",
        description: "Potvrzení obdržíte emailem do 2 hodin.",
        duration: 7000,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "Černošice",
        postalCode: "",
        preferredTime: "",
        notes: "",
      });
      setDate(undefined);

      setTimeout(() => setIsSuccess(false), 10000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);

        toast({
          title: "❌ Chyba ve formuláři",
          description: "Zkontrolujte prosím vyplněné údaje",
          variant: "destructive",
        });
      } else {
        console.error("Reservation error:", error);
        toast({
          title: "❌ Chyba při rezervaci",
          description: "Zkuste to prosím znovu nebo nám zavolejte",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-primary/5 rounded-2xl border-2 border-primary/20">
        <CheckCircle2 className="w-16 h-16 text-primary mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Rezervace přijata!
        </h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Vaše rezervace za <span className="font-bold text-primary">{totalPrice.toLocaleString('cs-CZ')} Kč</span> byla
          úspěšně odeslána. Potvrzení obdržíte emailem do 2 hodin.
        </p>
        <Button variant="premium" onClick={() => setIsSuccess(false)}>
          Vytvořit další rezervaci
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Price Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border-2 border-primary/30">
        {frequency && (
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-primary/20">
            <span className="text-sm font-semibold text-foreground">Frekvence</span>
            <span className="font-bold text-primary">{frequency}</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Základní balíček</span>
          <span className="font-semibold">{basePrice.toLocaleString('cs-CZ')} Kč</span>
        </div>
        {selectedExtras.length > 0 && (
          <>
            {selectedExtras.map((extra) => (
              <div key={extra.id} className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">{extra.label}</span>
                <span className="font-semibold">+{extra.price.toLocaleString('cs-CZ')} Kč</span>
              </div>
            ))}
          </>
        )}
        <div className="border-t border-primary/20 mt-3 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Celková cena</span>
            <span className="font-bold text-2xl text-primary">
              {totalPrice.toLocaleString('cs-CZ')} Kč
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Kontaktní údaje</h3>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Jméno a příjmení <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            placeholder="Jan Novák"
            className={cn("h-12", errors.name && "border-destructive")}
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="jan.novak@email.cz"
              className={cn("h-12", errors.email && "border-destructive")}
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Telefon <span className="text-destructive">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+420 777 888 999"
              className={cn("h-12", errors.phone && "border-destructive")}
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Adresa úklidu
        </h3>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
            Ulice a číslo popisné <span className="text-destructive">*</span>
          </label>
          <Input
            id="address"
            placeholder="Vrážská 123"
            className={cn("h-12", errors.address && "border-destructive")}
            value={formData.address}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
              Město <span className="text-destructive">*</span>
            </label>
            <Input
              id="city"
              placeholder="Černošice"
              className={cn("h-12", errors.city && "border-destructive")}
              value={formData.city}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-foreground mb-2">
              PSČ
            </label>
            <Input
              id="postalCode"
              placeholder="252 28"
              className="h-12"
              value={formData.postalCode}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Date and Time Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Preferovaný termín</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Datum <span className="text-destructive">*</span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    errors.preferredDate && "border-destructive"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: cs }) : "Vyberte datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.preferredDate && (
              <p className="text-destructive text-sm mt-1">{errors.preferredDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium text-foreground mb-2">
              Čas <span className="text-destructive">*</span>
            </label>
            <Select
              value={formData.preferredTime}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, preferredTime: value }));
                if (errors.preferredTime) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.preferredTime;
                    return newErrors;
                  });
                }
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger className={cn("h-12", errors.preferredTime && "border-destructive")}>
                <SelectValue placeholder="Vyberte čas" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.preferredTime && (
              <p className="text-destructive text-sm mt-1">{errors.preferredTime}</p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
          Poznámky (volitelné)
        </label>
        <Textarea
          id="notes"
          placeholder="Zvláštní požadavky, kód k bráně, další informace..."
          className="min-h-24"
          value={formData.notes}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.notes.length}/1000 znaků
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="premium"
        size="lg"
        className="w-full text-lg h-14"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Odesílám rezervaci...
          </>
        ) : (
          `Rezervovat za ${totalPrice.toLocaleString('cs-CZ')} Kč`
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Po odeslání obdržíte potvrzení emailem do 2 hodin.
      </p>
    </form>
  );
};

export default ReservationForm;
