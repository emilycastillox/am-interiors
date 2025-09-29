import { Header } from "@/components/header"
import { Slideshow } from "@/components/slideshow"
import { PortfolioSection } from "@/components/portfolio-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Slideshow />
      <PortfolioSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
