import { MapPin, Clock, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const LocalService = () => {
  const serviceCities = [
    {
      name: "Černošice",
      distance: "5 km",
      responseTime: "15 min",
      customers: "180+",
      highlight: true
    },
    {
      name: "Radotín",
      distance: "0 km",
      responseTime: "10 min",
      customers: "250+",
      highlight: true
    },
    {
      name: "Zbraslav",
      distance: "8 km",
      responseTime: "20 min",
      customers: "150+",
      highlight: true
    },
    {
      name: "Dobřichovice",
      distance: "12 km",
      responseTime: "25 min",
      customers: "90+"
    },
    {
      name: "Řevnice",
      distance: "15 km",
      responseTime: "30 min",
      customers: "70+"
    },
    {
      name: "Mokropsy",
      distance: "7 km",
      responseTime: "18 min",
      customers: "45+"
    }
  ];

  const advantages = [
    {
      icon: MapPin,
      title: "Jsme místní",
      description: "Sídlíme v Radotíně, takže vás máme \"za rohem\"",
      benefit: "Žádné dojezdné"
    },
    {
      icon: Clock,
      title: "Rychlá reakce",
      description: "Blízkost znamená flexibilitu a rychlé termíny",
      benefit: "Dojezd 10-30 min"
    },
    {
      icon: CheckCircle,
      title: "Známe region",
      description: "Rozumíme potřebám domácností v Poberouní",
      benefit: "Lokální expertise"
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🏠 Místní výhoda
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Jsme z Radotína • Uklízíme pro vaše sousedy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Na rozdíl od velkých pražských firem nejsme "z druhého konce města". 
            Jsme místní a to znamená <strong>žádné dojezdné</strong>, rychlejší servis a osobnější přístup.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {advantage.title}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {advantage.description}
                </p>
                <div className="inline-block bg-accent/10 text-accent text-sm font-semibold px-3 py-1 rounded-full">
                  {advantage.benefit}
                </div>
              </div>
            );
          })}
        </div>

        {/* Service Area Map */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-3xl p-8 md:p-12 border-2 border-border shadow-xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-3">
                Oblasti, které obsluhujeme
              </h3>
              <p className="text-muted-foreground">
                Soustředíme se na kvalitu místo kvantity. Uklízíme pouze tam, kde to stihneme včas a dobře.
              </p>
            </div>

            {/* Cities Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {serviceCities.map((city, index) => (
                <div 
                  key={index}
                  className={`rounded-xl p-6 transition-all hover:scale-105 ${
                    city.highlight 
                      ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20' 
                      : 'bg-muted border-2 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className={`text-xl font-bold ${
                      city.highlight ? 'text-primary' : 'text-foreground'
                    }`}>
                      {city.name}
                    </h4>
                    {city.highlight && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                        TOP
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vzdálenost:</span>
                      <span className="font-semibold text-foreground">{city.distance}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Reakce:</span>
                      <span className="font-semibold text-foreground">{city.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Zákazníků:</span>
                      <span className="font-semibold text-accent">{city.customers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 text-center">
              <h4 className="text-2xl font-bold text-foreground mb-3">
                Vaše město není v seznamu?
              </h4>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Uklízíme i v okolních oblastech do 20 km od Radotína. 
                Zavolejte nám a domluvíme se na detailech.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+420777123456">
                  <Button variant="premium" size="lg" className="w-full sm:w-auto">
                    <Phone className="w-4 h-4 mr-2" />
                    Zavolat: +420 777 123 456
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    const element = document.getElementById("contact");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Napsat zprávu
                </Button>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                💚 <strong>Lokální firma = lokální komunita.</strong> Část našich tržeb investujeme zpět do místních spolků a aktivit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalService;
