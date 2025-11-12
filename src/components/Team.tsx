import teamMember from "@/assets/team-member.jpg";

const Team = () => {
  return (
    <section id="team" className="py-20 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kdo k vám přijede
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Žádné anonymní lidi z fotobanky. Tohle jsou skuteční lidé z vašeho okolí.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-square md:aspect-auto">
                <img 
                  src={teamMember} 
                  alt="Jana Nováková - vedoucí týmu" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  Jana Nováková
                </h3>
                <p className="text-xl text-primary mb-6">
                  Vedoucí týmu
                </p>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Žiju v Černošicích už 8 let a úklidu se věnuji profesionálně 5 let. 
                    Mám ráda, když jsou věci dokonalé – a to samé čekám od svého týmu.
                  </p>
                  
                  <p>
                    U každého zákazníka začínám sama, abych poznala vaše preference. 
                    Pak k vám mohu posílat i členy mého týmu, ale vždy víte, kdo přijde.
                  </p>
                  
                  <p className="font-semibold text-foreground">
                    Můj přístup: "Uklidím váš domov tak, jako bych uklízela vlastní."
                  </p>
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
