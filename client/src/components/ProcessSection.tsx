import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import img1 from "@assets/1_1765475971082.jpg";
import img2 from "@assets/2i_1765476083489.png";
import img3 from "@assets/3i_1765476247864.png";
import img4 from "@assets/WhatsAppImage2024-05-14at14.58.26_812d6bf2_1765476699464.webp";

const steps = [
  {
    id: 1,
    title: "1. Ręczne zbiory",
    description: "Na naszej rodzinnej plantacji w Huili zbieramy tylko w pełni dojrzałe, czerwone owoce kawowca – ręcznie, bez pośpiechu.",
    image: img1
  },
  {
    id: 2,
    title: "2. Mycie i fermentacja",
    description: "Zebrane owoce są obierane z miąższu, następnie delikatnie fermentują i są dokładnie płukane, żeby wydobyć czysty, słodki smak.",
    image: img2
  },
  {
    id: 3,
    title: "3. Suszenie na słońcu",
    description: "Ziarna suszą się na słońcu na podwyższonych stołach, aż osiągną idealny poziom wilgotności. To tutaj rodzi się ich słodycz i delikatna kwasowość.",
    image: img3
  },
  {
    id: 4,
    title: "4. Odpoczynek zielonego ziarna",
    description: "Po suszeniu kawa “odpoczywa” w workach, żeby ustabilizował się jej smak – dzięki temu jest później bardziej harmonijna w filiżance.",
    image: img4
  }
];

export function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-[#2C241B] text-white">
      <div className="container mx-auto px-4">
         <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-white/60 uppercase tracking-[0.2em] text-sm font-bold block mb-4">Proces Produkcji</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6">
            Od ziarenka do filiżanki
          </h2>
          <p className="text-white/80 text-lg font-light">
            Każdy etap jest dla nas ważny. Dbałość o detale to sekret naszego smaku.
          </p>
        </div>

        <Carousel 
          className="w-full max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {steps.map((step) => (
              <CarouselItem key={step.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="bg-transparent border-none shadow-none h-full">
                    <CardContent className="flex flex-col gap-6 p-0 h-full">
                      <div className="aspect-[4/5] overflow-hidden rounded-sm relative group">
                        <img 
                          src={step.image} 
                          alt={step.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      </div>
                      <div className="space-y-3 flex-grow">
                        <h3 className="text-2xl font-serif text-[#F9F7F2]">{step.title}</h3>
                        <p className="text-white/70 font-light leading-relaxed text-sm">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-transparent border-white/20 text-white hover:bg-white hover:text-[#2C241B]" />
          <CarouselNext className="hidden md:flex -right-12 bg-transparent border-white/20 text-white hover:bg-white hover:text-[#2C241B]" />
        </Carousel>
      </div>
    </section>
  )
}
