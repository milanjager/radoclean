import { Shield, Star, CheckCircle2, Users } from "lucide-react";

const CertificationsAwards = () => {
  const highlights = [
    {
      icon: Shield,
      title: "Pojištění 5M Kč",
      subtitle: "Profesní odpovědnost"
    },
    {
      icon: Star,
      title: "5.0 hodnocení",
      subtitle: "Google Reviews"
    },
    {
      icon: CheckCircle2,
      title: "Ekologické prostředky",
      subtitle: "Certifikované & hypoalergenní"
    },
    {
      icon: Users,
      title: "500+ domácností",
      subtitle: "Spokojených zákazníků"
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Profesionální služby s certifikací
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plně pojištěni, certifikováni a důvěryhodní
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 text-center border hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CertificationsAwards;
