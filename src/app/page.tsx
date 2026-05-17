import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { SignatureGrid } from "@/components/sections/SignatureGrid";
import { Stylists } from "@/components/sections/Stylists";
import { Testimonials } from "@/components/sections/Testimonials";
import { Booking } from "@/components/sections/Booking";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative bg-ink text-bone">
      <Hero />
      <Marquee />
      <Services />
      <SignatureGrid />
      <Stylists />
      <Testimonials />
      <Booking />
      <Footer />
    </main>
  );
}
