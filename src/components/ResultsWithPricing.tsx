import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Check, X } from "lucide-react";
import beforeKitchen from "@/assets/before-kitchen.jpg";
import afterKitchen from "@/assets/after-kitchen.jpg";
import beforeBathroom from "@/assets/before-bathroom.jpg";
import afterBathroom from "@/assets/after-bathroom.jpg";
import beforeLiving from "@/assets/before-living.jpg";
import afterLiving from "@/assets/after-living.jpg";
import { Button } from "@/components/ui/button";
import ProgressiveImage from "@/components/ProgressiveImage";

interface BeforeAfter {
  id: number;
  title: string;
  location: string;
  date: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

const ResultsWithPricing = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBefore, setShowBefore] = useState(true);

  const gallery: BeforeAfter[] = [
    {
      id: 1,
      title: "Generální úklid kuchyně",
      location: "Černošice",
      date: "Únor 2024",
      category: "Kuchyň",
      beforeImage: beforeKitchen,
      afterImage: afterKitchen,
      description: "Odstranění mastnoty, čištění spotřebičů, mytí obkladů"
    },
    {
      id: 2,
      title: "Úklid koupelny po rekonstrukci",
      location: "Radotín",
      date: "Leden 2024",
      category: "Koupelna",
      beforeImage: beforeBathroom,
      afterImage: afterBathroom,
      description: "Odstranění stavebního prachu, leštění armatur, čištění spár"
    },
    {
      id: 3,
      title: "Příprava obývacího pokoje na prodej",
      location: "Zbraslav",
      date: "Březen 2024",
      category: "Obývací pokoj",
      beforeImage: beforeLiving,
      afterImage: afterLiving,
      description: "Kompletní úklid, organizace prostoru, mytí oken"
    }
  ];

  const currentItem = gallery[selectedImage];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % gallery.length);
    setShowBefore(true);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + gallery.length) % gallery.length);
    setShowBefore(true);
  };

  const pricingItems = [
    { feature: "Základní úklid", radoClean: true, competition: true },
    { feature: "Čistící prostředky", radoClean: true, competition: false, note: "+250 Kč" },
    { feature: "Doprava", radoClean: true, competition: false, note: "+300 Kč" },
    { feature: "Profesionální vybavení", radoClean: true, competition: false, note: "+400 Kč" },
    { feature: "Záruka kvality", radoClean: true, competition: false },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Skutečné výsledky, férová cena
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Reálné projekty u vašich sousedů v Poberouní s transparentním ceněním
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Gallery Section */}
          <div className="relative bg-card rounded-3xl shadow-2xl overflow-hidden mb-12">
            <div className="relative aspect-video">
              <ProgressiveImage
                src={showBefore ? currentItem.beforeImage : currentItem.afterImage}
                alt={`${showBefore ? 'Před' : 'Po'} - ${currentItem.title}`}
                className=""
                loading="eager"
                aspectRatio="aspect-video"
              />
              
              {/* Before/After Toggle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/90 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowBefore(true)}
                      className={`px-6 py-2 rounded-full font-semibold transition-all ${
                        showBefore
                          ? 'bg-destructive text-destructive-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Před
                    </button>
                    <div className="w-px h-8 bg-border" />
                    <button
                      onClick={() => setShowBefore(false)}
                      className={`px-6 py-2 rounded-full font-semibold transition-all ${
                        !showBefore
                          ? 'bg-accent text-accent-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Po
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm hover:bg-background rounded-full p-3 shadow-lg transition-all hover:scale-110"
                aria-label="Předchozí obrázek"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm hover:bg-background rounded-full p-3 shadow-lg transition-all hover:scale-110"
                aria-label="Další obrázek"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>

              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-foreground">
                {selectedImage + 1} / {gallery.length}
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6 md:p-8 border-t border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {currentItem.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {currentItem.title}
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {currentItem.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{currentItem.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{currentItem.date}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="premium"
                  size="lg"
                  onClick={() => {
                    const element = document.getElementById("pricing");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Chci stejný výsledek
                </Button>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {gallery.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedImage(index);
                  setShowBefore(true);
                }}
                className={`relative rounded-xl overflow-hidden transition-all hover:scale-105 ${
                  selectedImage === index
                    ? 'ring-4 ring-primary shadow-lg'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <ProgressiveImage
                  src={item.beforeImage}
                  alt={item.title}
                  className=""
                  loading="lazy"
                  aspectRatio="aspect-video"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 z-10">
                  <p className="text-white text-xs font-semibold truncate">
                    {item.title}
                  </p>
                  <p className="text-white/80 text-xs">{item.location}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Pricing Comparison */}
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="bg-muted/30 p-6 border-b border-border">
              <h3 className="text-2xl font-bold text-foreground text-center mb-2">
                Co dostanete v ceně
              </h3>
              <p className="text-muted-foreground text-center">
                Porovnání s běžnou nabídkou na trhu
              </p>
            </div>

            {/* Header */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-muted/20 border-b border-border">
              <div className="text-left">
                <h4 className="font-bold text-foreground">Položka</h4>
              </div>
              <div className="text-center">
                <div className="inline-block bg-primary/10 px-4 py-2 rounded-lg">
                  <h4 className="font-bold text-primary">Rado Clean</h4>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-bold text-muted-foreground">Běžná nabídka</h4>
              </div>
            </div>

            {/* Items */}
            {pricingItems.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 p-6 items-center ${
                  index !== pricingItems.length - 1 ? "border-b border-border" : ""
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
                        <span className="text-sm text-muted-foreground font-medium">
                          {item.note}
                        </span>
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
                  <span className="text-foreground font-bold text-xl">2950 Kč</span>
                  <span className="text-xs text-muted-foreground">s doplatky</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badge & Savings */}
          <div className="mt-8 space-y-4 text-center">
            <p className="text-lg text-muted-foreground">
              Průměrná úspora: <span className="text-primary font-bold text-2xl">450 Kč</span>
            </p>
            <p className="text-sm text-muted-foreground">
              ✓ 100% reálné fotografie z našich zakázek • Žádné upravené nebo stock obrázky
            </p>
            <p className="text-xs text-muted-foreground">
              *Na základě porovnání s 3 místními konkurenty
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsWithPricing;
