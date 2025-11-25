import { Check, X } from "lucide-react";

const PriceComparison = () => {
  const items = [
    { feature: "Základní úklid", radoClean: true, competition: true },
    { feature: "Profesionální vybavení", radoClean: true, competition: false, note: "+500 Kč" },
    { feature: "Čistící prostředky", radoClean: true, competition: false, note: "+300 Kč" },
    { feature: "Doprava", radoClean: true, competition: false, note: "+400 Kč" },
    { feature: "Certifikovaný tým", radoClean: true, competition: false },
    { feature: "Záruka kvality", radoClean: true, competition: false },
    { feature: "Parní čistič", radoClean: true, competition: false, note: "+600 Kč" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Proč jsme výhodnější
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Porovnání toho, co dostanete u nás vs. u konkurence za podobnou základní cenu
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-muted/30 border-b border-border">
              <div className="text-left">
                <h3 className="font-bold text-foreground text-lg">Co dostanete</h3>
              </div>
              <div className="text-center">
                <div className="inline-block bg-primary/10 px-4 py-2 rounded-lg">
                  <h3 className="font-bold text-primary text-lg">Rado Clean</h3>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-muted-foreground text-lg">Konkurence</h3>
              </div>
            </div>

            {/* Items */}
            {items.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 p-6 items-center ${
                  index !== items.length - 1 ? "border-b border-border" : ""
                } hover:bg-muted/20 transition-colors`}
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
            <div className="grid grid-cols-3 gap-4 p-6 bg-primary/5 border-t-2 border-primary/20">
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
                  <span className="text-foreground font-bold text-xl">3800 Kč</span>
                  <span className="text-xs text-muted-foreground">s příplatky</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-muted-foreground">
              Ušetříte až <span className="text-primary font-bold text-2xl">1300 Kč</span> oproti konkurenci
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceComparison;
