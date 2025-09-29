import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-32">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-serif font-light mb-6 text-balance tracking-wide text-primary">
              MEET THE DESIGNER
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div className="relative">
                <img
                  src="/interior-designer-working-on-plans-with-natural-li.jpg"
                  alt="Interior Designer"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
              </div>
            </div>

            <div className="space-y-8 lg:pt-8">
              <div>
                <h2 className="text-3xl font-serif font-light mb-6 text-foreground tracking-wide">
                  Creating Spaces That Tell Your Story
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed font-light">
                  <p>
                    With over a decade of experience in interior design, I believe that every space should be a
                    reflection of the people who inhabit it. My approach combines timeless elegance with contemporary
                    functionality, creating environments that are both beautiful and livable.
                  </p>
                  <p>
                    My design philosophy centers on the belief that good design should enhance daily life. I work
                    closely with each client to understand their unique needs, lifestyle, and aesthetic preferences,
                    ensuring that every project is a true collaboration.
                  </p>
                  <p>
                    Specializing in residential interiors, I have had the privilege of transforming homes across the
                    region. From modern minimalist spaces to warm, traditional interiors, I bring the same attention to
                    detail and commitment to quality to every project.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-serif font-light text-foreground tracking-wide">Design Approach</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed font-light">
                  <p>
                    Every project begins with listening. I take the time to understand how you live, work, and entertain
                    in your space. This foundation allows me to create designs that are not only visually stunning but
                    also perfectly suited to your lifestyle.
                  </p>
                  <p>
                    I believe in the power of natural materials, thoughtful lighting, and carefully curated furnishings
                    to create spaces that feel both sophisticated and welcoming. My goal is to design interiors that
                    will remain timeless and continue to bring joy for years to come.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-serif font-light text-foreground tracking-wide">Education & Experience</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed font-light">
                  <p>
                    Bachelor of Fine Arts in Interior Design from the Rhode Island School of Design. Member of the
                    American Society of Interior Designers (ASID) and certified by the National Council for Interior
                    Design Qualification (NCIDQ).
                  </p>
                  <p>
                    Prior to establishing A:M Interiors, I honed my skills at several prestigious design firms, working
                    on projects ranging from luxury residences to boutique commercial spaces. This diverse experience
                    has given me a comprehensive understanding of design principles and project management.
                  </p>
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
