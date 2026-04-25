import Navbar from '../components/Navbar';
import Hero from '../components/Landing/Hero';
import HowItWorks from '../components/Landing/HowItWorks';
import About from '../components/Landing/About';
import BakuCard from '../components/Landing/BakuCard';
import Pricing from '../components/Landing/Pricing';
import CTA from '../components/Landing/CTA';
import FAQ from '../components/Landing/FAQ';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <About />
        <BakuCard />
        <Pricing />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
