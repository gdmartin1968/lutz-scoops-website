import { FlavorsPage } from "./pages/FlavorsPage";
import { MenuPage } from "./pages/MenuPage";
import { VisitPage } from "./pages/VisitPage";
import { Navbar } from "./components/Navbar";
import { AboutSection } from "./sections/AboutSection";
import { ExperienceStrip } from "./sections/ExperienceStrip";
import { FeaturedFlavors } from "./sections/FeaturedFlavors";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { MenuHighlights } from "./sections/MenuHighlights";
import { VisitSection } from "./sections/VisitSection";

function App() {
  const path = window.location.pathname.replace(/\/$/, "");

  return (
    <div className="min-h-screen bg-[#fff9f4]">
      <Navbar />

      <main>
        {path === "/flavors" ? <FlavorsPage /> : path === "/menu" ? <MenuPage /> : path === "/visit" ? <VisitPage /> : <>
        <Hero />
        <ExperienceStrip />
        <FeaturedFlavors />
        <MenuHighlights />
        <VisitSection />
        <AboutSection />
        </>}
      </main>

      <Footer />
    </div>
  );
}

export default App;
