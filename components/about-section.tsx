export function AboutSection() {
  return (
    <section id="about" className="py-32 bg-background">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 text-balance text-primary leading-tight">
              Creating Spaces That Inspire
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              With over a decade of experience in interior design, we specialize in creating harmonious spaces that
              reflect your personality while maintaining functionality and timeless appeal.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              Our approach combines modern aesthetics with natural elements, using warm, earthy tones and sustainable
              materials to create environments that nurture both body and soul.
            </p>
          </div>

          <div className="relative">
            <img
              src="/interior-designer-working-on-plans-with-natural-li.jpg"
              alt="Interior designer at work"
              className="w-full h-96 lg:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-primary/5" />
          </div>
        </div>
      </div>
    </section>
  )
}
