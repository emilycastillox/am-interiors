import { Button } from "@/components/ui/button"
const projects = [
  {
    id: 1,
    image: "/modern-kitchen-with-warm-wood-and-earth-tones.jpg",
    title: "Modern Kitchen Design",
    category: "Kitchen",
    description:
      "A sophisticated kitchen design that seamlessly blends warm wood tones with contemporary functionality, creating a space that's both inviting and efficient.",
  },
  {
    id: 2,
    image: "/cozy-living-room-with-natural-textures.jpg",
    title: "Cozy Living Space",
    category: "Living Room",
    description:
      "An intimate living room featuring natural textures and earthy tones, designed to create a warm and welcoming atmosphere for family gatherings.",
  },
]

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-32 bg-primary/5">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-6 text-balance tracking-wide text-primary">
            FEATURED PROJECTS
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance font-light leading-relaxed">
            Discover our signature interior design projects that showcase our commitment to creating spaces that blend
            elegance with functionality.
          </p>
        </div>

        <div className="space-y-24">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center`}
            >
              <div className="lg:w-1/2">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-96 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-primary/10 hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6">
                <div className="text-xs text-primary font-medium tracking-widest uppercase font-serif">
                  {project.category}
                </div>
                <h3 className="text-3xl lg:text-4xl font-serif font-light text-foreground tracking-wide text-balance">
                  {project.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">{project.description}</p>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent rounded-none"
                >
                  View Project Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
