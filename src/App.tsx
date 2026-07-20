import { Navbar } from "./components/Navbar";
import { AboutSection } from "./sections/AboutSection";
import { FeaturedFlavors } from "./sections/FeaturedFlavors";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { MenuHighlights } from "./sections/MenuHighlights";
import { VisitSection } from "./sections/VisitSection";

function App() {
  return (
    <div className="min-h-screen bg-[#fffaf6]">
      <Navbar />

      <main>
        <Hero />
        <MenuHighlights />
        <FeaturedFlavors />
        <VisitSection />
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
