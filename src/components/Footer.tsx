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
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Prémiový Úklid</h3>
            <p className="text-background/80">
              Profesionální úklidové služby pro Černošice, Radotín a Zbraslav.
            </p>
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
        
        <div className="pt-8 border-t border-background/20 text-center text-background/60">
          <p>© 2024 Prémiový Úklid. Všechna práva vyhrazena.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
