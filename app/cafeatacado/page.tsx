"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Coffee,
  Award,
  TrendingUp,
  BadgeCheck,
  Truck,
  Star,
  Check,
  CircleDollarSign,
  Timer,
  CheckCircle,
  Trophy,
  Heart,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import HelpPopup from "@/components/help-popup"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import ProductCarousel from "@/components/product-carousel"

const WHATSAPP_URL = "https://wa.me/553497308171?text=Ol%C3%A1%2C%20quero%20a%20tabela%20de%20pre%C3%A7os%20do%20atacado%20Caf%C3%A9%20Canastra.%20Poderia%20me%20ajudar%3F"

export default function CafeAtacadoPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showReplay, setShowReplay] = useState(false)
  const [showStartOverlay, setShowStartOverlay] = useState(true)
  const [posterUrl, setPosterUrl] = useState<string | undefined>(undefined)

  // Iniciar pausado: sem efeitos de autoplay/som automático

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    let canceled = false

    const captureFirstFrame = () => {
      try {
        const width = el.videoWidth
        const height = el.videoHeight
        if (!width || !height) return
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(el, 0, 0, width, height)
        const url = canvas.toDataURL('image/jpeg', 0.8)
        if (!canceled) setPosterUrl(url)
      } catch {}
    }

    const onLoadedMetadata = () => {
      try {
        // Garantir que o primeiro frame esteja disponível
        el.currentTime = 0
      } catch {}
    }

    const onLoadedData = () => {
      captureFirstFrame()
    }

    el.addEventListener('loadedmetadata', onLoadedMetadata)
    el.addEventListener('loadeddata', onLoadedData)

    return () => {
      canceled = true
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
      el.removeEventListener('loadeddata', onLoadedData)
    }
  }, [])

  const handleReplay = () => {
    setShowReplay(false)
    const el = videoRef.current
    if (el) {
      try {
        el.currentTime = 0
        el.defaultMuted = false
        el.muted = false
        el.volume = 1
        el.play()
      } catch {}
    }
  }

  const handleStartWatching = () => {
    setShowStartOverlay(false)
    const el = videoRef.current
    if (el) {
      try {
        el.defaultMuted = false
        el.muted = false
        el.volume = 1
        el.play()
      } catch {}
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO: vídeo 9:16 + branding e CTA na mesma seção, mobile-first */}
      <section className="relative w-full bg-gradient-to-b from-white to-orange-50/40">
        <div className="container mx-auto px-4 pt-6 pb-10 md:py-16 md:min-h-[80vh] grid md:grid-cols-2 items-center gap-8">
          {/* Bloco de texto/branding: no mobile fica acima do vídeo; no desktop ao lado */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <Image
              src="/images/logo-canastra.png"
              alt="Café Canastra"
              width={180}
              height={56}
              priority
              className="mx-auto md:mx-0 select-none"
            />
            {/* Título para mobile com texto solicitado */}
            <h1 className="mt-4 text-3xl font-bold text-gray-800 leading-tight md:hidden">
              Mais Lucros com <span className="text-orange-500">cafés especiais</span> direto da Canastra
            </h1>
            {/* Título original mantido para desktop */}
            <h1 className="mt-4 hidden md:block md:text-4xl font-bold text-gray-800 leading-tight">
              Mais lucro com <span className="text-orange-500">cafés especiais</span> direto da Canastra
            </h1>

            {/* Conteúdo, CTA e diferenciais: visível apenas no desktop nesta coluna */}
            <p className="mt-2 hidden md:block text-gray-600 md:text-lg">Qualidade SCA, logística rápida e preço imbatível para atacado.</p>

            <div className="mt-6 hidden md:block">
              <Button
                onClick={() => window.dispatchEvent(new Event('open-chat'))}
                className="bg-[#25D366] hover:bg-[#1EBE5C] text-white font-bold px-8 py-4 rounded-full shadow-xl"
              >
                📲 Falar com especialista
              </Button>
            </div>

            {/* Micro-diferenciais apenas no desktop nesta coluna */}
            <div className="mt-6 hidden md:flex flex-wrap justify-center md:justify-start gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm ring-1 ring-black/5">
                <BadgeCheck className="w-4 h-4 text-orange-500" /> SCA +80
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm ring-1 ring-black/5">
                <Truck className="w-4 h-4 text-orange-500" /> Entrega rápida
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm ring-1 ring-black/5">
                <TrendingUp className="w-4 h-4 text-orange-500" /> Melhor preço
              </div>
            </div>
          </div>

          {/* Bloco do vídeo (sem overlays): no mobile fica abaixo do título; no desktop na coluna ao lado */}
          <div className="order-2 md:order-1 flex justify-center">
            <div className="w-full max-w-[360px] md:w-[320px] md:max-w-none mt-0">
              <AspectRatio ratio={9 / 16}>
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-2xl ring-1 ring-black/10 bg-black"
                    // Sem autoplay e sem muted: inicia pausado
                    playsInline
                    preload="metadata"
                    poster={posterUrl}
                    onEnded={() => setShowReplay(true)}
                    onPlay={() => setShowReplay(false)}
                  >
                    <source src="/lv_0_20251112105610.mp4" type="video/mp4" />
                    Seu navegador não suporta o vídeo.
                  </video>

                  {/* Botão de Assistir sobre o vídeo quando está pausado inicialmente */}
                  {showStartOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30">
                      <Button
                        onClick={handleStartWatching}
                        aria-label="Assistir vídeo"
                        className="rounded-full w-16 h-16 md:w-20 md:h-20 p-0 bg-white/90 hover:bg-white text-orange-600 shadow-2xl border border-white/70"
                      >
                        <Play className="w-8 h-8 md:w-10 md:h-10" />
                      </Button>
                    </div>
                  )}

                  {showReplay && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={handleReplay}
                        className="bg-black/60 hover:bg-black/70 text-white backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
                      >
                        Ver novamente
                      </Button>
                    </div>
                  )}
                </div>
              </AspectRatio>
            </div>
          </div>

          {/* Conteúdo, CTA e diferenciais posicionados abaixo do vídeo no mobile */}
          <div className="order-3 md:hidden text-center">
            <p className="mt-4 text-gray-600">Qualidade SCA, logística rápida e preço imbatível para atacado.</p>

            <div className="mt-6">
              <Button
                onClick={() => window.dispatchEvent(new Event('open-chat'))}
                className="bg-[#25D366] hover:bg-[#1EBE5C] text-white font-bold px-8 py-4 rounded-full shadow-xl"
              >
                📲 Falar com especialista
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm ring-1 ring-black/5">
                <BadgeCheck className="w-4 h-4 text-orange-500" /> SCA +80
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm ring-1 ring-black/5">
                <Truck className="w-4 h-4 text-orange-500" /> Entrega rápida
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm ring-1 ring-black/5">
                <TrendingUp className="w-4 h-4 text-orange-500" /> Melhor preço
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL: replicada da página /graocafeteria */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-8 md:mb-16 px-2">
            Nosso café <span className="text-orange-500">fideliza</span> o seu cliente!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 rounded-3xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-3 md:mb-4">4 a cada 5</div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  lojistas relataram aumento nas vendas após usarem nosso café
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 rounded-3xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-3 md:mb-4">Nº 1</div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Líder de vendas entre os cafés especiais, nos pontos onde estamos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 rounded-3xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <Heart className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-3 md:mb-4">93%</div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  dos lojistas são nossos parceiros a mais de 2 anos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PRODUTOS: carrossel substituto */}
      <section className="py-0" id="produtos">
        <ProductCarousel />
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-14 bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            Por que escolher <span className="text-orange-500">Café Canastra</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { icon: Truck, title: "Logística rápida", text: "Entregamos em todo o país" },
              { icon: Coffee, title: "Torras sob demanda", text: "Café sempre fresco" },
              { icon: TrendingUp, title: "Melhor preço do Brasil", text: "Cafés especiais SCA" },
              { icon: Award, title: "Direto da Serra da Canastra", text: "Sem intermediários" },
              { icon: BadgeCheck, title: "Rastreabilidade", text: "Qualidade garantida do produtor" },
            ].map(({ icon: Icon, title, text }, i) => (
              <Card key={i} className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <p className="text-gray-600">{text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-14 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            Quem já usa, <span className="text-orange-500">aprova</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {[
                  {
                    text:
                      "Nossos clientes notaram a diferença imediatamente. O aroma é incrível e as vendas aumentaram bastante.",
                    author: "Brainer – Goiânia/GO",
                  },
                  {
                    text:
                      "O café gira rápido e os clientes sempre elogiam. Fomos aumentando a linha de produtos e agora dispomos dela completa, foi um sucesso.",
                    author: "Petterson Amorin – Frederico Westphalen/RS",
                  },
                  {
                    text:
                      "Atendimento excepcional e produto de qualidade. A logística deles é rápida e o João me atende muito bem. Parceria que realmente funciona.",
                    author: "Sônia Lopes – São Paulo/SP",
                  },
                ].map((t, i) => (
                  <CarouselItem key={i}>
                    <Card className="bg-white border-0 rounded-2xl shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1 text-yellow-500 mb-3">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                        <p className="text-gray-700 text-sm md:text-base">{t.text}</p>
                        {t.author && (
                          <p className="mt-3 text-gray-500 text-sm">— {t.author}</p>
                        )}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-0 bg-white shadow-md" />
              <CarouselNext className="border-0 bg-white shadow-md" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Dúvidas frequentes</h2>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="item-1">
                <AccordionTrigger>Qual o pedido mínimo?</AccordionTrigger>
                <AccordionContent>
                  Trabalhamos com volumes flexíveis para atacado. Fale pelo WhatsApp para alinhar a sua necessidade.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Como funciona a entrega?</AccordionTrigger>
                <AccordionContent>
                  Enviamos para todo o Brasil com logística rápida e previsível. Cotamos frete no fechamento.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Posso experimentar antes de comprar?</AccordionTrigger>
                <AccordionContent>
                  Sim. Disponibilizamos amostras sob demanda para avaliação sensorial e de preparo.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Qual a validade do café?</AccordionTrigger>
                <AccordionContent>
                  Lotes frescos e torras sob demanda garantem excelente validade. Indicamos consumo preferencial até 6 meses.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Como funcionam os pagamentos?</AccordionTrigger>
                <AccordionContent>
                  Condições facilitadas para atacado. Alinhamos na cotação pelo WhatsApp conforme volume e linhas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Vocês emitem nota fiscal?</AccordionTrigger>
                <AccordionContent>
                  Sim, emitimos NF com rastreabilidade completa dos lotes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Pronto para aumentar seu lucro?</h2>
          <p className="text-white/90 mb-6">Fale com nosso time agora. Resposta em segundos.</p>
          <Button
            onClick={() => window.dispatchEvent(new Event('open-chat'))}
            className="bg-white text-orange-700 hover:bg-white/90 font-bold px-8 py-4 rounded-full shadow-xl"
          >
            📲 Chamar no WhatsApp
          </Button>
          <p className="mt-4 text-white/80 text-sm">Seg-Sex: 8h às 18h | Sáb: 8h às 12h</p>
        </div>
      </section>

      {/* FOOTER minimalista (cores e tipografia alinhadas) */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/images/logo-canastra.png"
              alt="Café Canastra"
              width={150}
              height={90}
              className="mx-auto mb-6 filter invert"
            />
            <p className="text-gray-400 mb-2 text-lg">Café Canastra</p>
            <p className="text-gray-500 text-sm">Cafés Especiais da Serra da Canastra</p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-sm">
            <div className="space-y-3">
              <div className="flex items-start">
                <BadgeCheck className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-orange-400" />
                <p>Boaventura Cafés Especiais Ltda - CNPJ 24.252.228/0001-37</p>
              </div>
              <div className="flex items-start">
                <Truck className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-orange-400" />
                <p>Fazenda Divineia: Rodovia LMG827, km15 - Pratinha-Medeiros - Minas Gerais</p>
              </div>
              <div className="flex items-start">
                <Truck className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-orange-400" />
                <p>Torrefação: Rua Nivaldo Guerreiro Nunes, 701 - Distrito Industrial - Uberlândia/MG</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 flex-shrink-0 text-orange-400" />
                <p>Email: comercial@cafecanastra.com</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              <span suppressHydrationWarning>© {new Date().getFullYear()} Café Canastra. Todos os direitos reservados.</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Popup de ajuda e chat WhatsApp */}
      <HelpPopup />
    </div>
  )
}