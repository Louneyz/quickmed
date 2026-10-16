import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Partners } from "@/components/partners";
import { Services } from "@/components/services";
import { Process } from "@/components/process";
import { StatBand } from "@/components/home/stat-band";
import { CheckpointCta } from "@/components/home/checkpoint-cta";
import { JoinCta } from "@/components/home/join-cta";
import { RouteTracker } from "@/components/home/route-tracker";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";

// The homepage reads as a delivery route and narrows like a funnel:
// pickup (hero) → trust → why it matters → how it works → safeguards → ask → questions → doorstep (final ask).
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar overlay />
      <RouteTracker />
      <Hero />
      <Partners />
      <StatBand />
      <Process />
      <Services />
      <CheckpointCta />
      <FAQ />
      <JoinCta />
      <Footer />
    </main>
  );
}
