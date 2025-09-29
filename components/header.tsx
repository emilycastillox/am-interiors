import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary/20">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-seriffont-small tracking-wide text-primary-foreground">
          A:M Interiors
          </Link>
          <nav className="hidden md:flex items-center space-x-12">
            <Link
              href="/"
              className="text-sm font-serif font-normal text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 tracking-wider"
            >
              HOME
            </Link>
            <Link
              href="/portfolio"
              className="text-sm font-serif font-normal text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 tracking-wider"
            >
              PORTFOLIO
            </Link>
            <Link
              href="/about"
              className="text-sm font-serif font-normal text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 tracking-wider"
            >
              ABOUT
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-serif font-normal text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300 tracking-wider"
            >
              CONTACT
            </Link>
          </nav>
          <Button
            variant="outline"
            className="hidden md:inline-flex text-sm font-serif font-normal tracking-wider border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300 bg-transparent rounded-none"
          >
            CONSULTATION
          </Button>
        </div>
      </div>
    </header>
  )
}
