import { Shield, Users, Award, Clock } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      value: "150+",
      label: "Domácností v Poberouní",
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      value: "5 let",
      label: "Působíme v oblasti",
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      value: "2M Kč",
      label: "Pojištění odpovědnosti",
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      value: "100%",
      label: "Záruka spokojenosti",
    },
  ];

  const streets = [
    "Vrážská",
    "Karlická", 
    "Na Výšince",
    "Zářičská",
    "Dobřichovická",
    "U Jalového dvora"
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-secondary/50 via-secondary/30 to-secondary/50 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            ✓ Už <span className="text-primary">150+ spokojených sousedů</span> v Poberouní
          </p>
          <p className="text-sm text-muted-foreground">
            📍 Uklízíme v ulicích: {streets.join(" • ")}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="mb-3 p-3 bg-primary/10 rounded-2xl">
                {badge.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {badge.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {badge.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
