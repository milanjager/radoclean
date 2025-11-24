import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonText, SkeletonCard, SkeletonList, SkeletonGallery, SkeletonTeam } from "@/components/skeleton";
import { useLoading } from "@/hooks/useLoading";
import { Loader2 } from "lucide-react";

/**
 * Demo component showcasing all skeleton loading variants
 */
const SkeletonDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const shouldShowSkeleton = useLoading(isLoading, { delay: 200, minDuration: 800 });

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Skeleton Loading Demo
            </h2>
            <p className="text-muted-foreground mb-6">
              Interactive examples of skeleton loading states for better UX
            </p>
            <Button
              onClick={simulateLoading}
              disabled={isLoading}
              variant="premium"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Simulate Loading"
              )}
            </Button>
          </div>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Text Skeleton</h3>
                {shouldShowSkeleton ? (
                  <SkeletonText lines={5} />
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <p className="text-muted-foreground">
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-muted-foreground">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="cards" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {shouldShowSkeleton ? (
                  <>
                    <SkeletonCard hasImage hasAvatar textLines={3} />
                    <SkeletonCard hasImage hasAvatar textLines={3} />
                  </>
                ) : (
                  <>
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20" />
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10" />
                          <div>
                            <p className="font-semibold">Jana Nováková</p>
                            <p className="text-sm text-muted-foreground">Vedoucí týmu</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Ukázkový článek</h3>
                        <p className="text-muted-foreground">
                          Toto je ukázkový text, který se zobrazí po načtení obsahu.
                        </p>
                      </div>
                    </Card>
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20" />
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-accent/10" />
                          <div>
                            <p className="font-semibold">Petra Malá</p>
                            <p className="text-sm text-muted-foreground">Specialistka</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Další článek</h3>
                        <p className="text-muted-foreground">
                          Další ukázkový obsah po dokončení načítání.
                        </p>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              {shouldShowSkeleton ? (
                <SkeletonList items={5} hasImage />
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-card rounded-xl border">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Položka seznamu {i}</h4>
                        <p className="text-sm text-muted-foreground">
                          Popis položky se zobrazí po načtení dat ze serveru.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              {shouldShowSkeleton ? (
                <SkeletonGallery columns={3} items={6} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-accent/20" />
                      <p className="font-semibold">Obrázek {i}</p>
                      <p className="text-sm text-muted-foreground">Popis</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="team" className="mt-6">
              {shouldShowSkeleton ? (
                <SkeletonTeam members={2} />
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-card rounded-2xl border overflow-hidden">
                      <div className="grid sm:grid-cols-5">
                        <div className="sm:col-span-2 aspect-square sm:aspect-auto bg-gradient-to-br from-primary/20 to-accent/20" />
                        <div className="sm:col-span-3 p-6">
                          <div className="bg-primary/5 rounded-xl p-3 border-l-4 border-primary mb-4">
                            <p className="text-sm italic">"Ukázková citace člena týmu"</p>
                          </div>
                          <h3 className="text-2xl font-bold mb-1">Člen týmu {i}</h3>
                          <p className="text-lg text-primary mb-1">Role</p>
                          <p className="text-sm text-muted-foreground mb-3">📍 Lokace</p>
                          <p className="text-sm text-muted-foreground">
                            Popis člena týmu se zobrazí po načtení.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Benefits */}
          <div className="mt-12 bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Výhody Skeleton Loading:</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-primary mb-1">
                  Lepší vnímání rychlosti
                </div>
                <p className="text-muted-foreground">
                  Uživatelé vnímají načítání jako rychlejší, když vidí strukturu obsahu
                </p>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">
                  Žádné CLS
                </div>
                <p className="text-muted-foreground">
                  Eliminuje Cumulative Layout Shift během načítání
                </p>
              </div>
              <div>
                <div className="font-semibold text-primary mb-1">
                  Profesionální dojem
                </div>
                <p className="text-muted-foreground">
                  Moderní aplikace používají skeleton místo spinnerů
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkeletonDemo;
