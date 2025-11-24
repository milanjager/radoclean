import teamMember from "@/assets/team-member.jpg";
import teamLucie from "@/assets/team-lucie.jpg";
import teamPetra from "@/assets/team-petra.jpg";
import teamHana from "@/assets/team-hana.jpg";
import { Phone } from "lucide-react";
import ProgressiveImage from "@/components/ProgressiveImage";

const Team = () => {
  const teamMembers = [
    {
      name: "Jana Nováková",
      role: "Vedoucí týmu",
      location: "Černošice",
      experience: "8 let v Černošicích",
      image: teamMember,
      quote: "Dobrý den, jsem Jana a ručím za to, že váš domov bude zářit.",
      description: "Vím, jak se tady vypořádat s tvrdou vodou a jak vyčistit prach ze staveb z Radotína.",
      specialty: "Osobní přístup: U každého zákazníka začínám sama, abych poznala vaše preference.",
    },
    {
      name: "Lucie Kratochvílová",
      role: "Specialistka na kuchyně",
      location: "Radotín",
      experience: "6 let zkušeností",
      image: teamLucie,
      quote: "Vaše kuchyň bude zářit jako nová.",
      description: "Žiju v Radotíně a specializuji se na důkladné čištění kuchyní a koupelen.",
      specialty: "Expert na odstranění mastnoty a vodního kamene typického pro naši oblast.",
    },
    {
      name: "Petra Malá",
      role: "Specialistka na okna",
      location: "Zbraslav",
      experience: "5 let zkušeností",
      image: teamPetra,
      quote: "Okna bez šmouh jsou mou vizitkou.",
      description: "Pocházím ze Zbraslavi a mám ráda práci s okny a detailní čištění.",
      specialty: "Perfekcionistka, která zanechává každý roh dokonale čistý.",
    },
    {
      name: "Hana Dvořáková",
      role: "Specialistka na rodinné domy",
      location: "Dobřichovice",
      experience: "4 roky zkušeností",
      image: teamHana,
      quote: "I velké domy si zaslouží osobní péči.",
      description: "Specializuji se na úklid větších domů a mám zkušenosti s domácími mazlíčky.",
      specialty: "Rychlá, efektivní a vždy s úsměvem. Klienti si mě žádají zpět.",
    },
  ];

  return (
    <section id="team" className="py-20 bg-secondary/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Náš místní tým
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Žádní anonymní lidé z call centra. Poznejte ženy z vašeho okolí, které se postarají o váš domov.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl shadow-warm border border-border overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="grid sm:grid-cols-5 gap-0">
                <div className="sm:col-span-2">
                  <ProgressiveImage
                    src={member.image} 
                    alt={`${member.name} - ${member.role} ${member.location}`}
                    className="sm:rounded-l-2xl"
                    loading="lazy"
                    aspectRatio="aspect-square sm:aspect-auto"
                  />
                </div>
                
                <div className="sm:col-span-3 p-6 flex flex-col justify-center">
                  <div className="mb-4 bg-primary/5 rounded-xl p-3 border-l-4 border-primary">
                    <p className="text-foreground font-semibold text-sm italic">
                      "{member.quote}"
                    </p>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-lg text-primary mb-1">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    📍 Žiju v {member.location} • {member.experience}
                  </p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">{member.description}</strong>
                    </p>
                    <p className="text-xs">
                      ✓ {member.specialty}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl p-8 text-center shadow-warm">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Chcete poznat náš tým osobně?
            </h3>
            <p className="text-lg mb-6 opacity-95">
              Volejte přímo Janě a domluvte si první schůzku
            </p>
            <a 
              href="tel:+420777888999"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5" />
              +420 777 888 999
            </a>
            <p className="text-sm mt-4 opacity-90">
              💬 "Uklidíme váš domov tak, jako bychom uklízeli vlastní. Protože jsme sousedé."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
