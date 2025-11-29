import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare } from "lucide-react";
import { z } from "zod";

const feedbackSchema = z.object({
  name: z.string().trim().min(1, "Jméno je povinné").max(100, "Jméno musí být kratší než 100 znaků"),
  email: z.string().trim().email("Neplatná emailová adresa").max(255, "Email musí být kratší než 255 znaků"),
  message: z.string().trim().min(1, "Zpráva je povinná").max(1000, "Zpráva musí být kratší než 1000 znaků"),
  rating: z.number().min(1).max(5).optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const FeedbackForm = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    message: "",
    rating: undefined,
  });
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    try {
      const validatedData = feedbackSchema.parse(formData);
      setSubmitting(true);

      const { error } = await supabase.from("feedback").insert({
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
        rating: validatedData.rating || null,
      });

      if (error) throw error;

      toast({
        title: "Děkujeme za zpětnou vazbu!",
        description: "Vaše zpráva byla úspěšně odeslána.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
        rating: undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Chyba validace",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        console.error("Error submitting feedback:", error);
        toast({
          title: "Chyba",
          description: "Nepodařilo se odeslat zpětnou vazbu",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Pošlete nám zpětnou vazbu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Jméno *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Vaše jméno"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              maxLength={100}
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="vas@email.cz"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
              maxLength={255}
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Zpráva *</Label>
            <Textarea
              id="message"
              placeholder="Napište nám vaši zpětnou vazbu..."
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              required
              maxLength={1000}
              rows={5}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              {formData.message.length}/1000 znaků
            </p>
          </div>

          <div className="space-y-2">
            <Label>Hodnocení (volitelné)</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  disabled={submitting}
                  className="transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoveredStar !== null ? star <= hoveredStar : formData.rating && star <= formData.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Odesílání..." : "Odeslat zpětnou vazbu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
