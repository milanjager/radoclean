import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
const contactSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Jméno musí mít alespoň 2 znaky"
  }).max(100, {
    message: "Jméno je příliš dlouhé"
  }),
  email: z.string().trim().email({
    message: "Zadejte platnou emailovou adresu"
  }).max(255, {
    message: "Email je příliš dlouhý"
  }),
  phone: z.string().trim().min(9, {
    message: "Zadejte platné telefonní číslo"
  }).max(20, {
    message: "Telefonní číslo je příliš dlouhé"
  }),
  message: z.string().trim().min(10, {
    message: "Zpráva musí mít alespoň 10 znaků"
  }).max(1000, {
    message: "Zpráva je příliš dlouhá (max 1000 znaků)"
  })
});
const Contact = () => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    try {
      // Validace
      const validatedData = contactSchema.parse(formData);

      // Uložení do databáze
      const {
        error
      } = await supabase.from('inquiries').insert([{
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message
      }]);
      if (error) throw error;

      // Success
      setIsSuccess(true);
      toast({
        title: "✅ Zpráva úspěšně odeslána!",
        description: "Ozveme se vám do 2 hodin ve všední dny.",
        duration: 7000
      });

      // Reset formuláře
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });

      // Reset success state after 10 seconds
      setTimeout(() => setIsSuccess(false), 10000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "❌ Chyba ve formuláři",
          description: "Zkontrolujte prosím vyplněné údaje",
          variant: "destructive"
        });
      } else {
        toast({
          title: "❌ Chyba při odesílání",
          description: "Zkuste to prosím znovu nebo nám zavolejte na +420 777 888 999",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      id,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Vymazat chybu při psaní
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = {
          ...prev
        };
        delete newErrors[id];
        return newErrors;
      });
    }
  };
  return <section id="contact" className="py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Začněte dnes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Napište nám nebo si rovnou rezervujte termín v našem online kalendáři.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-8 md:p-10 h-full">
                <h3 className="text-3xl font-bold mb-8">
                  Kontaktujte nás
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Telefon</p>
                      <a href="tel:+420777888999" className="text-lg hover:underline block">+420  580 935</a>
                      <p className="text-sm text-primary-foreground/80 mt-1">
                        Po–Pá 8:00–18:00
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a href="mailto:info@premiumuklid.cz" className="text-lg hover:underline">nango.design@gmail.com</a>
                      <p className="text-sm text-primary-foreground/80 mt-1">
                        Odpovíme do 2 hodin
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Oblast působení</p>
                      <p className="text-lg">
                        Černošice, Radotín, Zbraslav
                      </p>
                      <p className="text-sm text-primary-foreground/80 mt-1">
                        a přilehlé oblasti Praha-západ
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-primary-foreground/20">
                    <Button variant="outline" size="lg" className="w-full bg-white/10 border-white/20 hover:bg-white hover:text-primary text-white" onClick={() => {
                    const element = document.getElementById("pricing");
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                      });
                    }
                  }}>
                      <Calendar className="mr-2" />
                      Online rezervace termínu
                    </Button>
                    <p className="text-sm text-center text-primary-foreground/80 mt-3">
                      Rezervujte si termín během 2 minut
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              {isSuccess ? <div className="flex flex-col items-center justify-center py-12 px-6 bg-primary/5 rounded-2xl border-2 border-primary/20">
                  <CheckCircle2 className="w-16 h-16 text-primary mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Děkujeme za zprávu!
                  </h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Vaše poptávka byla úspěšně odeslána. Ozveme se vám do 2 hodin ve všední dny.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="tel:+420777888999">
                      <Button variant="premium">
                        <Phone className="mr-2 h-5 w-5" />
                        Zavolat teď
                      </Button>
                    </a>
                    <Button variant="outline" onClick={() => setIsSuccess(false)}>
                      Odeslat další zprávu
                    </Button>
                  </div>
                </div> : <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                    Jméno a příjmení <span className="text-destructive">*</span>
                  </label>
                  <Input id="name" placeholder="Jan Novák" className={`h-12 ${errors.name ? "border-destructive" : ""}`} value={formData.name} onChange={handleChange} disabled={isSubmitting} />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input id="email" type="email" placeholder="jan.novak@email.cz" className={`h-12 ${errors.email ? "border-destructive" : ""}`} value={formData.email} onChange={handleChange} disabled={isSubmitting} />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                    Telefon <span className="text-destructive">*</span>
                  </label>
                  <Input id="phone" type="tel" placeholder="+420 777 888 999" className={`h-12 ${errors.phone ? "border-destructive" : ""}`} value={formData.phone} onChange={handleChange} disabled={isSubmitting} />
                  {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                    Zpráva <span className="text-destructive">*</span>
                  </label>
                  <Textarea id="message" placeholder="Napište nám, co potřebujete uklidit a kdy máte čas..." className={`min-h-32 ${errors.message ? "border-destructive" : ""}`} value={formData.message} onChange={handleChange} disabled={isSubmitting} />
                  {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.message.length}/1000 znaků
                  </p>
                </div>
                
                <Button type="submit" variant="premium" size="lg" className="w-full text-lg" disabled={isSubmitting}>
                  {isSubmitting ? <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Odesílám...
                    </> : "Odeslat poptávku"}
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  Odpovíme vám do 2 hodin ve všední dny. Nebo nám rovnou zavolejte: 
                  <a href="tel:+420777888999" className="text-primary hover:underline font-semibold ml-1">
                    +420 777 888 999
                  </a>
                </p>
              </form>}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Contact;