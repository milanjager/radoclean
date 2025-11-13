const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
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
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Prémiový Úklid</h3>
            <p className="text-background/80 mb-3">
              Profesionální úklidové služby pro Černošice, Radotín a Zbraslav.
            </p>
            <div className="text-background/70 text-sm space-y-1">
              <p><strong>IČO:</strong> 12345678</p>
              <p><strong>Sídlo:</strong> Radotín, Praha-západ</p>
              <p><strong>Tel:</strong> +420 777 888 999</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Rychlé odkazy</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <button 
                  onClick={() => scrollToSection("pricing")}
                  className="hover:text-background transition-colors"
                >
                  Ceník
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("team")}
                  className="hover:text-background transition-colors"
                >
                  O nás
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-background transition-colors"
                >
                  Kontakt
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("testimonials")}
                  className="hover:text-background transition-colors"
                >
                  Reference
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Služby</h4>
            <ul className="space-y-2 text-background/80 text-sm">
              <li>• Běžný úklid domácností</li>
              <li>• Generální úklid</li>
              <li>• Úklid po rekonstrukci</li>
              <li>• Úklid po stěhování</li>
              <li>• Pravidelný úklid se slevou</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Právní informace</h4>
            <ul className="space-y-2 text-background/80">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Obchodní podmínky
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Ochrana osobních údajů
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Reklamační řád
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-background/20 text-center">
          <p className="text-background/60 text-sm">
            © 2024 Prémiový Úklid • Černošice, Radotín, Zbraslav
          </p>
          <p className="text-background/50 text-xs mt-2">
            Vytvořeno s 💚 pro sousedy v Poberouní
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
