import FAQsTwo from "@/components/landing/FaQ";
import Features from "@/components/landing/FeaturedSection";
import FooterSection from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";

const LandingPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <HeroSection />
      <Features />
      <FAQsTwo />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
