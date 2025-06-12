
import DynamicHeader from "@/components/DynamicHeader";
import AutoPromptHero from "@/components/AutoPromptHero";
import Features from "@/components/Features";
import Templates from "@/components/Templates";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <DynamicHeader />
      <AutoPromptHero />
      <Features />
      <Templates />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
