import { CheckCircle2, Clock, Sparkles, Shield, Truck, Award } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const WhyUs = () => {
  const advantages = [
    {
      icon: Sparkles,
      title: "Vybavení v ceně",
      description: "Vše s sebou",
      highlight: "Ušetříte 500-800 Kč",
      isCounter: true,
    },
    {
      icon: Clock,
      title: "Rychlost provedení",
      description: "Za 4-6 hodin",
      highlight: "O 30% rychlejší",
      isCounter: true,
    },
    {
      icon: Shield,
      title: "Kvalita a záruka",
      description: "Oprava zdarma",
      highlight: "100% záruka kvality",
      isCounter: false,
    },
    {
      icon: Truck,
      title: "Doprava zdarma",
      description: "Vždy v ceně",
      highlight: "Doprava v ceně",
      isCounter: false,
    },
    {
      icon: Award,
      title: "Certifikovaní specialisté",
      description: "Odborné školení",
      highlight: "Odborné školení",
      isCounter: false,
    },
    {
      icon: CheckCircle2,
      title: "Ekologické prostředky",
      description: "Šetrné a účinné",
      highlight: "Eco-friendly",
      isCounter: false,
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Proč si vybrat nás?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Porovnali jsme se s 5 nejlepšími konkurenty v Praze. Zde je důvod, proč jsou naše ceny férové a naše služby lepší.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div
                key={index}
                className="group relative bg-card rounded-2xl p-8 shadow-sm border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="absolute -top-4 -right-4">
                  <div 
                    className="inline-flex items-center text-2xl font-bold text-primary backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/30 via-primary-glow/20 to-primary/10 animate-gradient-move"
                    style={{ 
                      backgroundSize: '200% 200%',
                      boxShadow: '0 0 30px hsl(var(--primary-glow) / 0.5), 0 0 60px hsl(var(--primary) / 0.3), inset 0 0 20px hsl(var(--primary) / 0.1)'
                    }}
                  >
                    {advantage.isCounter ? (
                      <AnimatedCounter value={advantage.highlight} duration={2500} />
                    ) : (
                      <span>{advantage.highlight}</span>
                    )}
                  </div>
                </div>
                
                <div className="mb-4 mt-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {advantage.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
