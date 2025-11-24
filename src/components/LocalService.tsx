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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Místní firma • Žádné dojezdné
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sídlíme v Radotíně a obsluhujeme Černošice, Zbraslav a okolí
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-xl p-5 border hover:shadow-lg transition-all text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {advantage.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {advantage.benefit}
                </p>
              </div>
            );
          })}
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl p-6 md:p-8 border shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Hlavní oblasti
            </h3>

            <div className="grid sm:grid-cols-3 gap-4">
              {serviceCities.filter(city => city.highlight).map((city, index) => (
                <div 
                  key={index}
                  className="bg-primary/5 rounded-xl p-5 border border-primary/20 text-center"
                >
                  <h4 className="text-lg font-bold text-primary mb-2">
                    {city.name}
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="text-muted-foreground">
                      Reakce: <span className="font-semibold text-foreground">{city.responseTime}</span>
                    </div>
                    <div className="text-accent font-semibold">
                      {city.customers} zákazníků
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalService;
