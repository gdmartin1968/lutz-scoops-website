import { Navbar } from "./components/Navbar";
import { AboutSection } from "./sections/AboutSection";
import { ExperienceStrip } from "./sections/ExperienceStrip";
import { FeaturedFlavors } from "./sections/FeaturedFlavors";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { MenuHighlights } from "./sections/MenuHighlights";
import { VisitSection } from "./sections/VisitSection";

function App() {
  return (
    <div className="min-h-screen bg-[#fff9f4]">
      <Navbar />

      <main>
        <Hero />
        <ExperienceStrip />
        <FeaturedFlavors />
        <MenuHighlights />
        <VisitSection />
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
