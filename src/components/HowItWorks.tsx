import { Calendar, CheckCircle, Truck, Sparkles, ClipboardCheck, Heart } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Calendar,
      title: "1. Rezervace online za 2 minuty",
      description: "Vyberte si balíček, datum a čas. Žádné telefonáty, vše pohodlně z mobilu nebo počítače.",
      time: "2 min",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CheckCircle,
      title: "2. Okamžité potvrzení emailem",
      description: "Dostanete detailní potvrzení s informacemi o týmu, cenou a časem příjezdu.",
      time: "Hned",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: Truck,
      title: "3. Příjezd našeho týmu",
      description: "Přijedeme přesně včas s kompletním vybavením a profesionálními čistícími prostředky.",
      time: "V dohodnutý čas",
      color: "from-teal-500 to-green-500",
    },
    {
      icon: Sparkles,
      title: "4. Důkladný úklid podle standardu",
      description: "Postupujeme podle osvědčeného checlistu, abyste měli jistotu, že se nic nepřehlédne.",
      time: "2-4 hodiny",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: ClipboardCheck,
      title: "5. Kontrola kvality před odchodem",
      description: "Společně projdeme úklid a případné nedostatky okamžitě napravíme.",
      time: "5-10 min",
      color: "from-emerald-500 to-lime-500",
    },
    {
      icon: Heart,
      title: "6. Užívejte si čistý domov",
      description: "Vracíte se domů k dokonale čistému prostředí. Máte víkend jen pro sebe!",
      time: "24/7",
      color: "from-lime-500 to-primary",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-primary font-semibold text-sm">JEDNODUCHÝ PROCES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Jak to funguje?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Od rezervace k čistému domovu během několika kliknutí. 
            Žádné starosti, žádné komplikace – vše vyřešíme za vás.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden lg:block relative">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 transform -translate-x-1/2" />
            
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const StepIcon = step.icon;
              
              return (
                <div
                  key={index}
                  className={`relative flex items-center mb-16 last:mb-0 ${
                    isEven ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <div className={`w-5/12 ${isEven ? "pr-12 text-right" : "pl-12 text-left"}`}>
                    <div 
                      className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`flex items-center gap-3 mb-3 ${isEven ? "flex-row-reverse" : "flex-row"}`}>
                        <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {step.time}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 z-10">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg animate-scale-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <StepIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="w-5/12" />
                </div>
              );
            })}
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              
              return (
                <div 
                  key={index}
                  className="relative pl-16 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-primary/20" />
                  )}
                  
                  {/* Icon */}
                  <div className={`absolute left-0 top-0 w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <StepIcon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="bg-card rounded-xl p-5 shadow-md border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {step.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold mb-3">
            Připraveni na čistý domov?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Celý proces zabere méně než 5 minut. Žádné telefonáty, žádné čekání na nabídky. 
            Okamžitá rezervace s pevnou cenou.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const element = document.getElementById("pricing");
                if (element) {
                  const offset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
              }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              🚀 Začít rezervaci
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("faq");
                if (element) {
                  const offset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                }
              }}
              className="px-8 py-3 bg-background border-2 border-border rounded-lg font-semibold hover:border-primary transition-all"
            >
              Mám otázku
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
