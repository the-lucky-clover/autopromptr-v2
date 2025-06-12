
import { PricingPlans } from "@/components/subscription/PricingPlans";

const Pricing = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan to accelerate your AI prompting journey
          </p>
        </div>
        
        <PricingPlans />
        
        <div className="text-center mt-12 text-gray-600">
          <p>All plans include a 14-day money-back guarantee • No setup fees • Cancel anytime</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
