import CyberNav from "@/components/public/CyberNav";
import Hero from "@/components/public/Hero";
import Biometrics from "@/components/public/Biometrics";
import TrainingProtocol from "@/components/public/TrainingProtocol";
import Gallery from "@/components/public/Gallery";
import Footer from "@/components/public/Footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <CyberNav />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden scroll-smooth relative z-10 md:ml-20">
        <Hero />
        <Biometrics />
        <TrainingProtocol />
        <Gallery />
        <Footer />
      </main>
    </div>
  );
}
