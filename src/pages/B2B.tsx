import { useState } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoKadernictvi from "@/assets/logo-kadernictvi-sokolov.png";
import logoFitness from "@/assets/logo-fitness-praha10.png";
import logoSvjMraz from "@/assets/logo-svj-mraz.png";
import logoDailyFresh from "@/assets/logo-daily-fresh-cernosice.png";
import logoBrambotin from "@/assets/logo-brambotin.png";
import {
  Building2,
  Dumbbell,
  Scissors,
  Sparkles,
  Check,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Shield,
  Leaf,
  Clock,
  FileText,
  Package,
  Zap,
  TrendingDown,
  Award,
  CheckCircle2,
} from "lucide-react";

const B2B = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    sector: "",
    area: "",
    frequency: "",
    message: "",
  });

  const segments = [
    {
      icon: Dumbbell,
      title: "Fitness & wellness",
      desc: "Sítě klubů, posilovny, studia. Zkušenosti se sítí Form Factory (30+ klubů, Technogym, Les Mills).",
      examples: "Form Factory · privátní studia",
    },
    {
      icon: Scissors,
      title: "Holičství, salony, beauty",
      desc: "Hygienicky bezpečný prostor, denní kartáčování vlasů, dezinfekce nástrojů a křesel.",
      examples: "Illegal Barber Shop Radotín",
    },
    {
      icon: Building2,
      title: "Kanceláře & retail",
      desc: "Pravidelný servis kanceláří, prodejen, ordinací a recepcí. Klid bez starostí o úklid.",
      examples: "Showroomy · ordinace · co-working",
    },
  ];

  const advantages = [
    {
      icon: MapPin,
      title: "Jsme místní",
      desc: "Sídlíme přímo v Radotíně — žádné dojezdy, žádné příplatky za cestovné, flexibilní termíny.",
    },
    {
      icon: Zap,
      title: "Rychlá reakce",
      desc: "Mimořádný úklid (po rekonstrukci, akci) vyjedeme do 24–48 hodin.",
    },
    {
      icon: Leaf,
      title: "Ekologické prostředky",
      desc: "Přípravky šetrné k zákazníkům i povrchům — bez agresivních chemikálií.",
    },
    {
      icon: Shield,
      title: "Pojištění odpovědnosti",
      desc: "Veškeré případné škody způsobené při úklidu jsou kryty pojištěním až do 2 mil. Kč.",
    },
    {
      icon: FileText,
      title: "Bez závazku",
      desc: "Spolupráce bez smlouvy na dobu neurčitou — nebo s pololetním kontraktem a slevou 8 %.",
    },
    {
      icon: Package,
      title: "Vlastní vybavení",
      desc: "Přinášíme veškeré čisticí prostředky a nářadí — od Vás nepotřebujeme nic.",
    },
  ];

  const packages = [
    {
      name: "Servisní úklid",
      subtitle: "Provozovny — 1× měsíčně",
      priceFrom: "2 200",
      priceTo: "2 500",
      unit: "Kč / zásah",
      monthly: "2 200 – 2 500 Kč / měs.",
      popular: false,
      features: [
        "Deep cleaning provozovny do 80 m²",
        "Hloubková dezinfekce ploch a nástrojů",
        "Mytí podlah, zrcadel, oken zevnitř",
        "Hygiena WC a sociálního zázemí",
        "Vlastní prostředky a vybavení v ceně",
        "Kontrolní list o provedeném úklidu",
      ],
    },
    {
      name: "Týdenní servis",
      subtitle: "Doporučená varianta — 1× týdně",
      priceFrom: "1 600",
      priceTo: "1 800",
      unit: "Kč / zásah",
      monthly: "5 800 – 6 400 Kč / měs.",
      popular: true,
      features: [
        "4× měsíčně deep cleaning provozovny",
        "Stálý úklidový tým — znají Váš prostor",
        "Konzistentní hygienický standard",
        "Pevný den a čas dle dohody",
        "Reporting a kontrola kvality",
        "Sleva 8 % při pololetním kontraktu",
      ],
    },
    {
      name: "Fitness & sítě",
      subtitle: "Provozovny nad 200 m² · sítě klubů",
      priceFrom: "individuální",
      priceTo: "",
      unit: "kalkulace",
      monthly: "Cenová nabídka na míru",
      popular: false,
      features: [
        "Servisní úklid 2× týdně + deep 1× měsíčně",
        "Vlastní příručka úklidu pro Vaši značku",
        "Barevně kódovaná mikrovlákna podle zón",
        "Kvartérní dezinfekce strojů (kontakt 60 s)",
        "Specifika: Technogym, Les Mills, wellness",
        "Multi-site management — 1 kontakt",
      ],
    },
  ];

  const extras = [
    { name: "Servisní úklid (zametení, kartáčování vlasů, otření ploch)", freq: "denně / dle dohody", price: "od 400 Kč / hod" },
    { name: "Čištění čalounění křesel — hloubková impregnace", freq: "1× za 3 měsíce", price: "800 – 1 200 Kč" },
    { name: "Mytí výloh a fasádního skla", freq: "1× měsíčně", price: "400 – 600 Kč" },
    { name: "Dezinfekce UV lampou — virucidní ošetření", freq: "dle potřeby", price: "500 Kč / zásah" },
    { name: "Jednorázový úklid po rekonstrukci nebo akci", freq: "jednorázově", price: "od 2 500 Kč" },
    { name: "Čištění žaluzií a rolet", freq: "1× za 3 měsíce", price: "800 – 1 200 Kč" },
  ];

  const yearlyTable = [
    {
      variant: "1× měsíčně (12 návštěv)",
      standard: "26 400 – 30 000 Kč",
      discount: "− 2 100 – 2 400 Kč",
      final: "24 300 – 27 600 Kč",
    },
    {
      variant: "1× týdně (48 návštěv)",
      standard: "69 600 – 76 800 Kč",
      discount: "− 5 570 – 6 140 Kč",
      final: "64 030 – 70 660 Kč",
      highlight: true,
    },
  ];

  const references = [
    {
      name: "Form Factory",
      type: "Síť fitness klubů",
      detail: "30+ klubů · Technogym · Les Mills · wellness zóny",
      stat: "4 500+",
      statLabel: "lekcí / měsíc",
    },
    {
      name: "Illegal Barber Shop",
      type: "Holičství Radotín",
      detail: "80 m² · Pod Klapicí 103/16 · týdenní deep cleaning",
      stat: "1× týdně",
      statLabel: "stálý servis",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("inquiries").insert({
        name: `${form.name} (${form.company})`,
        email: form.email,
        phone: form.phone,
        message: `B2B POPTÁVKA\nSegment: ${form.sector}\nPlocha: ${form.area} m²\nFrekvence: ${form.frequency}\n\n${form.message}`,
      });
      if (error) throw error;
      toast.success("Děkujeme! Ozveme se do 24 hodin s nezávaznou nabídkou.");
      setForm({ company: "", name: "", email: "", phone: "", sector: "", area: "", frequency: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Nepodařilo se odeslat. Zavolejte nám prosím na +420 603 425 692.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Building2 className="w-4 h-4 mr-2" />
              B2B · Úklid pro firmy a provozovny
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Profesionální úklid<br />
              <span className="text-primary">pro Vaši provozovnu</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Pravidelný hygienický servis pro fitness centra, holičství, salony, kanceláře
              a retail. Vlastní příručky úklidu, kontrolní listy a měsíční fakturace.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Sleva 8 % na pololetní kontrakt
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Měsíční fakturace
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Pojištění 2 mil. Kč
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="premium"
                size="lg"
                className="text-lg"
                onClick={() => document.getElementById("b2b-contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Nezávazná kalkulace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <a href="tel:+420603425692">
                <Button variant="outline" size="lg" className="text-lg w-full sm:w-auto">
                  <Phone className="mr-2 w-5 h-5" />
                  +420 603 425 692
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEGMENTS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Pro koho pracujeme</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specializujeme se na provozovny s vysokými hygienickými nároky a stálým provozem.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {segments.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-card border-2 border-border rounded-2xl p-8 hover:border-primary/50 hover:shadow-warm transition-all">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{s.desc}</p>
                  <p className="text-xs text-muted-foreground/80 italic">Reference: {s.examples}</p>
                </div>
              );
            })}
          </div>

          {/* Client logos */}
          <div className="mt-16 max-w-6xl mx-auto">
            <p className="text-center text-sm uppercase tracking-widest text-muted-foreground mb-8">
              Důvěřují nám
            </p>
            {/* Mobile / tablet: infinite marquee */}
            <div className="md:hidden relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex w-max gap-12 py-2 animate-[marquee_22s_linear_infinite]">
                {[
                  { src: logoKadernictvi, alt: "Kadeřnictví Sokolov" },
                  { src: logoFitness, alt: "Fitness Praha 10" },
                  { src: logoSvjMraz, alt: "SVJ Mráz" },
                  { src: logoDailyFresh, alt: "Daily Fresh Černošice" },
                  { src: logoBrambotin, alt: "Brambotín s.r.o." },
                  { src: logoKadernictvi, alt: "Kadeřnictví Sokolov" },
                  { src: logoFitness, alt: "Fitness Praha 10" },
                  { src: logoSvjMraz, alt: "SVJ Mráz" },
                  { src: logoDailyFresh, alt: "Daily Fresh Černošice" },
                  { src: logoBrambotin, alt: "Brambotín s.r.o." },
                ].map((logo, i) => (
                  <div key={i} className="h-16 w-32 shrink-0 flex items-center justify-center grayscale opacity-70">
                    <img src={logo.src} alt={logo.alt} loading="lazy" width={128} height={64} className="max-h-16 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>
            {/* Desktop: grid */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
              {[
                { src: logoKadernictvi, alt: "Kadeřnictví Sokolov" },
                { src: logoFitness, alt: "Fitness Praha 10" },
                { src: logoSvjMraz, alt: "SVJ Mráz" },
                { src: logoDailyFresh, alt: "Daily Fresh Černošice" },
                { src: logoBrambotin, alt: "Brambotín s.r.o." },
              ].map((logo, i) => (
                <div key={i} className="h-24 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <img src={logo.src} alt={logo.alt} loading="lazy" width={240} height={96} className="max-h-24 w-auto object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3">Ceník B2B</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Balíčky pro provozovny</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ceny pro provozovnu do 80 m². Větší prostory a sítě klubů — kalkulace na míru.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((p, i) => (
              <div
                key={i}
                className={`relative bg-card rounded-2xl p-8 border-2 transition-all hover:shadow-lg ${
                  p.popular ? "border-primary md:scale-105 shadow-warm" : "border-border"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-5 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                    Nejoblíbenější
                  </div>
                )}
                <h3 className="text-2xl font-bold text-foreground mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-5">{p.subtitle}</p>
                <div className="mb-2">
                  {p.priceTo ? (
                    <>
                      <span className="text-3xl font-bold text-foreground">{p.priceFrom}</span>
                      <span className="text-xl text-muted-foreground"> – {p.priceTo}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-foreground capitalize">{p.priceFrom}</span>
                  )}
                  <span className="text-base text-muted-foreground ml-2">{p.unit}</span>
                </div>
                <p className="text-sm font-semibold text-primary mb-6">{p.monthly}</p>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={p.popular ? "premium" : "outline"}
                  className="w-full"
                  size="lg"
                  onClick={() => document.getElementById("b2b-contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Poptat nabídku
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YEARLY DISCOUNT TABLE */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">
                <TrendingDown className="w-3 h-3 mr-1" /> Sleva 8 %
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Roční přehled & sleva za pololetní kontrakt
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Při uzavření smlouvy na min. 6 měsíců získáte 8 % slevu z celkové ceny.
                Fakturace měsíčně, bez skrytých poplatků.
              </p>
            </div>
            <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left p-4 font-semibold text-foreground">Varianta</th>
                      <th className="text-right p-4 font-semibold text-foreground">Ročně (standard)</th>
                      <th className="text-right p-4 font-semibold text-foreground">Sleva 8 %</th>
                      <th className="text-right p-4 font-semibold text-foreground">Ročně po slevě</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyTable.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-border last:border-0 ${
                          row.highlight ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="p-4 font-medium text-foreground">{row.variant}</td>
                        <td className="p-4 text-right text-muted-foreground">{row.standard}</td>
                        <td className="p-4 text-right text-green-700 dark:text-green-400 font-medium">
                          {row.discount}
                        </td>
                        <td className="p-4 text-right font-bold text-primary">{row.final}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Výpovědní lhůta 30 dní po uplynutí sjednané doby. Smlouva bez skrytých poplatků.
            </p>
          </div>
        </div>
      </section>

      {/* EXTRAS */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Příplatkové služby
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Volitelné rozšíření k libovolnému balíčku.
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-card rounded-2xl border-2 border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">Služba</th>
                    <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">
                      Frekvence
                    </th>
                    <th className="text-right p-4 font-semibold text-foreground">Cena</th>
                  </tr>
                </thead>
                <tbody>
                  {extras.map((e, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 text-foreground font-medium text-sm">{e.name}</td>
                      <td className="p-4 text-muted-foreground text-sm hidden md:table-cell">
                        {e.freq}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <span className="font-bold text-primary">{e.price}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Proč RadoClean pro Vaši firmu
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Místní firma z Radotína s vlastními standardy a pojištěním.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {advantages.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="bg-card border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3">
              <Award className="w-3 h-3 mr-1" /> Reference
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Důvěřují nám
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {references.map((r, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border-2 border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{r.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{r.stat}</div>
                    <div className="text-xs text-muted-foreground">{r.statLabel}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground border-t border-border pt-4">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="b2b-contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3">
                <Sparkles className="w-3 h-3 mr-1" /> Nezávazná poptávka
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Připravíme Vám nabídku na míru
              </h2>
              <p className="text-muted-foreground">
                Vyplňte formulář a do 24 hodin Vám pošleme nezávaznou kalkulaci.
                Nebo zavolejte přímo Veronice — jsme za rohem.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-2xl border-2 border-border p-6 md:p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Společnost *</Label>
                  <Input
                    id="company"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Např. Illegal Barber Shop"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Jméno kontaktní osoby *</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jméno a příjmení"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vas@email.cz"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+420 ..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sector">Segment</Label>
                  <Input
                    id="sector"
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    placeholder="Fitness, holičství..."
                  />
                </div>
                <div>
                  <Label htmlFor="area">Plocha (m²)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="80"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frekvence</Label>
                  <Input
                    id="frequency"
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    placeholder="1× týdně"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Doplňující informace</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Stručný popis prostoru, specifické požadavky..."
                />
              </div>

              <Button type="submit" variant="premium" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Odesílám..." : "Odeslat poptávku"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-border">
                <a
                  href="tel:+420603425692"
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Veronika Kolčavá</div>
                    <div className="font-semibold text-foreground text-sm">+420 603 425 692</div>
                  </div>
                </a>
                <a
                  href="mailto:veronika@radoclean.cz"
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">E-mail</div>
                    <div className="font-semibold text-foreground text-sm">veronika@radoclean.cz</div>
                  </div>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Rádi Vám připravíme prohlídku přímo na místě
          </h2>
          <p className="text-muted-foreground mb-6">
            Zavolejte nebo napište — jsme za rohem.
          </p>
          <a href="tel:+420603425692">
            <Button variant="premium" size="lg">
              <Phone className="mr-2 w-5 h-5" />
              +420 603 425 692
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default B2B;
