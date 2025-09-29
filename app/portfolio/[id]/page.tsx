"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const projects = [
  {
    id: 1,
    image: "/modern-kitchen-with-warm-wood-and-earth-tones.jpg",
    title: "Modern Kitchen Design",
    category: "Kitchen",
    description:
      "A sophisticated kitchen design that seamlessly blends warm wood tones with contemporary functionality, creating a space that's both inviting and efficient.",
    clientNeeds:
      "The clients wanted a modern kitchen that would serve as the heart of their home, accommodating both daily family meals and entertaining guests. They requested ample storage, high-end appliances, and a design that would complement their home's contemporary architecture.",
    outcomes:
      "We delivered a stunning kitchen featuring custom cabinetry in warm wood tones, premium stone countertops, and state-of-the-art appliances. The open layout creates seamless flow between cooking and dining areas, while the island provides additional workspace and casual seating.",
    gallery: [
      "/modern-kitchen-with-warm-wood-and-earth-tones.jpg",
      "/dining-room-with-warm-wood-table.jpg",
      "/modern-minimalist-living-room-with-warm-earth-tone.jpg",
    ],
  },
  {
    id: 2,
    image: "/cozy-living-room-with-natural-textures.jpg",
    title: "Cozy Living Space",
    category: "Living Room",
    description:
      "An intimate living room featuring natural textures and earthy tones, designed to create a warm and welcoming atmosphere for family gatherings.",
    clientNeeds:
      "The family sought a comfortable living space that would encourage relaxation and togetherness. They wanted natural materials, warm colors, and furniture that could withstand daily use while maintaining elegance.",
    outcomes:
      "We created a harmonious living room using natural textures like linen, wool, and wood. The neutral color palette with warm undertones creates a cozy atmosphere, while carefully selected furniture provides both comfort and style.",
    gallery: [
      "/cozy-living-room-with-natural-textures.jpg",
      "/modern-minimalist-living-room-with-warm-earth-tone.jpg",
      "/elegant-bedroom-with-warm-lighting.jpg",
    ],
  },
  {
    id: 3,
    image: "/elegant-dining-room-with-warm-lighting-and-earth-t.jpg",
    title: "Elegant Dining Room",
    category: "Dining Room",
    description: "A refined dining space with warm lighting and sophisticated earth tone palette.",
    clientNeeds:
      "The clients desired an elegant dining room suitable for formal entertaining while maintaining warmth and intimacy for family dinners.",
    outcomes:
      "We designed a sophisticated dining space featuring rich earth tones, ambient lighting, and carefully curated furnishings that create the perfect atmosphere for both intimate family meals and formal gatherings.",
    gallery: [
      "/elegant-dining-room-with-warm-lighting-and-earth-t.jpg",
      "/dining-room-with-warm-wood-table.jpg",
      "/modern-kitchen-with-warm-wood-and-earth-tones.jpg",
    ],
  },
  {
    id: 4,
    image: "/cozy-bedroom-with-natural-materials-and-earth-tone.jpg",
    title: "Serene Bedroom Retreat",
    category: "Bedroom",
    description: "A peaceful bedroom sanctuary using natural materials and calming earth tones.",
    clientNeeds:
      "The clients wanted a master bedroom that would serve as a peaceful retreat from daily stress, incorporating natural materials and creating a spa-like atmosphere.",
    outcomes:
      "We created a serene bedroom using organic textures, natural materials, and a soothing color palette. The design promotes rest and relaxation while maintaining sophisticated style.",
    gallery: [
      "/cozy-bedroom-with-natural-materials-and-earth-tone.jpg",
      "/elegant-bedroom-with-warm-lighting.jpg",
      "/minimalist-bathroom-with-natural-stone.jpg",
    ],
  },
  {
    id: 5,
    image: "/minimalist-bathroom-with-natural-stone.jpg",
    title: "Minimalist Bathroom",
    category: "Bathroom",
    description: "A clean, spa-like bathroom featuring natural stone and minimalist design principles.",
    clientNeeds:
      "The clients requested a bathroom renovation that would create a spa-like experience at home, emphasizing clean lines, natural materials, and luxurious finishes.",
    outcomes:
      "We delivered a minimalist bathroom featuring natural stone, clean lines, and high-end fixtures. The design creates a serene, spa-like atmosphere while maximizing functionality.",
    gallery: [
      "/minimalist-bathroom-with-natural-stone.jpg",
      "/cozy-bedroom-with-natural-materials-and-earth-tone.jpg",
      "/elegant-bedroom-with-warm-lighting.jpg",
    ],
  },
  {
    id: 6,
    image: "/home-office-with-natural-light-and-plants.jpg",
    title: "Productive Home Office",
    category: "Office",
    description: "A bright, inspiring workspace designed to maximize natural light and productivity.",
    clientNeeds:
      "With the shift to remote work, the clients needed a dedicated home office that would boost productivity while maintaining the aesthetic harmony of their home.",
    outcomes:
      "We designed a bright, functional workspace that maximizes natural light and incorporates plants for improved air quality and well-being. Custom storage solutions keep the space organized and clutter-free.",
    gallery: [
      "/home-office-with-natural-light-and-plants.jpg",
      "/modern-minimalist-living-room-with-warm-earth-tone.jpg",
      "/cozy-living-room-with-natural-textures.jpg",
    ],
  },
]

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === Number.parseInt(params.id))

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-32">
        <div className="container mx-auto px-8">
          <div className="mb-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div>
              <ProjectGallery images={project.gallery} title={project.title} />
            </div>

            <div className="space-y-8">
              <div>
                <div className="text-xs text-primary font-medium tracking-widest uppercase font-serif mb-4">
                  {project.category}
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-light mb-6 text-balance tracking-wide text-foreground">
                  {project.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">{project.description}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-light mb-4 text-foreground tracking-wide">
                    Client Requirements
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-light">{project.clientNeeds}</p>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-light mb-4 text-foreground tracking-wide">Project Outcomes</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">{project.outcomes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={images[currentImage] || "/placeholder.svg"}
          alt={title}
          className="w-full h-96 lg:h-[500px] object-cover"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-none rounded-none"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-none rounded-none"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-20 h-16 overflow-hidden ${
                index === currentImage ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
              } transition-all`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
