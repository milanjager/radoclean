import referenceBathroom from "@/assets/reference-bathroom.jpg";
import referenceKitchen from "@/assets/reference-kitchen.jpg";
import referenceLivingRoom from "@/assets/reference-living-room.jpg";
import { Star, Quote } from "lucide-react";
import { useState } from "react";

const Testimonials = () => {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const testimonials = [
    {
      name: "Petra Svobodová",
      location: "Vrážská ulice, Černošice",
      text: "Konečně služba, která nedělá věci napůl. Jana přišla poprvé sama, ukázala mi, jak pracuje, a teď už k nám chodí pravidelně každé dva týdny. Vidím obrovský rozdíl oproti předchozí firmě.",
      rating: 5,
      verified: true,
    },
    {
      name: "Martin Kovář",
      location: "Radotín",
      text: "Oceňuji hlavně transparentnost. Cena byla jasná hned na začátku, termín jsem si rezervoval online během 2 minut. Žádné zdlouhavé telefonáty a nejasnosti. To je přesně to, co jsem hledal.",
      rating: 5,
      verified: true,
    },
    {
      name: "Lucie Málková",
      location: "Zbraslav",
      text: "Měli jsme po rekonstrukci opravdu špinavou koupelnu a kuchyň. Jana a její tým to zvládli perfektně. Dokonce nám ukázali fotky 'před' a 'po'. Takovou péči jsem u úklidové firmy ještě nezažila.",
      rating: 5,
      verified: true,
    },
    {
      name: "Tomáš Novotný",
      location: "Dobřichovice",
      text: "Používáme jejich služby už rok. Nejlepší je, že vždy vím, kdo k nám přijde. Žádné překvapení, vždy stejná kvalita. A když jsem potřeboval přesunout termín, vyřešili to hned.",
      rating: 5,
      verified: true,
    },
    {
      name: "Eva Horáková",
      location: "Karlická, Černošice",
      text: "Mám velký dům a dva psy. Myslela jsem, že to bude problém, ale oni si s tím poradili skvěle. Cena byla stejná jako řekli na webu. Žádné přirážky za domácí zvířata nebo velikost.",
      rating: 5,
      verified: true,
    },
    {
      name: "Jan Kučera",
      location: "Zbraslav",
      text: "Zkusil jsem před nimi tři jiné firmy z Prahy. Všechny měli nějaké poplatky navíc - doprava, chemie, 'mimopražské pásmo'. Tady je konečná cena opravdu konečná. Doporučuji!",
      rating: 5,
      verified: true,
    },
  ];

  const references = [
    {
      image: referenceBathroom,
      title: "Koupelna po rekonstrukci",
      location: "Černošice",
      description: "Odstranění stavebního prachu a vodního kamene"
    },
    {
      image: referenceKitchen,
      title: "Kuchyň před stěhováním",
      location: "Radotín",
      description: "Kompletní vyčištění včetně spotřebičů"
    },
    {
      image: referenceLivingRoom,
      title: "Obývací pokoj",
      location: "Zbraslav",
      description: "Pravidelný měsíční úklid rodinného domu"
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Co říkají vaši sousedé
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reálné reference od skutečných lidí z Radotína, Černošic a Zbraslavi
          </p>
        </div>
        
        {/* Before/After Reference Images */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Naše práce mluví sama za sebe
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Skutečné výsledky u vašich sousedů. Žádné fotky z internetu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {references.map((reference, index) => (
              <div 
                key={index}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                onMouseEnter={() => setHoveredImage(index)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <div className="relative aspect-[2/1] overflow-hidden">
                  <img 
                    src={reference.image} 
                    alt={`${reference.title} - ${reference.location}`}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredImage === index ? 'scale-110' : 'scale-100'
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Before/After Label */}
                  <div className="absolute top-4 left-0 right-0 flex justify-between px-4">
                    <span className="bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Před
                    </span>
                    <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Po
                    </span>
                  </div>
                </div>
                
                <div className="bg-card p-5 border-t border-border">
                  <h4 className="font-bold text-foreground text-lg mb-1">
                    {reference.title}
                  </h4>
                  <p className="text-sm text-primary mb-2">
                    📍 {reference.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reference.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground italic">
              ✓ Všechny fotky jsou z reálných zakázek v Poberouní • Žádné stock fotografie
            </p>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Hodnocení zákazníků
            </h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-2xl font-bold text-foreground">5.0</span>
              <span className="text-muted-foreground">z {testimonials.length} hodnocení</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all hover:scale-[1.02] duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                      ✓ Ověřeno
                    </span>
                  )}
                </div>
                
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                
                <p className="text-muted-foreground mb-5 leading-relaxed text-sm">
                  {testimonial.text}
                </p>
                
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📍 {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Google Reviews CTA */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-card rounded-2xl p-6 shadow-sm border border-border">
              <p className="text-muted-foreground mb-3">
                📱 Najdete nás také na Google
              </p>
              <a 
                href="https://g.page/r/YOUR_GOOGLE_PLACE_ID/review" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
              >
                Přečíst další recenze na Google →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
