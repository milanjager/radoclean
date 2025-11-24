import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import beforeKitchen from "@/assets/before-kitchen.jpg";
import afterKitchen from "@/assets/after-kitchen.jpg";
import beforeBathroom from "@/assets/before-bathroom.jpg";
import afterBathroom from "@/assets/after-bathroom.jpg";
import beforeLiving from "@/assets/before-living.jpg";
import afterLiving from "@/assets/after-living.jpg";
import { Button } from "@/components/ui/button";

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

const BeforeAfterGallery = () => {
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

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Před & Po • Naše práce mluví za sebe
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Skutečné výsledky u vašich sousedů v Poberouní. Žádné stock fotografie.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Image Display */}
          <div className="relative bg-card rounded-3xl shadow-2xl overflow-hidden mb-8">
            {/* Image Container */}
            <div className="relative aspect-video">
              <img
                src={showBefore ? currentItem.beforeImage : currentItem.afterImage}
                alt={`${showBefore ? 'Před' : 'Po'} - ${currentItem.title}`}
                className="w-full h-full object-cover"
              />
              
              {/* Before/After Toggle Overlay */}
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

              {/* Navigation Arrows */}
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

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-foreground">
                {selectedImage + 1} / {gallery.length}
              </div>
            </div>

            {/* Image Info */}
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

          {/* Thumbnail Navigation */}
          <div className="grid grid-cols-3 gap-4">
            {gallery.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedImage(index);
                  setShowBefore(true);
                }}
                className={`relative aspect-video rounded-xl overflow-hidden transition-all hover:scale-105 ${
                  selectedImage === index 
                    ? 'ring-4 ring-primary shadow-lg' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={item.beforeImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-semibold truncate">
                    {item.title}
                  </p>
                  <p className="text-white/80 text-xs">
                    {item.location}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ✓ 100% reálné fotografie z našich zakázek • Žádné upravené nebo stock obrázky
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterGallery;
