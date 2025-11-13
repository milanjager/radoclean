import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";

const StickyMobileCTA = () => {
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-warm">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          <a href="tel:+420777888999" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Phone className="mr-2 w-5 h-5" />
              Zavolat
            </Button>
          </a>
          <Button
            variant="premium"
            className="w-full h-12 text-base font-semibold"
            onClick={scrollToContact}
          >
            <Calendar className="mr-2 w-5 h-5" />
            Rezervovat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
