import { Shield, CheckCircle, Award, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

const CertificationBadges = () => {
  const certifications = [
    {
      icon: Shield,
      title: "Pojištění odpovědnosti",
      description: "5M Kč krytí škod",
    },
    {
      icon: CheckCircle,
      title: "Prověřený tým",
      description: "Všichni pracovníci prošli background checkem",
    },
    {
      icon: Award,
      title: "Certifikované čistící prostředky",
      description: "Ekologické a hypoalergenní produkty",
    },
    {
      icon: Lock,
      title: "Garance bezpečnosti",
      description: "100% spokojenost nebo vrácení peněz",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Důvěřujte nám s vaším domovem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jsme plně pojištění a certifikovaní. Vaše bezpečnost a spokojenost jsou naší prioritou.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <cert.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{cert.title}</h3>
              <p className="text-sm text-muted-foreground">{cert.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationBadges;
