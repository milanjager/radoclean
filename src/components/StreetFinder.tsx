import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Users, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const StreetFinder = () => {
  const [street, setStreet] = useState("");
  const [searchResult, setSearchResult] = useState<{
    street: string;
    neighbors: number;
    area: string;
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [14.3667, 49.9708], // Centered between all three areas
      zoom: 12,
    });

    map.on('load', () => {
      // Service area polygons with approximate boundaries
      const serviceAreas = [
        {
          name: 'Radotín',
          coords: [14.3500, 49.9833],
          color: '#10b981',
          polygon: [
            [14.3300, 49.9950],
            [14.3700, 49.9950],
            [14.3700, 49.9700],
            [14.3300, 49.9700],
            [14.3300, 49.9950]
          ]
        },
        {
          name: 'Černošice',
          coords: [14.3186, 49.9625],
          color: '#3b82f6',
          polygon: [
            [14.2900, 49.9750],
            [14.3400, 49.9750],
            [14.3400, 49.9500],
            [14.2900, 49.9500],
            [14.2900, 49.9750]
          ]
        },
        {
          name: 'Zbraslav',
          coords: [14.3833, 49.9667],
          color: '#8b5cf6',
          polygon: [
            [14.3650, 49.9800],
            [14.4000, 49.9800],
            [14.4000, 49.9550],
            [14.3650, 49.9550],
            [14.3650, 49.9800]
          ]
        }
      ];

      // Add polygon layers for each area
      serviceAreas.forEach((area, index) => {
        // Add source
        map.addSource(`area-${index}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [area.polygon]
            },
            properties: {
              name: area.name
            }
          }
        });

        // Add fill layer
        map.addLayer({
          id: `area-fill-${index}`,
          type: 'fill',
          source: `area-${index}`,
          paint: {
            'fill-color': area.color,
            'fill-opacity': 0.2
          }
        });

        // Add outline layer
        map.addLayer({
          id: `area-outline-${index}`,
          type: 'line',
          source: `area-${index}`,
          paint: {
            'line-color': area.color,
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        });

        // Add hover effect
        map.on('mouseenter', `area-fill-${index}`, () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', `area-fill-${index}`, () => {
          map.getCanvas().style.cursor = '';
        });

        // Add click popup
        map.on('click', `area-fill-${index}`, () => {
          new mapboxgl.Popup()
            .setLngLat(area.coords as [number, number])
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${area.name}</h3>
                <p style="font-size: 14px; color: #666;">Oblast pokrytí našich služeb</p>
              </div>
            `)
            .addTo(map);
        });
      });

      // Add enhanced markers for service areas
      serviceAreas.forEach(area => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `
          width: 24px;
          height: 24px;
          background-color: ${area.color};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        `;
        
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
        
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
        });
        
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        new mapboxgl.Marker(el)
          .setLngLat(area.coords as [number, number])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 12px;">
                  <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${area.name}</h3>
                  <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Pokrýváme celou oblast</p>
                  <div style="display: flex; align-items: center; gap: 4px; color: #10b981;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span style="font-size: 13px; font-weight: 500;">Bez dojezdných poplatků</span>
                  </div>
                </div>
              `)
          )
          .addTo(map);
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Nahrávání...",
        description: "Řekněte název ulice",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se získat přístup k mikrofonu",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio },
        });

        if (error) throw error;

        if (data?.text) {
          setStreet(data.text);
          toast({
            title: "Přepsáno",
            description: data.text,
          });
        }
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se přepsat audio",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <section id="street-finder" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Lokální pokrytí
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pokrýváme celý Radotín, Černošice a Zbraslav
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interaktivní mapa našeho pokrytí. Klikněte na barevné oblasti nebo markery pro více informací.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 animate-fade-in">
            <div className="w-4 h-4 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Radotín</h4>
              <p className="text-sm text-green-700 dark:text-green-300">Celá oblast včetně všech okolních ulic</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Černošice</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">Celá oblast včetně všech okolních ulic</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-800 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="w-4 h-4 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Zbraslav</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">Celá oblast včetně všech okolních ulic</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <div 
            ref={mapContainerRef}
            className="w-full h-[500px] rounded-2xl shadow-2xl border-2 border-border"
          />
          <p className="text-center text-sm text-muted-foreground mt-4">
            💡 Tip: Klikněte na barevné oblasti nebo použijte zoom pro detailní pohled
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card border rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              Vyhledejte svou ulici
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Zjistěte, kolik vašich sousedů už využívá naše služby
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
                onClick={isRecording ? stopRecording : startRecording}
                size="lg"
                variant="outline"
                className="h-12 px-4"
                disabled={isTranscribing}
              >
                {isTranscribing ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-5 h-5 text-destructive" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>
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
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

            <p className="text-sm text-muted-foreground mt-6 text-center">
              💡 <span className="font-semibold">Tip:</span> Pokud si v jedné ulici objednají úklid 3 domácnosti 
              ve stejný den, dostanete všichni <span className="font-semibold text-primary">10% slevu</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StreetFinder;
