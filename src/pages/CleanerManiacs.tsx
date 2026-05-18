import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, MapPin, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CleanerManiacs = () => {
  useEffect(() => {
    document.title = "Cleaner Maniacs – alternativa | Rado Clean Praha-západ";
    const setMeta = (name: string, content: string, prop = false) => {
      const sel = prop ? `meta[property='${name}']` : `meta[name='${name}']`;
      let el = document.querySelector<HTMLMetaElement>(sel);
      if (!el) {
        el = document.createElement("meta");
        if (prop) el.setAttribute("property", name);
        else el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Hledáte Cleaner Maniacs? Nemají web — zkuste Rado Clean: profesionální úklid v Radotíně, Černošicích a Zbraslavi. Transparentní ceny od 1 800 Kč, online rezervace, hodnocení 4,9/5."
    );
    setMeta("keywords", "cleaner maniacs, cleaner maniacs praha, cleaner maniacs úklid, cleaner maniacs recenze, cleaner maniacs kontakt, cleaner maniacs alternativa, úklidová služba Praha-západ, Rado Clean");
    setMeta("og:title", "Cleaner Maniacs alternativa – Rado Clean", true);
    setMeta("og:description", "Cleaner Maniacs nemá web ani online rezervaci. Rado Clean ano – transparentní ceny, hodnocení 4,9/5.", true);
    setMeta("og:url", "https://radoclean.cz/cleaner-maniacs", true);

    let canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://radoclean.cz/cleaner-maniacs";

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "ld-cleaner-maniacs";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Mají Cleaner Maniacs web?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cleaner Maniacs aktuálně nemají vlastní web ani online rezervační systém. Pokud hledáte spolehlivou úklidovou službu v Praze a okolí s transparentním ceníkem a možností online rezervace, doporučujeme Rado Clean."
          }
        },
        {
          "@type": "Question",
          name: "Jaká je alternativa k Cleaner Maniacs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Rado Clean je rodinný úklidový servis působící v Radotíně, Černošicích, Zbraslavi a Praze-západ. Nabízí běžný úklid od 1 800 Kč, generální úklid, úklid po rekonstrukci a B2B služby pro firmy."
          }
        },
        {
          "@type": "Question",
          name: "Kde najdu kontakt na Cleaner Maniacs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cleaner Maniacs nemají oficiální online kontakt. Pro úklid v Praze-západ volejte Rado Clean: +420 777 077 414 nebo pište na veronika@radoclean.cz."
          }
        }
      ]
    });
    document.head.appendChild(ld);
    return () => {
      document.getElementById("ld-cleaner-maniacs")?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          <header className="mb-12 text-center">
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Hledáte Cleaner Maniacs?
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Cleaner Maniacs nemají web — vyzkoušejte Rado Clean
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Profesionální úklidová služba v Praze-západ s transparentními
              cenami, online rezervací a hodnocením 4,9/5. Bez čekání na zpětný
              hovor.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Button asChild variant="premium" size="lg">
                <Link to="/#pricing">Spočítat cenu úklidu</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="tel:+420777077414">
                  <Phone className="w-4 h-4 mr-2" /> +420 777 077 414
                </a>
              </Button>
            </div>
          </header>

          <section className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Proč Rado Clean místo Cleaner Maniacs?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Firma <strong>Cleaner Maniacs</strong> v Praze nemá vlastní
              webovou prezentaci ani online ceník. Když potřebujete rychle
              uklidit byt, dům nebo kancelář, je obtížné si u nich ověřit ceny,
              dostupnost termínů nebo si rezervovat úklid mimo pracovní dobu.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Radoclean s.r.o.</strong> (IČO 24566241) je rodinný
              úklidový servis se sídlem v Praze 5, který nabízí přesný opak —
              veškeré ceny máte předem, rezervaci uděláte online za 2 minuty a
              tým fyzicky pracuje v Radotíně, Černošicích, Zbraslavi a okolí
              Prahy-západ.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="border border-border rounded-xl p-6 bg-muted/30">
              <h3 className="font-bold mb-4 text-muted-foreground">
                Cleaner Maniacs
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✕ Nemají oficiální web</li>
                <li>✕ Ceník není veřejně dostupný</li>
                <li>✕ Bez online rezervace</li>
                <li>✕ Nelze ověřit recenze</li>
                <li>✕ Kontakt jen telefonicky</li>
              </ul>
            </div>
            <div className="border-2 border-primary rounded-xl p-6 bg-primary/5">
              <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                <Star className="w-5 h-5 fill-primary" /> Rado Clean
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Transparentní ceny od 1 800 Kč</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Online rezervace 24/7</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Hodnocení 4,9/5 (127 recenzí)</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Vlastní vybavení a doprava v ceně</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Záruka spokojenosti</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" /> Kde uklízíme
            </h2>
            <p className="text-muted-foreground">
              Radotín, Černošice, Zbraslav, Dobřichovice, Řevnice a další obce
              Prahy-západ. Pokud jste dosud hledali „Cleaner Maniacs Praha", jsme
              vám fyzicky blíž a obvykle máme volný termín do 48 hodin.
            </p>
          </section>

          <section className="bg-primary text-primary-foreground rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Místo hledání Cleaner Maniacs zarezervujte úklid teď
            </h2>
            <p className="mb-6 opacity-90">
              Spočítejte si cenu úklidu za 30 sekund a vyberte termín, který
              vám sedne.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/#pricing">Spočítat cenu</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/#contact">Napsat poptávku</Link>
              </Button>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default CleanerManiacs;
