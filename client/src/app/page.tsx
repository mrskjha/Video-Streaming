import AllVideos from "@/components/AllVideos";
import { Footer } from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProtectedRoute from "@/components/ProtectedRoute";



export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <HeroSection />
        <AllVideos />
      </ProtectedRoute>
      <Footer />
    </>


  );
}
