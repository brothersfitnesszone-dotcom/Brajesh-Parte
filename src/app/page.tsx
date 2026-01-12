import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Biometrics from "@/components/public/Biometrics";
import TrainingProtocol from "@/components/public/TrainingProtocol";
import Gallery from "@/components/public/Gallery";
import Footer from "@/components/public/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 w-full overflow-hidden">
        <Hero />
        <Biometrics />
        <TrainingProtocol />
        <Gallery />
        <Footer />
      </main>
    </div>
  );
}
