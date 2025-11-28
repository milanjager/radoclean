import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Gift, Copy, Check, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const NeighborhoodDiscount = () => {
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralsCount, setReferralsCount] = useState(0);
  const [discountActivated, setDiscountActivated] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateCode = (email: string) => {
    const prefix = email.split('@')[0].substring(0, 4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${random}`;
  };

  const handleGenerateCode = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Neplatný email",
        description: "Prosím zadejte platnou emailovou adresu",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_or_create_referral_code', {
        user_email: email
      });

      if (error) throw error;

      if (data) {
        const result = data as { code: string; referrals_count: number; discount_activated: boolean };
        setReferralCode(result.code);
        setReferralsCount(result.referrals_count);
        setDiscountActivated(result.discount_activated);
        toast({
          title: "Kód vytvořen!",
          description: "Sdílejte váš kód s přáteli a získejte slevu",
        });
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se vytvořit referral kód",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Zkopírováno!",
        description: "Referral kód byl zkopírován do schránky",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Doporučte nás sousedům a ušetřete
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Každý doporučený soused = sleva 10%. Po 2 doporučeních získáte 20% slevu na váš příští úklid!
            </p>
          </div>

          <Card className="p-8">
            {!referralCode ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Váš email pro vytvoření referral kódu
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      placeholder="vas@email.cz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleGenerateCode} size="lg">
                      Vytvořit kód
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  💡 Po vytvoření kódu jej můžete sdílet s přáteli a sousedy
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Váš referral kód:</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-bold tracking-wider">{referralCode}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="gap-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Zkopírováno" : "Kopírovat"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Počet doporučení</span>
                    </div>
                    <p className="text-3xl font-bold">{referralsCount}</p>
                  </div>

                  <div className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center gap-3 mb-2">
                      <Gift className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Vaše sleva</span>
                    </div>
                    <p className="text-3xl font-bold text-primary">
                      {discountActivated ? "20%" : referralsCount > 0 ? "10%" : "0%"}
                    </p>
                  </div>
                </div>

                <div className="bg-accent/20 rounded-lg p-4">
                  <p className="text-sm">
                    📣 <strong>Jak to funguje:</strong> Sdílejte váš kód s přáteli. Když si pomocí něj objednají úklid, 
                    vy získáte slevu na svůj příští úklid! Po 2 úspěšných doporučeních: 20% sleva.
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setReferralCode(null);
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Vytvořit nový kód
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NeighborhoodDiscount;
