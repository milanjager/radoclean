import { Shield, Users, Award, Clock } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      value: "150+",
      label: "Spokojených zákazníků",
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
      label: "Garance spokojenosti",
    },
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="mb-3 p-3 bg-primary/10 rounded-full">
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
