import { useState, useRef } from "react";
import { Briefcase, CheckCircle, Upload, Send, Phone, Mail, Users, Clock, TrendingUp, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const positions = [
  {
    id: "uklizecka",
    title: "Zkušená uklízečka",
    description: "Hledáme zkušené uklízečky do našeho týmu v Radotíně a okolí.",
    requirements: [
      "Zkušenosti s profesionálním úklidem",
      "Máte oko pro detail a kvalitu",
      "Dokážete pracovat sama",
      "Máte ráda čistotu jako lifestyle",
      "Řidičské oprávnění + auto = výhoda"
    ],
    benefits: [
      "Nadstandardní ocenění",
      "Výplaty týdně",
      "Flexibilní pracovní doba",
      "Podílet se na vzniku nové společnosti",
      "Růst s růstem společnosti"
    ]
  },
  {
    id: "vedouci",
    title: "Vedoucí úklidu",
    description: "Hledáme zkušenou vedoucí úklidu pro koordinaci našeho týmu.",
    requirements: [
      "Zkušenosti s profesionálním úklidem",
      "Máte oko pro detail a kvalitu",
      "Umíte vést a zaučit tým",
      "Dokážete komunikovat s klienty",
      "Řidičské oprávnění + auto = výhoda"
    ],
    benefits: [
      "Nadstandardní ocenění",
      "Výplaty týdně",
      "Možný podíl na zisku",
      "Být při vzniku nové společnosti",
      "Růst s růstem společnosti"
    ]
  }
];

const Careers = () => {
  const [showContent, setShowContent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: ""
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToForm = (positionId: string) => {
    setFormData(prev => ({ ...prev, position: positionId }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Soubor je příliš velký",
          description: "Maximální velikost CV je 5 MB",
          variant: "destructive"
        });
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.position) {
      toast({
        title: "Vyplňte prosím všechna povinná pole",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    let cvUrl = null;

    try {
      // Upload CV if provided
      if (cvFile) {
        const fileName = `${Date.now()}_${cvFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("cv-uploads")
          .upload(fileName, cvFile);

        if (uploadError) throw uploadError;
        cvUrl = uploadData.path;
      }

      // Submit application
      const { error } = await supabase.from("job_applications").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        message: formData.message,
        cv_url: cvUrl
      });

      if (error) throw error;

      toast({
        title: "Přihláška odeslána!",
        description: "Děkujeme za váš zájem. Brzy se vám ozveme.",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", position: "", message: "" });
      setCvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Chyba při odesílání",
        description: "Zkuste to prosím znovu nebo nás kontaktujte telefonicky.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kariera" className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            Kariéra
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pracuj s námi!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Hledáme zkušené kolegy do nové společnosti. Platíme nad průměr – chceme nadprůměrné kolegy!
          </p>
          
          {!showContent && (
            <Button 
              onClick={() => setShowContent(true)}
              variant="premium"
              size="lg"
              className="gap-2"
            >
              Mám zájem
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {showContent && (
          <>
            {/* Job Positions */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {positions.map((position) => (
            <Card key={position.id} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {position.id === "vedouci" ? (
                      <Users className="w-6 h-6 text-primary" />
                    ) : (
                      <Briefcase className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  {position.title}
                </CardTitle>
                <p className="text-muted-foreground">{position.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Hledáme vás, pokud:
                    </h4>
                    <ul className="space-y-2">
                      {position.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Nabízíme:
                    </h4>
                    <ul className="space-y-2">
                      {position.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button 
                  onClick={() => scrollToForm(position.id)}
                  className="w-full mt-6 gap-2"
                  variant="premium"
                >
                  Mám zájem o tuto pozici
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Work With Us */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: TrendingUp, title: "Nadstandardní plat", desc: "Platíme více než konkurence" },
            { icon: Clock, title: "Týdenní výplaty", desc: "Peníze každý týden" },
            { icon: Users, title: "Skvělý tým", desc: "Přátelská atmosféra" },
            { icon: Award, title: "Růst s námi", desc: "Možnost kariérního postupu" }
          ].map((item, idx) => (
            <div key={idx} className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <Card ref={formRef} className="max-w-2xl mx-auto border-2 border-accent/20">
          <CardHeader className="text-center bg-accent/5">
            <CardTitle className="text-2xl">Přidejte se k nám!</CardTitle>
            <p className="text-muted-foreground">
              Vyplňte formulář a my se vám ozveme.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Jméno a příjmení *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Telefon *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte pozici *" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id}>
                          {pos.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Textarea
                  name="message"
                  placeholder="Zpráva (volitelné) - napište nám něco o sobě..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Životopis (volitelné)
                </label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  {cvFile ? (
                    <p className="text-sm text-primary font-medium">{cvFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Klikněte pro nahrání CV
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, DOCX (max. 5 MB)
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                variant="premium"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Odesílám..." : "Odeslat přihlášku"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">Nebo nás kontaktujte přímo:</p>
              <div className="flex justify-center gap-6">
                <a href="tel:+420739580935" className="flex items-center gap-2 text-primary hover:underline">
                  <Phone className="w-4 h-4" />
                  +420 739 580 935
                </a>
                <a href="mailto:soused@radoclean.cz" className="flex items-center gap-2 text-primary hover:underline">
                  <Mail className="w-4 h-4" />
                  soused@radoclean.cz
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </section>
  );
};

export default Careers;