import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, ArrowRight, Phone, Clock, Sparkles, Home, Wrench, Package, CalendarDays, AlertTriangle, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Cenik = () => {
  const navigate = useNavigate();

  const scrollToReservation = () => {
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById("pricing");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  };

  const basePackages = [
    {
      name: "Malý byt",
      subtitle: "1+kk, 2+kk • do 60 m²",
      price: 1890,
      popular: false,
      features: [
        "Kompletní úklid všech místností",
        "Koupelna včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
        "Fixní cena bez překvapení",
      ],
      time: "cca 2 hodiny",
    },
    {
      name: "Střední byt",
      subtitle: "3+kk, 4+kk • 60–100 m²",
      price: 2890,
      popular: true,
      features: [
        "Kompletní úklid všech místností",
        "Koupelna včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
        "Balkon nebo terasa",
        "Místní firma – žádné dojezdné",
      ],
      time: "cca 3 hodiny",
    },
    {
      name: "Rodinný dům",
      subtitle: "100–150 m²",
      price: 4990,
      popular: false,
      features: [
        "Kompletní úklid všech místností",
        "2 koupelny včetně vany/sprchy",
        "Kuchyň včetně spotřebičů a vyčištění trouby",
        "Mytí oken zevnitř i zvenku",
        "Doprava a čistící prostředky v ceně",
        "Balkon, terasa nebo zahrada (základní)",
        "Schodiště",
        "Kompletní servis bez starostí",
      ],
      time: "cca 4–5 hodin",
    },
  ];

  const categories = [
    { name: "Běžný úklid", icon: "🏠", multiplier: "1×", description: "Pravidelný úklid pro udržení čistoty" },
    { name: "Generální úklid", icon: "✨", multiplier: "+50 %", description: "Hloubkové čištění všech prostorů" },
    { name: "Úklid po rekonstrukci", icon: "🔨", multiplier: "+100 %", description: "Odstranění stavebního prachu a nečistot" },
    { name: "Úklid po stěhování", icon: "📦", multiplier: "+70 %", description: "Kompletní úklid vyprázdněných prostor" },
    { name: "Pravidelný úklid", icon: "📅", multiplier: "−15 %", description: "Týdenní nebo měsíční servis se slevou" },
  ];

  const frequencyDiscounts = [
    { name: "2× týdně", discount: "−20 %", note: "Maximální čistota" },
    { name: "1× týdně", discount: "−15 %", note: "Ideální volba" },
    { name: "1× za 14 dní", discount: "−10 %", note: "Každé dva týdny" },
    { name: "1× měsíčně", discount: "−5 %", note: "Základní servis" },
  ];

  const urgentSurcharges = [
    { name: "Do 24 hodin", surcharge: "+30 %", icon: "⚡" },
    { name: "Víkendový úklid", surcharge: "+20 %", icon: "📅" },
    { name: "Večerní úklid (po 18:00)", surcharge: "+15 %", icon: "🌙" },
  ];

  const windowPrices = [
    { count: "1–3 okna", price: 200 },
    { count: "4–6 oken", price: 350 },
    { count: "7–10 oken", price: 500 },
    { count: "11+ oken", price: 700 },
  ];

  const extras = [
    { name: "Mám psa nebo kočku", price: 200, note: "Extra čištění od chlupů + hypoalergenní prostředky" },
    { name: "Mytí nádobí", price: 150, note: "Umytí a utření nádobí" },
    { name: "Vynášení odpadků", price: 50, note: "Vynést koše a vyměnit pytlíky" },
    { name: "Zalévání květin", price: 50, note: "Péče o pokojové rostliny" },
    { name: "Žehlení prádla (cca 2 hod)", price: 300, note: "Vyžehlení a poskládání prádla" },
    { name: "Kompletní údržba zahrady", price: 600, note: "Sekání trávy, hrabání listí, záhony" },
    { name: "Čištění koberců a čalouněného nábytku", price: 500, note: "Profesionální hloubkové čištění" },
    { name: "Vyčištění trouby a grilu", price: 350, note: "Důkladné odmastění a dezinfekce" },
    { name: "Čištění lednice a mrazáku", price: 250, note: "Vyčištění, odmrazení a dezinfekce" },
    { name: "Velký balkon / terasa (nad 10 m²)", price: 450, note: "Vymetení, umytí podlahy a zábradlí" },
    { name: "Praní a sušení prádla", price: 400, note: "Jedna várka včetně sušení" },
    { name: "Organizace šatníku nebo skříní", price: 550, note: "Přeskládání a uspořádání" },
    { name: "Sklep / garáž / půda", price: 300, note: "Úklid vedlejších prostorů" },
    { name: "Čištění tapetovaných stěn", price: 400, note: "Šetrné čištění tapet, odstranění skvrn" },
    { name: "Čištění stěn a stropů (1 místnost)", price: 600, note: "Pavučiny, skvrny, otisky" },
  ];

  const priceExamples = [
    {
      label: "Běžný úklid – malý byt",
      calc: "1 890 Kč",
    },
    {
      label: "Generální úklid – střední byt",
      calc: `${Math.round(2890 * 1.5).toLocaleString("cs-CZ")} Kč`,
    },
    {
      label: "Úklid po rekonstrukci – rodinný dům",
      calc: `${Math.round(4990 * 2).toLocaleString("cs-CZ")} Kč`,
    },
    {
      label: "Pravidelný úklid 1× týdně – střední byt",
      calc: `${Math.round(2890 * 0.85 * 0.85).toLocaleString("cs-CZ")} Kč`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Platné od 1. 1. 2025
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Ceník služeb
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Fixní ceny bez skrytých poplatků. Doprava a profesionální prostředky vždy v ceně.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary" /> Doprava zdarma</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary" /> Prostředky v ceně</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary" /> Záruka spokojenosti</span>
          </div>
        </div>
      </section>

      {/* ─── 1. Základní balíčky ─── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-center flex items-center justify-center gap-2">
            <Home className="w-7 h-7 text-primary" />
            Základní balíčky
          </h2>
          <p className="text-muted-foreground text-center mb-10">Jednorázový běžný úklid – konečná cena hned</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {basePackages.map((pkg, i) => (
              <div
                key={i}
                className={`relative bg-card rounded-2xl p-8 border-2 transition-all hover:shadow-lg ${
                  pkg.popular ? "border-primary scale-105 shadow-warm" : "border-border"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-5 py-1 rounded-full text-sm font-bold">
                    Nejoblíbenější
                  </div>
                )}
                <h3 className="text-2xl font-bold text-foreground mb-1">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.subtitle}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-foreground">
                    {pkg.price.toLocaleString("cs-CZ")}
                  </span>
                  <span className="text-xl text-muted-foreground ml-2">Kč</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {pkg.time}
                </p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={pkg.popular ? "premium" : "outline"}
                  className="w-full"
                  size="lg"
                  onClick={scrollToReservation}
                >
                  Rezervovat
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. Typy úklidu ─── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            Typy úklidu
          </h2>
          <p className="text-muted-foreground text-center mb-10">Cena základního balíčku se násobí podle typu</p>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">Typ úklidu</th>
                    <th className="text-center p-4 font-semibold text-foreground">Cenový koeficient</th>
                    <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">Popis</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-foreground font-medium">
                        <span className="mr-2">{cat.icon}</span>
                        {cat.name}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          cat.multiplier.startsWith("−") || cat.multiplier.startsWith("-")
                            ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                            : cat.multiplier === "1×"
                            ? "bg-muted text-foreground"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300"
                        }`}>
                          {cat.multiplier}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm hidden md:table-cell">{cat.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price examples */}
            <div className="mt-8 bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-bold text-foreground mb-4">📊 Příklady výpočtu ceny</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {priceExamples.map((ex, i) => (
                  <div key={i} className="flex items-center justify-between bg-card rounded-lg p-3 border border-border">
                    <span className="text-sm text-muted-foreground">{ex.label}</span>
                    <span className="font-bold text-foreground ml-4 whitespace-nowrap">{ex.calc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Slevy za pravidelnost ─── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-center flex items-center justify-center gap-2">
            <CalendarDays className="w-7 h-7 text-primary" />
            Slevy za pravidelný úklid
          </h2>
          <p className="text-muted-foreground text-center mb-10">Kombinuje se s kategorií „Pravidelný úklid" (−15 %)</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {frequencyDiscounts.map((freq, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-all text-center">
                <div className="text-3xl font-bold text-primary mb-2">{freq.discount}</div>
                <h3 className="font-bold text-foreground mb-1">{freq.name}</h3>
                <p className="text-xs text-muted-foreground">{freq.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. Příplatky za urgentní služby ─── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-7 h-7 text-orange-500" />
            Příplatky za urgentní služby
          </h2>
          <p className="text-muted-foreground text-center mb-10">Volitelné – pouze pokud potřebujete express službu</p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {urgentSurcharges.map((u, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border-2 border-border hover:border-orange-300 transition-all text-center">
                <div className="text-4xl mb-3">{u.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{u.name}</h3>
                <div className="inline-block bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 text-lg font-bold px-4 py-1 rounded-full">
                  {u.surcharge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Mytí oken ─── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-center flex items-center justify-center gap-2">
            <Droplets className="w-7 h-7 text-primary" />
            Mytí oken z vnější strany
          </h2>
          <p className="text-muted-foreground text-center mb-10">Příplatek podle počtu oken</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {windowPrices.map((w, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border-2 border-border text-center hover:border-primary/50 transition-all">
                <h3 className="font-bold text-foreground mb-2">{w.count}</h3>
                <div className="text-2xl font-bold text-primary">+{w.price} Kč</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Doplňkové služby (extras) ─── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-2 text-center flex items-center justify-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Doplňkové služby
          </h2>
          <p className="text-muted-foreground text-center mb-10">Přidejte k libovolnému balíčku</p>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">Služba</th>
                    <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">Popis</th>
                    <th className="text-right p-4 font-semibold text-foreground">Cena</th>
                  </tr>
                </thead>
                <tbody>
                  {extras.map((extra, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-foreground font-medium text-sm">{extra.name}</td>
                      <td className="p-4 text-muted-foreground text-sm hidden md:table-cell">{extra.note}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <span className="font-bold text-primary">+{extra.price} Kč</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Slevy a výhody ─── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
            💰 Další slevy a výhody
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
              <h3 className="font-bold text-foreground mb-2">Vlastní čistící prostředky</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Máte hadry, mop, vysavač a základní saponáty?
              </p>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">−200 Kč</div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 border-2 border-primary/20">
              <h3 className="font-bold text-foreground mb-2">Doprava a prostředky</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Vždy v ceně – jsme místní firma z Radotína
              </p>
              <div className="text-2xl font-bold text-primary">ZDARMA</div>
            </div>

            <div className="bg-accent/5 rounded-2xl p-6 border-2 border-accent/20">
              <h3 className="font-bold text-foreground mb-2">Záruka spokojenosti</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Nejste spokojeni? Přijedeme znovu zdarma
              </p>
              <div className="text-2xl font-bold text-accent">100 %</div>
            </div>

            <div className="bg-secondary rounded-2xl p-6 border-2 border-border">
              <h3 className="font-bold text-foreground mb-2">Pojištění odpovědnosti</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Plně pojištěni pro váš klid
              </p>
              <div className="text-2xl font-bold text-foreground">2 mil. Kč</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Připraveni na čistý domov?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Rezervujte si termín online za 2 minuty nebo nám zavolejte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" size="lg" className="text-lg" onClick={scrollToReservation}>
              🔥 Rezervovat úklid
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <a href="tel:+420777077414">
              <Button variant="outline" size="lg" className="text-lg w-full sm:w-auto">
                <Phone className="mr-2 w-5 h-5" />
                +420 777 077 414
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cenik;
