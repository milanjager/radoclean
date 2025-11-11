import { Shield, RotateCcw, Clock, Heart } from "lucide-react";

const Guarantee = () => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Naše garance
            </h2>
            <p className="text-xl text-muted-foreground">
              Stojíme si za kvalitou naší práce. Proto nabízíme garanci, kterou ostatní firmy nemají odvahu slíbit.
            </p>
          </div>
          
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border-2 border-primary/20">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <RotateCcw className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Nespokojeni? Vrátíme se zdarma
                  </h3>
                  <p className="text-muted-foreground">
                    Pokud něco není dokonalé, řekněte nám to do 24 hodin a vrátíme se to opravit. Zdarma.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Příchod přesně na čas
                  </h3>
                  <p className="text-muted-foreground">
                    Dorazíme v dohodnutý čas, nebo vás předem upozorníme. Bez zbytečného čekání.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-accent/10 rounded-xl p-6 border border-accent/20">
              <div className="flex items-start gap-4">
                <Heart className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    100% spokojeni, nebo peníze zpět
                  </h3>
                  <p className="text-muted-foreground">
                    Pokud po opravě stále nejste spokojeni, vrátíme vám celou platbu. 
                    Bez diskuzí, bez podmínek. Jednoduše proto, že si stojíme za kvalitou naší práce.
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

export default Guarantee;
