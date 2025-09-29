"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    image: "/modern-minimalist-living-room-with-warm-earth-tone.jpg",
    title: "Modern Minimalist Living",
    subtitle: "Clean lines meet warm comfort",
  },
  {
    id: 2,
    image: "/cozy-bedroom-with-natural-materials-and-earth-tone.jpg",
    title: "Cozy Bedroom Retreat",
    subtitle: "Natural materials and serene colors",
  },
  {
    id: 3,
    image: "/elegant-dining-room-with-warm-lighting-and-earth-t.jpg",
    title: "Elegant Dining Space",
    subtitle: "Where memories are made",
  },
]

export function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white max-w-4xl px-8">
              <h1 className="text-4xl md:text-6xl font-serif font-normal mb-6 text-balance tracking-wide leading-tight text-white">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-12 text-balance opacity-90 font-serif italic font-normal tracking-wide text-white">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 px-8 py-3 text-sm font-serif font-normal tracking-widest rounded-none"
              >
                VIEW PORTFOLIO
              </Button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 transition-all duration-300 text-white backdrop-blur-sm border border-white/20 z-30"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 transition-all duration-300 text-white backdrop-blur-sm border border-white/20 z-30"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 transition-all duration-300 ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
