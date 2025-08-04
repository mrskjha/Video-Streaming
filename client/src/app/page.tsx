import HeroSection from "@/components/HeroSection";
import Videos from "@/components/Videos";
import { Footer } from "@/components/Footer";
import { VideoProvider } from "@/contexts/videoContext";

export default function HomePage() {
  return (
    <>
    <VideoProvider>
      <HeroSection />
      <Videos />
      <Footer />
    </VideoProvider>
    </>
  );
}
