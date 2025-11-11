import beforeAfter from "@/assets/before-after.jpg";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Petra Svobodová",
      location: "Vrážská ulice, Černošice",
      text: "Konečně služba, která nedělá věci napůl. Jana přišla poprvé sama, ukázala mi, jak pracuje, a teď už k nám chodí pravidelně každé dva týdny. Vidím rozdíl oproti předchozí firmě.",
      rating: 5,
    },
    {
      name: "Martin Kovář",
      location: "Radotín",
      text: "Oceňuji hlavně transparentnost. Cena byla jasná hned na začátku, termín jsem si rezervoval online během 2 minut. Žádné zdlouhavé telefonáty. To je přesně to, co jsem hledal.",
      rating: 5,
    },
    {
      name: "Lucie Málková",
      location: "Zbraslav",
      text: "Měli jsme po rekonstrukci opravdu špinavou koupelnu. Jana a její tým to zvládli perfektně. Dokonce nám ukázali fotky 'před' a 'po'. Takovou péči jsem u úklidové firmy ještě nezažila.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Co říkají vaši sousedé
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reálné reference od skutečných lidí z vašeho okolí.
          </p>
        </div>
        
        <div className="mb-16">
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={beforeAfter} 
              alt="Před a po úklidu - transformace koupelny" 
              className="w-full"
            />
            <div className="bg-card p-6 text-center">
              <p className="text-muted-foreground">
                Reálný výsledek našeho úklidu – žádné fotobanky, jen skutečná práce
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
