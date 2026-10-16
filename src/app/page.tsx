import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Partners } from "@/components/partners";
import { Services } from "@/components/services";
import { Values } from "@/components/values";
import { Process } from "@/components/process";
import { StatBand } from "@/components/home/stat-band";
import { JoinCta } from "@/components/home/join-cta";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar overlay />
      <Hero />
      <Partners />
      <Services />
      <StatBand />
      <Values />
      <Process />
      <FAQ />
      <JoinCta />
      <Footer />
    </main>
  );
}
