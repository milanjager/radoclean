import { CheckCircle2, Clock, Shield, Heart } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "Žádné kecy",
      description: "Ukazujeme reálné výsledky u reálných českých domovů. Ne dokonalé modely v neexistujících bytech.",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Cena jasně a hned",
      description: "Byt 3+kk = 2 500 Kč. Hotovo. Žádné 'cena na dotaz' nebo komplikované kalkulace za m².",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Online rezervace",
      description: "Kliknete na termín v kalendáři a máte hotovo. Bez zbytečných telefonátů a dohadování.",
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Místní lidé",
      description: "K vám přijede konkrétní člověk, kterého vidíte na webu. Ne náhodný člověk z call centra.",
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Jak vám můžeme pomoci?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Zjistili jsme, co ostatní úklidové firmy v oblasti dělají špatně. A děláme to jinak.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-2xl shadow-sm hover:shadow-warm transition-shadow border border-border"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
