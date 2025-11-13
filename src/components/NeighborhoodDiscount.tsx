import { useState } from "react";
import { Users, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NeighborhoodDiscount = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  const generateReferralCode = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Chyba",
        description: "Zadejte platnou emailovou adresu",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate unique code
      const code = `SOUSED-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Store in database
      const { error } = await supabase
        .from('referral_codes')
        .insert([
          {
            code,
            email,
            referrals_count: 0,
            discount_activated: false,
          }
        ]);

      if (error) throw error;

      setReferralCode(code);
      toast({
        title: "🎉 Kód vytvořen!",
        description: "Sdílejte odkaz se sousedy a získejte slevu 15%",
      });
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se vytvořit referral kód",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "✓ Zkopírováno!",
      description: "Odkaz je ve schránce, sdílejte ho se sousedy",
    });
  };

  const shareViaWhatsApp = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    const message = `Ahoj! Našla jsem skvělou úklidovou službu pro naši čtvrť. Když objednáme společně 3, dostaneme všichni slevu 15%! 🏠✨ ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-accent/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block p-3 bg-accent/10 rounded-2xl mb-4">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sousedská sleva 15%
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Spojte se se 2 sousedy a všichni dostanete slevu 15% na pravidelný úklid
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-warm border border-border p-8 md:p-10">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">Vytvořte kód</h3>
                <p className="text-sm text-muted-foreground">
                  Zadejte email a získejte jedinečný referral odkaz
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">Sdílejte odkaz</h3>
                <p className="text-sm text-muted-foreground">
                  Pošlete odkaz 2 sousedům z vaší čtvrti
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-accent">15%</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">Získejte slevu</h3>
                <p className="text-sm text-muted-foreground">
                  Všichni 3 dostanete slevu 15% na pravidelný úklid
                </p>
              </div>
            </div>

            {!referralCode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Váš email
                  </label>
                  <Input
                    type="email"
                    placeholder="vas.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button
                  onClick={generateReferralCode}
                  disabled={isGenerating}
                  variant="premium"
                  size="lg"
                  className="w-full"
                >
                  {isGenerating ? "Vytvářím..." : "Vytvořit sousedský odkaz"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    Váš referral kód:
                  </p>
                  <p className="text-2xl font-bold text-primary mb-3">
                    {referralCode}
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}?ref=${referralCode}`}
                      readOnly
                      className="h-12"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="lg"
                      className="flex-shrink-0"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={shareViaWhatsApp}
                    variant="default"
                    className="flex-1"
                    size="lg"
                  >
                    <Share2 className="mr-2 w-4 h-4" />
                    Sdílet na WhatsApp
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg">
                        Jak to funguje?
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Jak funguje sousedská sleva?</DialogTitle>
                        <DialogDescription>
                          Sousedská sleva je náš způsob, jak oceňovat komunitu.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <p>
                          <strong className="text-foreground">1. Sdílení:</strong> Pošlete váš jedinečný odkaz 2 sousedům (ideálně z vaší ulice nebo okolí).
                        </p>
                        <p>
                          <strong className="text-foreground">2. Aktivace:</strong> Když objednají úklid přes váš odkaz, sleva se automaticky aktivuje všem 3.
                        </p>
                        <p>
                          <strong className="text-foreground">3. Sleva:</strong> Při příští objednávce pravidelného úklidu dostanete všichni slevu 15%.
                        </p>
                        <p className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                          💡 <strong>Tip:</strong> Čím více sousedů se připojí, tím efektivnější plánování tras a lepší servis pro celou čtvrť!
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  📧 Sledujte svůj email - pošleme vám potvrzení, když se přidají sousedé
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              🏘️ <strong>Bonus:</strong> První čtvrť, která objedná 10+ domácností, získá extra slevu 5% navíc!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeighborhoodDiscount;
