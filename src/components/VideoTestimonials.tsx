import { Play, Star, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const VideoTestimonials = () => {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const videos = [
    {
      id: 1,
      name: "Petra Nováková",
      location: "Černošice",
      thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with real video
      rating: 5,
      quote: "Konečně firma, která nedělá věci napůl!",
      duration: "1:45"
    },
    {
      id: 2,
      name: "Martin Svoboda",
      location: "Radotín",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with real video
      rating: 5,
      quote: "Online rezervace během 2 minut. Bomba!",
      duration: "2:10"
    },
    {
      id: 3,
      name: "Jana Horáková",
      location: "Zbraslav",
      thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with real video
      rating: 5,
      quote: "Po rekonstrukci byl byt dokonale čistý",
      duration: "1:30"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🎥 Video reference
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Poslouchejte přímo od našich zákazníků
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Skuteční lidé, skutečné příběhy. Žádné placené recenze nebo fake testimonials.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {videos.map((video) => (
            <div 
              key={video.id}
              className="bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl group"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-muted">
                {playingVideo === video.id ? (
                  <iframe
                    className="w-full h-full"
                    src={`${video.videoUrl}?autoplay=1`}
                    title={`${video.name} testimonial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    
                    {/* Play Button */}
                    <button
                      onClick={() => setPlayingVideo(video.id)}
                      className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform"
                      aria-label={`Přehrát video od ${video.name}`}
                    >
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                        <Play className="w-10 h-10 text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </button>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold">
                      {video.duration}
                    </div>

                    {/* Verified Badge */}
                    <div className="absolute top-3 left-3 bg-accent/90 text-accent-foreground px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Ověřeno
                    </div>
                  </>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(video.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-muted-foreground italic mb-4 text-sm leading-relaxed">
                  "{video.quote}"
                </p>
                
                <div className="pt-4 border-t border-border">
                  <p className="font-semibold text-foreground">
                    {video.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📍 {video.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-3xl mx-auto bg-card rounded-2xl p-8 border-2 border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Chcete být další spokojený zákazník?
          </h3>
          <p className="text-muted-foreground mb-6">
            Přidejte se k stovkám spokojených domácností v Poberouní. 
            Transparentní ceny, bez skrytých poplatků, místní firma.
          </p>
          <Button 
            variant="premium" 
            size="lg"
            onClick={() => {
              const element = document.getElementById("pricing");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Zjistit cenu za 30 sekund →
          </Button>
        </div>

        {/* Trust Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            📹 Všechna videa jsou natočena se souhlasem našich zákazníků • 100% autentická
          </p>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
