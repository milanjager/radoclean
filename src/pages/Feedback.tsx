import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackForm from "@/components/FeedbackForm";

const Feedback = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Vaše zpětná vazba</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Vaše názory jsou pro nás důležité. Pomozte nám zlepšit naše služby tím, že nám pošlete svou zpětnou vazbu.
            </p>
          </div>
          <FeedbackForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;
