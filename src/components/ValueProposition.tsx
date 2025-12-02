import { CheckCircle2, Clock, Shield, Heart, Sparkles, Truck, Award } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const ValueProposition = () => {
  const values = [
    {
      icon: CheckCircle2,
      title: "Žádné kecy",
      description: "Ukazujeme reálné výsledky u reálných českých domovů. Ne dokonalé modely v neexistujících bytech.",
      highlight: null,
    },
    {
      icon: Clock,
      title: "Cena jasně a hned",
      description: "Byt 3+kk = 2 500 Kč. Hotovo. Žádné 'cena na dotaz' nebo komplikované kalkulace za m².",
      highlight: "O 30% rychlejší",
      isCounter: true,
    },
    {
      icon: Shield,
      title: "Online rezervace",
      description: "Kliknete na termín v kalendáři a máte hotovo. Bez zbytečných telefonátů a dohadování.",
      highlight: "100% záruka kvality",
      isCounter: false,
    },
    {
      icon: Heart,
      title: "Místní lidé",
      description: "K vám přijede konkrétní člověk, kterého vidíte na webu. Ne náhodný člověk z call centra.",
      highlight: null,
    },
    {
      icon: Sparkles,
      title: "Vybavení v ceně",
      description: "Všechno profesionální vybavení a čistící prostředky máme s sebou. Vy nemusíte nic připravovat.",
      highlight: "Ušetříte 500-800 Kč",
      isCounter: true,
    },
    {
      icon: Truck,
      title: "Doprava zdarma",
      description: "Doprava po celém Poberouní je vždy v ceně. Žádné překvapivé příplatky.",
      highlight: "Doprava v ceně",
      isCounter: false,
    },
    {
      icon: Award,
      title: "Certifikovaní specialisté",
      description: "Náš tým prochází pravidelným odborným školením a má certifikace pro profesionální úklid.",
      highlight: "Odborné školení",
      isCounter: false,
    },
    {
      icon: Shield,
      title: "Ekologické prostředky",
      description: "Používáme pouze certifikované ekologické čistící prostředky, které jsou šetrné k přírodě i vašemu zdraví.",
      highlight: "Eco-friendly",
      isCounter: false,
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Proč si vybrat Rado Clean
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Zjistili jsme, co ostatní úklidové firmy v Poberouní dělají špatně. A děláme to jinak.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group relative bg-card rounded-2xl p-8 shadow-sm border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                {value.highlight && (
                  <div className="absolute -top-4 -right-4">
                    <div
                      className="inline-flex items-center text-base font-bold text-primary backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/30 via-primary-glow/20 to-primary/10 animate-gradient-move"
                      style={{
                        backgroundSize: '200% 200%',
                        boxShadow:
                          '0 0 30px hsl(var(--primary-glow) / 0.5), 0 0 60px hsl(var(--primary) / 0.3), inset 0 0 20px hsl(var(--primary) / 0.1)',
                      }}
                    >
                      {value.isCounter ? (
                        <AnimatedCounter value={value.highlight} duration={2500} />
                      ) : (
                        <span className="text-sm">{value.highlight}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className={`mb-4 ${value.highlight ? 'mt-8' : ''}`}>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
