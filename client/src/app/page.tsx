import { Footer } from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProtectedRoute from "@/components/ProtectedRoute";
import Videos from "@/components/Videos";



export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <HeroSection />
        <Videos />
      </ProtectedRoute>
      <Footer />
    </>


  );
}
