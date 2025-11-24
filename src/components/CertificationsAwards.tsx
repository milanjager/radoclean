import { Award, Shield, Star, CheckCircle2, TrendingUp, Users, Leaf, Lock } from "lucide-react";
import certEco from "@/assets/cert-eco.jpg";
import certInsurance from "@/assets/cert-insurance.jpg";
import certQuality from "@/assets/cert-quality.jpg";
import certTraining from "@/assets/cert-training.jpg";

const CertificationsAwards = () => {
  const certifications = [
    {
      image: certEco,
      title: "Eco-Friendly Cleaning",
      subtitle: "Certifikát ekologického úklidu",
      year: "2024",
      issuer: "Czech Cleaning Association",
      description: "Používáme pouze certifikované ekologické a hypoalergenní čistící prostředky"
    },
    {
      image: certInsurance,
      title: "Pojištění odpovědnosti",
      subtitle: "Plné krytí škod až 5M Kč",
      year: "Platné",
      issuer: "Generali Pojišťovna",
      description: "Kompletní pojištění profesní odpovědnosti za případné škody"
    },
    {
      image: certQuality,
      title: "ISO Quality Standards",
      subtitle: "Mezinárodní standard kvality",
      year: "2023",
      issuer: "ISO Certification Body",
      description: "Certifikováno podle mezinárodních standardů kvality služeb"
    },
    {
      image: certTraining,
      title: "Professional Training",
      subtitle: "Odborné školení týmu",
      year: "2024",
      issuer: "Professional Cleaning Institute",
      description: "Všichni zaměstnanci pravidelně prochází odbornými školeními"
    }
  ];

  const awards = [
    {
      icon: Award,
      title: "Nejlepší úklidová firma",
      subtitle: "Poberouní 2023",
      description: "Ocenění od místní Hospodářské komory"
    },
    {
      icon: Star,
      title: "5.0 hodnocení",
      subtitle: "Google Reviews",
      description: "Průměr 47 hodnocení zákazníků"
    },
    {
      icon: TrendingUp,
      title: "97% retention rate",
      subtitle: "Pravidelní zákazníci",
      description: "Zákazníci u nás zůstávají dlouhodobě"
    },
    {
      icon: Users,
      title: "500+ spokojených domácností",
      subtitle: "Od roku 2020",
      description: "Rostoucí komunita v Poberouní"
    }
  ];

  const memberships = [
    {
      icon: Shield,
      name: "Česká asociace čistících služeb",
      role: "Aktivní člen",
      since: "2021"
    },
    {
      icon: Leaf,
      name: "Ekologické úklidy ČR",
      role: "Certifikovaný partner",
      since: "2022"
    },
    {
      icon: CheckCircle2,
      name: "Hospodářská komora Praha-západ",
      role: "Registrovaná firma",
      since: "2020"
    },
    {
      icon: Lock,
      name: "Data Protection Alliance",
      role: "GDPR compliant člen",
      since: "2023"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🏆 Důvěryhodnost & Kvalita
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Certifikace, ocenění a členství
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Jsme plně certifikovaná a pojištěná firma s členstvím v profesních organizacích. 
            Vaše bezpečnost a spokojenost jsou pro nás prioritou.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Profesionální certifikace
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className="bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl group"
              >
                {/* Certificate Image */}
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <img 
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Certificate Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-foreground text-sm leading-tight flex-1">
                      {cert.title}
                    </h4>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold ml-2">
                      {cert.year}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary mb-2">
                    {cert.subtitle}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {cert.description}
                  </p>
                  <p className="text-xs text-muted-foreground italic border-t border-border pt-2">
                    Vydal: {cert.issuer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Ocenění & Úspěchy
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {awards.map((award, index) => {
              const Icon = award.icon;
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-card to-muted/30 rounded-2xl p-6 border-2 border-border hover:border-accent/50 transition-all hover:shadow-lg group"
                >
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors group-hover:scale-110 duration-300">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="font-bold text-foreground text-lg mb-1">
                    {award.title}
                  </h4>
                  <p className="text-sm font-semibold text-primary mb-2">
                    {award.subtitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {award.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Memberships Section */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Členství v profesních organizacích
          </h3>
          <div className="bg-card rounded-3xl p-8 md:p-12 border-2 border-border shadow-xl">
            <div className="grid md:grid-cols-2 gap-8">
              {memberships.map((membership, index) => {
                const Icon = membership.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-1">
                        {membership.name}
                      </h4>
                      <p className="text-sm text-primary font-semibold mb-1">
                        {membership.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Členem od {membership.since}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 text-center pt-8 border-t border-border">
              <p className="text-muted-foreground mb-4">
                💼 <strong>Profesionalita ověřená certifikacemi.</strong> Jsme plně transparentní firma s ověřitelnými referencemi.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Pojištění 5M Kč</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>GDPR compliant</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Eko certifikace</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Prověřený tým</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Statement */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            <strong>Transparentnost je pro nás klíčová.</strong> Všechny naše certifikace, pojištění a členství jsou ověřitelné. 
            Rádi vám na vyžádání předložíme kopie certifikátů nebo pojistných smluv.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CertificationsAwards;
