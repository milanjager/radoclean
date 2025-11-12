import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Jak dlouho trvá úklid?",
      answer: "Byt 1+kk až 2+kk: cca 2-3 hodiny. Byt 3+kk až 4+kk: cca 3-4 hodiny. Rodinný dům: cca 4-6 hodin. Přesný čas závisí na stavu nemovitosti a rozsahu úklidu.",
    },
    {
      question: "Co když nejsem spokojený/á s úklidem?",
      answer: "Máme 100% garanci spokojenosti. Pokud něco není dokonalé, řekněte nám to do 24 hodin a vrátíme se to opravit zdarma. Pokud ani po opravě nejste spokojeni, vrátíme vám celou platbu bez diskuzí.",
    },
    {
      question: "Musím být doma při úklidu?",
      answer: "Ne, nemusíte. Mnoho našich klientů nám svěří klíče a my uklízíme, zatímco jsou v práci. Samozřejmě můžete být doma, pokud preferujete. Při první návštěvě doporučujeme být přítomni, abychom si vyjasnili vaše preference.",
    },
    {
      question: "Musím mít doma čistící prostředky?",
      answer: "Ne. Doprava i profesionální čistící prostředky jsou zahrnuty v ceně. Používáme ekologické prostředky, které jsou šetrné k životnímu prostředí i k vašemu domovu.",
    },
    {
      question: "Jak si rezervuji termín?",
      answer: "Můžete nás kontaktovat přes formulář na webu, zavolat na +420 777 888 999, nebo poslat email. Plánujeme brzy spustit online kalendář, kde si budete moci vybrat termín přímo.",
    },
    {
      question: "Jak platím za úklid?",
      answer: "Platbu můžete provést hotově, kartou nebo bankovním převodem. Po dokončení úklidu vám vystavíme fakturu. U pravidelných úklidů nabízíme výhodné měsíční platby.",
    },
    {
      question: "Nabízíte pravidelný úklid?",
      answer: "Ano! Většina našich klientů má s námi pravidelný úklid (týdně nebo 14 dní). Pravidelní zákazníci mají 15% slevu. Termín si můžete kdykoliv přesunout nebo zrušit, pokud vám to nevyhovuje.",
    },
    {
      question: "Co zahrnuje 'základní údržba zahrady'?",
      answer: "Úklid terasy nebo balkonu, zametení listí, vyhrabání hrubých nečistot. Nekosíme trávu ani nestříháme keře - to je za příplatek. Pokud potřebujete komplexnější údržbu zahrady, řekněte nám a připravíme individuální nabídku.",
    },
    {
      question: "Uklízíte i po stavbě/rekonstrukci?",
      answer: "Ano, máme zkušenosti s úklidem po rekonstrukcích. Tento typ úklidu je však náročnější a ceník je jiný. Napište nám, pošlete fotky a připravíme cenovou nabídku na míru.",
    },
    {
      question: "Jste pojištění?",
      answer: "Ano, máme pojištění odpovědnosti za škody. Pracujeme pečlivě, ale pokud by se přesto něco stalo, jsme kryti pojištěním až do výše 2 milionů Kč.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Často kladené otázky
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Odpovědi na nejčastější dotazy našich zákazníků
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-lg border border-border px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenašli jste odpověď na vaši otázku?
            </p>
            <a
              href="tel:+420777888999"
              className="text-primary hover:underline font-semibold text-lg"
            >
              Zavolejte nám na +420 777 888 999
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
