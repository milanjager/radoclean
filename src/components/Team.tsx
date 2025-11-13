import teamMember from "@/assets/team-member.jpg";

const Team = () => {
  return (
    <section id="team" className="py-20 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kdo k vám přijede?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Žádné anonymní lidi z call centra. Poznejte Janu, která bydlí kousek od vás.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-warm border border-border overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-square md:aspect-auto">
                <img 
                  src={teamMember} 
                  alt="Jana Nováková - vedoucí týmu úklidu v Černošicích" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-6 bg-primary/5 rounded-xl p-4 border-l-4 border-primary">
                  <p className="text-foreground font-semibold text-lg italic">
                    "Dobrý den, jsem Jana a ručím za to, že váš domov bude zářit."
                  </p>
                </div>
                
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  Jana Nováková
                </h3>
                <p className="text-xl text-primary mb-4">
                  Vedoucí týmu • Žiju v Černošicích
                </p>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">8 let v Černošicích.</strong> Vím, jak se tady vypořádat s tvrdou vodou a jak vyčistit prach ze staveb z Radotína.
                  </p>
                  
                  <p>
                    <strong className="text-foreground">Osobní přístup:</strong> U každého zákazníka začínám sama, abych poznala vaše preference. Pak k vám můžu posílat i členy svého týmu, ale vždy víte, kdo přijde.
                  </p>
                  
                  <p className="font-semibold text-foreground text-lg bg-primary/5 rounded-xl p-4 border-l-4 border-primary">
                    💬 "Uklidím váš domov tak, jako bych uklízela vlastní. Protože jsme sousedé."
                  </p>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm">
                      📞 <strong className="text-foreground">Volejte přímo:</strong>{" "}
                      <a href="tel:+420777888999" className="text-primary hover:underline font-semibold">
                        +420 777 888 999
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
