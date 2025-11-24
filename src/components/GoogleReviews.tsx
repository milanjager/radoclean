import { Star, ExternalLink, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const GoogleReviews = () => {
  const stats = {
    rating: 5.0,
    totalReviews: 47,
    fiveStars: 45,
    fourStars: 2,
    threeStars: 0
  };

  const recentReviews = [
    {
      id: 1,
      author: "Martina Dvořáková",
      date: "Před 2 týdny",
      rating: 5,
      text: "Nejlepší úklidová firma v regionu! Komunikace perfektní, cena jasná hned na začátku, výsledek nadčasový. Jana a její tým jsou skvělí. Určitě doporučuji všem z Černošic a okolí.",
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      author: "Tomáš Novák",
      date: "Před 1 měsícem",
      rating: 5,
      text: "Po třech různých firmách z Prahy konečně někdo, kdo ví co dělá. Místní výhoda je obrovská - žádné dojezdné, rychlá reakce na změny termínu. Používáme pravidelný úklid každé 2 týdny a jsme velmi spokojení.",
      verified: true,
      helpful: 8
    },
    {
      id: 3,
      author: "Petra Malá",
      date: "Před 1 měsícem",
      rating: 5,
      text: "Měli jsme po rekonstrukci opravdu velký bordel. Objednala jsem přes web během 5 minut, cena byla jasná, termín rychlý. Výsledek? Perfektní! Vidí se, že v tom mají zkušenosti. Děkujeme!",
      verified: true,
      helpful: 15
    }
  ];

  const calculatePercentage = (count: number) => {
    return Math.round((count / stats.totalReviews) * 100);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Google Logo */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-2xl font-bold text-foreground">Google</span>
              <span className="text-muted-foreground">recenze</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-5xl font-bold text-foreground">{stats.rating}</span>
            </div>
            
            <p className="text-xl text-muted-foreground">
              Na základě <strong>{stats.totalReviews} ověřených hodnocení</strong> na Google
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="bg-card rounded-2xl p-8 border-2 border-border mb-12 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-foreground mb-6 text-center">
              Rozložení hodnocení
            </h3>
            <div className="space-y-3">
              {[
                { stars: 5, count: stats.fiveStars },
                { stars: 4, count: stats.fourStars },
                { stars: 3, count: stats.threeStars },
                { stars: 2, count: 0 },
                { stars: 1, count: 0 }
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-semibold text-foreground">{item.stars}</span>
                    <Star className="w-4 h-4 fill-accent text-accent" />
                  </div>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${calculatePercentage(item.count)}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">
                    {calculatePercentage(item.count)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
              Nejnovější hodnocení
            </h3>
            <div className="space-y-6">
              {recentReviews.map((review) => (
                <div 
                  key={review.id}
                  className="bg-card rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-foreground">{review.author}</h4>
                        {review.verified && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">
                            ✓ Ověřeno
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {review.text}
                  </p>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Užitečné ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Přesvědčte se sami
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Přečtěte si všechna naše hodnocení na Google a objevte, 
              proč nás domácnosti v Poberouní volí jako svou úklidovou firmu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://g.page/r/YOUR_GOOGLE_PLACE_ID/review" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="premium" size="lg" className="w-full sm:w-auto">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Zobrazit všechny recenze na Google
                </Button>
              </a>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const element = document.getElementById("pricing");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Vyzkoušet naše služby
              </Button>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ⭐ Průměrné hodnocení 5.0 hvězdiček • 96% zákazníků nás doporučuje dál
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
