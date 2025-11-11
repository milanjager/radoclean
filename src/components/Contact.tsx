import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";

const Contact = () => {
  return (
    <section id="kontakt" className="py-20 bg-background">
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
                      <a href="tel:+420777888999" className="text-lg hover:underline">
                        +420 777 888 999
                      </a>
                      <p className="text-sm text-primary-foreground/80 mt-1">
                        Po–Pá 8:00–18:00
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold mb-1">Email</p>
                      <a href="mailto:info@premiumuklid.cz" className="text-lg hover:underline">
                        info@premiumuklid.cz
                      </a>
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
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full bg-white/10 border-white/20 hover:bg-white hover:text-primary text-white"
                    >
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
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                    Jméno a příjmení
                  </label>
                  <Input 
                    id="name" 
                    placeholder="Jan Novák"
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="jan.novak@email.cz"
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                    Telefon
                  </label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+420 777 888 999"
                    className="h-12"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                    Zpráva
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Napište nám, co potřebujete uklidit a kdy máte čas..."
                    className="min-h-32"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="premium" 
                  size="lg"
                  className="w-full text-lg"
                >
                  Odeslat poptávku
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  Odpovíme vám do 2 hodin ve všední dny
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
