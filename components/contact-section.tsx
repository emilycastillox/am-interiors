import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Let's Create Together</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Ready to transform your space? Get in touch and let's discuss your vision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="p-8 border rounded-none">
            <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" className="rounded-none" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="your@email.com" className="rounded-none" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input id="subject" placeholder="Project inquiry" className="rounded-none" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea id="message" placeholder="Tell us about your project..." className="min-h-32 rounded-none" />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-none">
                Send Message
              </Button>
            </form>
          </Card>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Get in touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-muted-foreground">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-muted-foreground">hello@aminteriors.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-muted-foreground">San Francisco, CA</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-muted rounded-none">
              <h4 className="font-semibold mb-3">Office Hours</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
