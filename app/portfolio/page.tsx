import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

const projects = [
  {
    id: 1,
    image: "/modern-kitchen-with-warm-wood-and-earth-tones.jpg",
    title: "Modern Kitchen Design",
    category: "Kitchen",
    description:
      "A sophisticated kitchen design that seamlessly blends warm wood tones with contemporary functionality.",
  },
  {
    id: 2,
    image: "/cozy-living-room-with-natural-textures.jpg",
    title: "Cozy Living Space",
    category: "Living Room",
    description: "An intimate living room featuring natural textures and earthy tones for family gatherings.",
  },
  {
    id: 3,
    image: "/elegant-dining-room-with-warm-lighting-and-earth-t.jpg",
    title: "Elegant Dining Room",
    category: "Dining Room",
    description: "A refined dining space with warm lighting and sophisticated earth tone palette.",
  },
  {
    id: 4,
    image: "/cozy-bedroom-with-natural-materials-and-earth-tone.jpg",
    title: "Serene Bedroom Retreat",
    category: "Bedroom",
    description: "A peaceful bedroom sanctuary using natural materials and calming earth tones.",
  },
  {
    id: 5,
    image: "/minimalist-bathroom-with-natural-stone.jpg",
    title: "Minimalist Bathroom",
    category: "Bathroom",
    description: "A clean, spa-like bathroom featuring natural stone and minimalist design principles.",
  },
  {
    id: 6,
    image: "/home-office-with-natural-light-and-plants.jpg",
    title: "Productive Home Office",
    category: "Office",
    description: "A bright, inspiring workspace designed to maximize natural light and productivity.",
  },
]

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-32">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-6 text-balance tracking-wide text-primary">
              OUR PORTFOLIO
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance font-light leading-relaxed">
              Explore our collection of thoughtfully designed spaces that reflect our commitment to creating beautiful,
              functional interiors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link key={project.id} href={`/portfolio/${project.id}`} className="group">
                <div className="space-y-4">
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-primary font-medium tracking-widest uppercase font-serif">
                      {project.category}
                    </div>
                    <h3 className="text-xl font-serif font-light text-foreground tracking-wide">{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">{project.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
