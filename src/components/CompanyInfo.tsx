import { Building2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

const CompanyInfo = () => {
  return (
    <section id="o-firme" className="py-16 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-7 h-7 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">O firmě</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 bg-background rounded-2xl p-8 shadow-sm border border-border">
          <div>
            <h3 className="text-xl font-semibold mb-4">Identifikační údaje</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">Obchodní jméno</dt>
                <dd className="font-medium text-foreground">Radoclean s.r.o.</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">Právní forma</dt>
                <dd className="font-medium text-foreground">Společnost s ručením omezeným</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">IČO</dt>
                <dd className="font-medium text-foreground">24566241</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">DIČ</dt>
                <dd className="font-medium text-foreground">Neplátce DPH</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Datum vzniku</dt>
                <dd className="font-medium text-foreground">27. 2. 2026</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Kontakt a sídlo</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Sídlo firmy</p>
                  <p className="text-muted-foreground">
                    náměstí 14. října 1307/2<br />
                    Smíchov, 150 00 Praha 5
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Telefon</p>
                  <a href="tel:+420603425692" className="text-muted-foreground hover:text-primary">
                    +420 603 425 692
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href="mailto:veronika@radoclean.cz" className="text-muted-foreground hover:text-primary">
                    veronika@radoclean.cz
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Ověření</p>
                  <a
                    href="https://ares.gov.cz/ekonomicke-subjekty/ros/24566241"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary underline"
                  >
                    Výpis z ARES (IČO 24566241)
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyInfo;
