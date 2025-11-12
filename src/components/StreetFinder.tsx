import { useState } from "react";
import { Search, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const StreetFinder = () => {
  const [street, setStreet] = useState("");
  const [searchResult, setSearchResult] = useState<{
    street: string;
    neighbors: number;
    area: string;
  } | null>(null);

  // Mock data - v produkci připojit k databázi
  const streetData: Record<string, { neighbors: number; area: string }> = {
    "vrážská": { neighbors: 3, area: "Černošice" },
    "radotínská": { neighbors: 5, area: "Radotín" },
    "pražská": { neighbors: 4, area: "Zbraslav" },
    "zbraslav": { neighbors: 2, area: "Zbraslav" },
    "karlická": { neighbors: 6, area: "Černošice" },
    "mokropeská": { neighbors: 3, area: "Černošice" },
    "sulická": { neighbors: 4, area: "Radotín" },
  };

  const handleSearch = () => {
    const normalizedStreet = street.toLowerCase().trim();
    const result = streetData[normalizedStreet];
    
    if (result) {
      setSearchResult({
        street: street,
        neighbors: result.neighbors,
        area: result.area,
      });
    } else {
      setSearchResult({
        street: street,
        neighbors: 0,
        area: "této oblasti",
      });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Lokální důvěra
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Najděte svou ulici
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Zjistěte, kolik vašich sousedů už využívá naše služby
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Např. Vrážská, Radotínská..."
                value={street}
                onChange={(e) => {
                  setSearchResult(null);
                  setStreet(e.target.value);
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              size="lg"
              className="h-12"
              disabled={!street.trim()}
            >
              Vyhledat
            </Button>
          </div>

          {searchResult && (
            <div className="bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
              {searchResult.neighbors > 0 ? (
                <>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Users className="w-8 h-8 text-primary" />
                    <span className="text-5xl font-bold text-primary">
                      {searchResult.neighbors}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Skvělá zpráva!
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    V ulici <span className="font-semibold text-foreground">{searchResult.street}</span> už 
                    uklízíme u <span className="font-semibold text-primary">{searchResult.neighbors} vašich sousedů</span>
                  </p>
                  <Button 
                    onClick={scrollToContact}
                    size="lg"
                    className="gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Přidat se k sousedům
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Buďte první ve své ulici!
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    V oblasti <span className="font-semibold text-foreground">{searchResult.area}</span> už 
                    máme spokojené zákazníky. Staňte se prvním v ulici {searchResult.street}.
                  </p>
                  <Button 
                    onClick={scrollToContact}
                    size="lg"
                    variant="premium"
                  >
                    Objednat jako první
                  </Button>
                </>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-6">
            💡 <span className="font-semibold">Tip:</span> Pokud si v jedné ulici objednají úklid 3 domácnosti 
            ve stejný den, dostanete všichni <span className="font-semibold text-primary">10% slevu</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default StreetFinder;
