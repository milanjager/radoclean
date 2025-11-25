import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PriceComparison = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const items = [
    { feature: "Základní úklid", radoClean: true, competition: true },
    { feature: "Čistící prostředky", radoClean: true, competition: false, note: "+250 Kč" },
    { feature: "Doprava", radoClean: true, competition: false, note: "+300 Kč" },
    { feature: "Profesionální vybavení", radoClean: true, competition: false, note: "+400 Kč" },
    { feature: "Záruka kvality", radoClean: true, competition: false },
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Co je zahrnuto v ceně
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Porovnání s běžnou nabídkou na trhu
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* Header */}
            <div className={`grid grid-cols-3 gap-4 p-6 bg-muted/30 border-b border-border transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              <div className="text-left">
                <h3 className="font-bold text-foreground text-lg">Položka</h3>
              </div>
              <div className="text-center">
                <div className="inline-block bg-primary/10 px-4 py-2 rounded-lg">
                  <h3 className="font-bold text-primary text-lg">Rado Clean</h3>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-muted-foreground text-lg">Běžná nabídka</h3>
              </div>
            </div>

            {/* Items */}
            {items.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 p-6 items-center ${
                  index !== items.length - 1 ? "border-b border-border" : ""
                } hover:bg-muted/20 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-left">
                  <span className="text-foreground font-medium">{item.feature}</span>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-center">
                  {item.radoClean && !item.competition ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        <X className="w-5 h-5 text-muted-foreground" />
                      </div>
                      {item.note && (
                        <span className="text-sm text-muted-foreground font-medium">{item.note}</span>
                      )}
                    </div>
                  ) : (
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Total */}
            <div className={`grid grid-cols-3 gap-4 p-6 bg-primary/5 border-t-2 border-primary/20 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`} style={{ transitionDelay: `${items.length * 100}ms` }}>
              <div className="text-left">
                <span className="text-foreground font-bold text-lg">Celková cena</span>
              </div>
              <div className="text-center">
                <div className="inline-block bg-primary px-6 py-3 rounded-lg">
                  <span className="text-primary-foreground font-bold text-xl">2500 Kč</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-muted-foreground line-through text-lg">2000 Kč</span>
                  <span className="text-foreground font-bold text-xl">2950 Kč</span>
                  <span className="text-xs text-muted-foreground">s doplatky</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-8 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`} style={{ transitionDelay: `${(items.length + 1) * 100}ms` }}>
            <p className="text-lg text-muted-foreground">
              Průměrná úspora: <span className="text-primary font-bold text-2xl">450 Kč</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              *Na základě porovnání s 3 místními konkurenty
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceComparison;
