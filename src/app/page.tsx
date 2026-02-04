import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Values } from "@/components/values";
import { Process } from "@/components/process";
import { Partners } from "@/components/partners";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Services />
      <Values />
      <Process />
      <Partners />
      <FAQ />
      <Footer />
    </main>
  );
}
