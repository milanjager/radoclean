import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Calendar, CalendarDays, CalendarRange, Sparkles, ArrowRight, Clock, Home } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const BlogPlanUkliduDomacnosti = () => {
  const navigate = useNavigate();

  const scrollToReservation = () => {
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById("pricing");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
  };

  const daily = [
    "Ustlat postele",
    "Umýt nádobí nebo spustit myčku",
    "Setřít pracovní desku a stůl po každém jídle",
    "Vynést odpadky, pokud jsou plné",
    "Rychlý úklid koupelny – setřít umyvadlo a zrcadlo",
    "Roztřídit poštu a věci, které se povalují po obýváku",
  ];

  const weekly = [
    "Vyluxovat všechny pokoje a chodbu",
    "Vytřít podlahy v kuchyni a koupelně",
    "Vyčistit WC, vanu nebo sprchový kout",
    "Vyměnit ručníky a kuchyňské utěrky",
    "Otřít prach z polic, stolů a elektroniky",
    "Vyčistit vnitřek mikrovlnky a varnou desku",
    "Vyprat ložní povlečení (alespoň jednou za 14 dní)",
  ];

  const monthly = [
    "Umýt okna zevnitř a parapety",
    "Vyčistit lednici – vyhodit prošlé, otřít police",
    "Vyčistit troubu a digestoř",
    "Setřít prach z lamp, obrazů a horních hran skříní",
    "Vyprat záclony nebo závěsy",
    "Vyčistit pračku samočistícím programem",
    "Dezinfikovat odpadkové koše",
    "Projít skříně – co se rok nenosilo, ven",
  ];

  const seasonal = [
    "Generální úklid oken zvenku",
    "Vyčistit balkon, terasu nebo zahradu",
    "Vyprat koberce a čalouněný nábytek",
    "Hloubkové čištění spár a obkladů v koupelně",
    "Projít sklep, půdu, garáž",
    "Umýt radiátory a větrací mřížky",
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Kompletní plán úklidu domácnosti: Jak udržet domov čistý bez stresu",
    description:
      "Praktický plán úklidu domácnosti – denní, týdenní, měsíční a sezónní checklist od profesionální úklidové firmy Radoclean.",
    author: { "@type": "Organization", name: "Radoclean s.r.o." },
    publisher: {
      "@type": "Organization",
      name: "Radoclean s.r.o.",
      logo: { "@type": "ImageObject", url: "https://radoclean.cz/rado-clean-logo.png" },
    },
    datePublished: "2025-01-15",
    mainEntityOfPage: "https://radoclean.cz/blog/plan-uklidu-domacnosti",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Domů", item: "https://radoclean.cz/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://radoclean.cz/blog" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Plán úklidu domácnosti",
        item: "https://radoclean.cz/blog/plan-uklidu-domacnosti",
      },
    ],
  };

  const Checklist = ({ items }: { items: string[] }) => (
    <ul className="space-y-3 mt-4">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3">
          <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-3 h-3 text-primary" />
          </span>
          <span className="text-foreground">{t}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Plán úklidu domácnosti: kompletní checklist | Radoclean"
        description="Praktický plán úklidu domácnosti od profesionálů. Denní, týdenní, měsíční a sezónní checklist, který vás zbaví chaosu. Bonus: kdy se vyplatí úklidová firma."
        path="/blog/plan-uklidu-domacnosti"
        ogType="article"
        jsonLd={[articleJsonLd, breadcrumbJsonLd]}
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-28 pb-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <nav className="text-sm text-muted-foreground mb-4" aria-label="Drobečková navigace">
              <Link to="/" className="hover:text-foreground">Domů</Link>
              <span className="mx-2">/</span>
              <span>Blog</span>
              <span className="mx-2">/</span>
              <span className="text-foreground">Plán úklidu domácnosti</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Kompletní plán úklidu domácnosti: Jak udržet domov čistý bez stresu
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Úklid nemusí být víkendová noční můra. Tenhle plán úklidu domácnosti používáme
              dennodenně u stovek klientů v Praze – a funguje stejně dobře v garsonce jako
              v rodinném domě. Dole najdete připravené checklisty na každý den, týden a měsíc,
              které si můžete rovnou vytisknout.
            </p>
            <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 8 min čtení</span>
              <span>•</span>
              <span>Od profesionálů z Radoclean</span>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl prose-content space-y-6 text-foreground">
            <h2 className="text-2xl md:text-3xl font-bold">Proč vůbec mít plán úklidu?</h2>
            <p className="text-foreground leading-relaxed">
              Nejčastější důvod, proč úklid přerůstá přes hlavu, je jednoduchý: děláme všechno
              naráz, jednou za čas, a vždy v sobotu. Profesionální úklidové firmy fungují
              opačně – mají rozdělené úkoly do <strong>denních, týdenních a měsíčních cyklů</strong>.
              Každý den 10–15 minut, jednou týdně hodinka, jednou za měsíc důkladnější
              akce. Výsledek? Domácnost je vždy „v pohodě" a generální úklid trvá místo
              celého víkendu jen pár hodin.
            </p>
            <p className="text-foreground leading-relaxed">
              Tento plán je strukturovaný přesně podle toho, jak postupujeme u našich
              pravidelných klientů. Můžete ho použít jako rodinný checklist na lednici,
              nebo jako vodítko, podle kterého si s námi domluvíte{" "}
              <button onClick={scrollToReservation} className="text-primary underline hover:no-underline">
                pravidelný úklid
              </button>.
            </p>
          </div>
        </section>

        {/* Daily */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border-primary/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">Denní úkoly (10–15 min)</h2>
                </div>
                <p className="text-muted-foreground mt-2">
                  Cílem není uklízet – cílem je zabránit tomu, aby se nepořádek nabalil. Tyhle
                  drobnosti zvládnete mezi snídaní a odchodem z domu.
                </p>
                <Checklist items={daily} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Weekly */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border-primary/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">Týdenní úkoly (60–90 min)</h2>
                </div>
                <p className="text-muted-foreground mt-2">
                  Vyhraďte si jeden pevný den – ideálně středu nebo pátek. V pondělí už máte
                  zase celý týden v klidu.
                </p>
                <Checklist items={weekly} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Monthly */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border-primary/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CalendarRange className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">Měsíční úkoly (2–3 hodiny)</h2>
                </div>
                <p className="text-muted-foreground mt-2">
                  Tyhle věci se snadno zapomínají, ale rozhodují o tom, jestli domácnost
                  dlouhodobě „drží". Naplánujte si je do kalendáře.
                </p>
                <Checklist items={monthly} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Seasonal */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card className="border-primary/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground m-0">Sezónní generální úklid (2× ročně)</h2>
                </div>
                <p className="text-muted-foreground mt-2">
                  Klasicky jaro a podzim. Tady už dává obrovský smysl si zavolat profesionální
                  úklidovou firmu – ušetříte víkend a máte to udělané pořádně.
                </p>
                <Checklist items={seasonal} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* When pros */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl space-y-6 text-foreground">
            <h2 className="text-2xl md:text-3xl font-bold">Kdy se vyplatí úklidová firma</h2>
            <p className="leading-relaxed">
              Plán je super, dokud máte čas a energii. Realita většiny rodin a pracujících
              je ale jiná: pracovní porady přetečou, dítě onemocní, víkend je jediný čas
              s rodinou. Profesionální úklid se vyplatí ve třech situacích:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Pravidelný úklid</strong> (1× týdně / 1× za 14 dní) – zbaví vás
                celé „týdenní" sekce checklistu. Cena u nás startuje na 1 605 Kč
                s 15% slevou za pravidelnost.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Generální úklid 2× ročně</strong> – jaro/podzim včetně oken,
                lednice, trouby, koberců. Hotovo za den.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Po rekonstrukci nebo stěhování</strong> – speciální chemie,
                profesionální vysavače na stavební prach.</span>
              </li>
            </ul>
            <p className="leading-relaxed">
              U Radoclean máte v ceně dopravu, čisticí prostředky i profesionální techniku –
              <strong> žádné dojezdné, žádné překvapení na faktuře</strong>. Kolik by stál
              úklid u vás zjistíte za 30 sekund v naší kalkulačce.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <Home className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nechte úklid na nás
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Spočítejte si cenu pravidelného nebo jednorázového úklidu za 30 sekund.
              Fixní cena, doprava a chemie v ceně, žádné dojezdné.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={scrollToReservation} className="text-base">
                Spočítat cenu úklidu
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link to="/cenik">Prohlédnout ceník</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPlanUkliduDomacnosti;
