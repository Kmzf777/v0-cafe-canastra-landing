"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Coffee,
  Truck,
  Star,
  Award,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Building,
  Shield,
  TrendingUp,
  Zap,
  FileCheck,
  CheckCircle,
  Trophy,
  Heart,
} from "lucide-react"

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [])

  return { isVisible, elementRef }
}

export default function GraoCafeteriaPage() {
  const router = useRouter()
  const { isVisible: isHeroVisible, elementRef: heroRef } = useScrollAnimation()
  const { isVisible: isHighlightsVisible, elementRef: highlightsRef } = useScrollAnimation()
  const { isVisible: isSocialProofVisible, elementRef: socialProofRef } = useScrollAnimation()
  const { isVisible: isMiniCtaVisible, elementRef: miniCtaRef } = useScrollAnimation()
  const { isVisible: isProductsVisible, elementRef: productsRef } = useScrollAnimation()
  const { isVisible: isFormVisible, elementRef: formRef } = useScrollAnimation()
  const { isVisible: isBenefitsVisible, elementRef: benefitsRef } = useScrollAnimation()
  const { isVisible: isPartnersVisible, elementRef: partnersRef } = useScrollAnimation()
  const { isVisible: isTestimonialsVisible, elementRef: testimonialsRef } = useScrollAnimation()
  const { isVisible: isFinalCtaVisible, elementRef: finalCtaRef } = useScrollAnimation()

  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [currentProductIndex, setCurrentProductIndex] = useState(0)

  const scrollToForm = () => {
    const formSection = document.getElementById("form")
    formSection?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToFormSmooth = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async () => {
    if (!name || !whatsapp) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    setIsSubmitting(true)

    const formData = {
      nome: name,
      whatsapp: whatsapp,
      email: email,
      timestamp: new Date().toISOString(),
      origem: "graocafeteria",
    }

    try {
      // Enviar para os dois webhooks
      const webhookPromises = [
        fetch("https://n8n.canastrainteligencia.com/webhook-test/landing-page", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }),
        fetch("https://webhook.canastrainteligencia.com/webhook/landing-page", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }),
      ]

      await Promise.all(webhookPromises)

      // Limpar formulário
      setName("")
      setWhatsapp("")
      setEmail("")

      // Redirecionar para página de obrigado atacado
      router.push("/obrigadoatacado")
    } catch (error) {
      console.error("Erro ao enviar dados:", error)
      // Mesmo com erro, redirecionar para página de obrigado
      router.push("/obrigadoatacado")
    } finally {
      setIsSubmitting(false)
    }
  }

  const products = [
    {
      name: "Canastra Clássico",
      description: "Aromático e forte, com notas achocolatadas que marcam o primeiro gole.",
      price: "A partir de R$ 26,90/un.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-X4Tfqg3Au5fR2T8N9HzYRC67135Xr5.png",
    },
    {
      name: "Canastra Suave",
      description: "Doce e equilibrado com toque cítrico. Perfeito para espresso premium.",
      price: "A partir de R$ 26,90/un.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8XFNbekXijRAPKm8ztLV0yzIvvQjMT.png",
    },
    {
      name: "Café Canela",
      description: "Blend especial com canela. Sabor único que conquista paladares exigentes.",
      price: "A partir de R$ 26,90/un.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-65t8l0EGTYV2kk3jZseY2XhueHXjr7.png",
    },
  ]

  const nextProduct = () => {
    setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length)
  }

  const prevProduct = () => {
    setCurrentProductIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Cabeçalho Fixo */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Image
            src="/images/logo-branca-transparente.png"
            alt="Café Canastra"
            width={120}
            height={72}
            className="h-12 w-auto drop-shadow-md"
          />

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-6">
            <a
              href="#produtos"
              className="text-white hover:text-orange-300 transition-colors font-medium drop-shadow-sm"
            >
              Produtos
            </a>
            <a href="#sobre" className="text-white hover:text-orange-300 transition-colors font-medium drop-shadow-sm">
              Sobre
            </a>
            <a
              href="#contato"
              className="text-white hover:text-orange-300 transition-colors font-medium drop-shadow-sm"
            >
              Contato
            </a>
          </nav>

          {/* Botão Menu Mobile */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span
                className={`block h-0.5 w-6 bg-white transition-transform drop-shadow-sm ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-white transition-opacity drop-shadow-sm ${isMobileMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-white transition-transform drop-shadow-sm ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              ></span>
            </div>
          </button>

          {/* Menu Mobile Colapsável */}
          {isMobileMenuOpen && (
            <nav className="absolute top-full left-0 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg w-full md:hidden">
              <div className="flex flex-col py-4">
                <a
                  href="#produtos"
                  className="px-4 py-3 text-white hover:bg-white/10 transition-colors font-medium drop-shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Produtos
                </a>
                <a
                  href="#sobre"
                  className="px-4 py-3 text-white hover:bg-white/10 transition-colors font-medium drop-shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sobre
                </a>
                <a
                  href="#contato"
                  className="px-4 py-3 text-white hover:bg-white/10 transition-colors font-medium drop-shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contato
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section Responsivo */}
      <section
        className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden"
        ref={heroRef}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero%20section%20img%20teste%201-4ARlgGHFuQTw296klLJTQMkJ1dGp7j.png"
            alt="Café Canastra - Grãos de café especiais"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            className={`transition-all duration-1000 ${
              isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight px-2 drop-shadow-lg">
              O café que <span className="text-orange-400 drop-shadow-lg">TRANSFORMA</span>
              <br />
              seu negócio
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-orange-300 font-semibold mb-3 md:mb-4 px-4 drop-shadow-md">
              Direto da Serra da Canastra • Preço Imbatível • Qualidade Excepcional
            </p>

            <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-8 font-light max-w-2xl mx-auto px-4 drop-shadow-md">
              Cafés especiais direto da fazenda
            </p>

            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 md:px-10 py-4 md:py-5 text-base md:text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 group w-full max-w-sm md:w-auto"
            >
              FALAR COM ESPECIALISTA
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Blocos de Destaque Responsivos */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100" ref={highlightsRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isHighlightsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center p-4 md:p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Coffee className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">100% Arábica Especial</h3>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center p-4 md:p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">Certificação Região do Cerrado</h3>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center p-4 md:p-6">
                <CardContent className="p-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">Preço Atacado Exclusivo</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social Responsiva */}
      <section className="py-12 md:py-20 bg-white" ref={socialProofRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isSocialProofVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
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
        </div>
      </section>

      {/* Mini CTA Responsivo */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-orange-500 to-orange-600" ref={miniCtaRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isMiniCtaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
                Cobrimos qualquer oferta de preços!
              </h2>
              <Button
                onClick={scrollToForm}
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 px-6 md:px-10 py-4 md:py-5 text-base md:text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 group w-full max-w-sm md:w-auto mb-4"
              >
                Solicitar Orçamento
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-white/60 text-xs md:text-sm max-w-3xl mx-auto px-4">
                Preço comprovado por nota fiscal em produtos da mesma categoria de qualidade: cafés especiais conforme a
                SCA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Produtos Responsiva */}
      <section className="py-12 md:py-20 bg-white" id="produtos" ref={productsRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isProductsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-8 md:mb-16 px-2">
              Cafés que fazem <span className="text-orange-500">clientes voltarem</span>
            </h2>

            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-3xl group shadow-lg hover:shadow-orange-200/50 transform hover:-translate-y-2">
                <div className="h-64 relative overflow-hidden bg-gray-50 flex items-center justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-X4Tfqg3Au5fR2T8N9HzYRC67135Xr5.png"
                    alt="Canastra Clássico"
                    width={200}
                    height={250}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Canastra Clássico</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Aromático e forte, com notas achocolatadas que marcam o primeiro gole.
                  </p>
                  <p className="text-2xl font-bold text-orange-600 mb-6">A partir de R$ 26,90/un.</p>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full group"
                    onClick={scrollToForm}
                  >
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-3xl group shadow-lg hover:shadow-orange-200/50 transform hover:-translate-y-2">
                <div className="h-64 relative overflow-hidden bg-gray-50 flex items-center justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8XFNbekXijRAPKm8ztLV0yzIvvQjMT.png"
                    alt="Canastra Suave"
                    width={200}
                    height={250}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Canastra Suave</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Doce e equilibrado com toque cítrico. Perfeito para espresso premium.
                  </p>
                  <p className="text-2xl font-bold text-orange-600 mb-6">A partir de R$ 26,90/un.</p>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full group"
                    onClick={scrollToForm}
                  >
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-3xl group shadow-lg hover:shadow-orange-200/50 transform hover:-translate-y-2">
                <div className="h-64 relative overflow-hidden bg-gray-50 flex items-center justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-65t8l0EGTYV2kk3jZseY2XhueHXjr7.png"
                    alt="Café Canela"
                    width={200}
                    height={250}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Café Canela</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Blend especial com canela. Sabor único que conquista paladares exigentes.
                  </p>
                  <p className="text-2xl font-bold text-orange-600 mb-6">A partir de R$ 26,90/un.</p>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full group"
                    onClick={scrollToForm}
                  >
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Mobile: Carrossel Horizontal */}
            <div className="md:hidden">
              <div className="relative">
                <Card className="w-full overflow-hidden bg-white border-0 rounded-3xl shadow-lg">
                  <div className="h-64 bg-gray-50 flex items-center justify-center p-4">
                    <Image
                      src={products[currentProductIndex].image || "/placeholder.svg"}
                      alt={products[currentProductIndex].name}
                      width={200}
                      height={250}
                      className="object-contain max-h-full"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{products[currentProductIndex].name}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {products[currentProductIndex].description}
                    </p>
                    <p className="text-lg font-bold text-orange-600 mb-4">{products[currentProductIndex].price}</p>
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full"
                      onClick={scrollToForm}
                    >
                      Solicitar Orçamento
                    </Button>
                  </CardContent>
                </Card>

                <div className="absolute top-1/2 -translate-y-1/2 left-2">
                  <button
                    onClick={prevProduct}
                    className="bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowRight className="w-6 h-6 text-gray-600 transform rotate-180" />
                  </button>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 right-2">
                  <button
                    onClick={nextProduct}
                    className="bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowRight className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                {products.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full mx-1 ${
                      index === currentProductIndex ? "bg-orange-500" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentProductIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário Responsivo */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100" id="contato" ref={formRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isFormVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-4 md:mb-8 px-2">
              Aumente o lucro do seu <span className="text-orange-500">negócio agora</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-center text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Nosso time está online. Resposta em segundos. Será um prazer atendê-lo.
            </p>
            <div className="max-w-lg mx-auto">
              <Card className="bg-white border-0 rounded-3xl p-6 md:p-8 shadow-2xl shadow-orange-200/20">
                <CardContent className="flex flex-col gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nome Completo</label>
                    <input
                      type="text"
                      className="w-full py-3 md:py-4 px-4 md:px-6 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                      placeholder="Seu Nome Completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full py-3 md:py-4 px-4 md:px-6 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      className="w-full py-3 md:py-4 px-4 md:px-6 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                      placeholder="(DD)XXXXX-XXXX"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 md:py-4 px-6 rounded-full focus:outline-none focus:shadow-outline transform hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-lg"
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "ENVIAR"}
                    {!isSubmitting && (
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Por que escolher Café Canastra */}
      <section className="py-20 bg-white" ref={benefitsRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isBenefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16 leading-tight">
              Por que escolher <span className="text-orange-500">Café Canastra?</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                {
                  icon: Shield,
                  title: "Qualidade Certificada",
                  subtitle: "Café acima de 80 pontos SCA",
                },
                {
                  icon: Coffee,
                  title: "Frescor Máximo",
                  subtitle: "Torras sob demanda",
                },
                {
                  icon: TrendingUp,
                  title: "Mais Lucro",
                  subtitle: "Melhor preço do Brasil",
                },
                {
                  icon: Truck,
                  title: "Entrega Nacional",
                  subtitle: "Logística rápida em todo país",
                },
              ].map((benefit, index) => (
                <Card
                  key={index}
                  className={`text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 bg-white/90 backdrop-blur-sm border-0 rounded-3xl  flex flex-col justify-center group shadow-lg hover:shadow-orange-200/50 ${
                    isBenefitsVisible ? "animate-in slide-in-from-bottom-4" : ""
                  } h-[220px] md:h-[240px]`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                    <p className="text-sm md:text-base text-gray-600">{benefit.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logos dos Parceiros */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100" ref={partnersRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isPartnersVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
              Parceiros que escolheram a <span className="text-orange-500">excelência</span>
            </h2>
            <p className="text-xl text-center text-gray-600 mb-16">Mais de 500 cafeterias confiam</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-center">
                <CardContent className="p-0">
                  <Image
                    src="/images/filho-de-minas-logo.png"
                    alt="Filho de Minas"
                    width={120}
                    height={60}
                    className="mx-auto"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-center">
                <CardContent className="p-0">
                  <Image
                    src="/images/divina-terra-logo.png"
                    alt="Divina Terra"
                    width={120}
                    height={60}
                    className="mx-auto"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-center">
                <CardContent className="p-0">
                  <Image src="/images/banca-43-logo.png" alt="Banca 43" width={120} height={60} className="mx-auto" />
                </CardContent>
              </Card>

              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-center">
                <CardContent className="p-0">
                  <Image
                    src="/images/emporio-bahamas-logo.png"
                    alt="Empório Bahamas"
                    width={120}
                    height={60}
                    className="mx-auto"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white" ref={testimonialsRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isTestimonialsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
              Histórias de <span className="text-orange-500">sucesso real</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 rounded-3xl p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "Nossos clientes notaram a diferença imediatamente. O aroma é incrível e as vendas aumentaram
                    bastante."
                  </p>
                  <div className="font-bold text-gray-800">Brainer – Goiânia/GO</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 rounded-3xl p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "O café gira rápido e os clientes sempre elogiam. Fomos aumentando a linha de produtos e agora
                    dispomos dela completa, foi um sucesso."
                  </p>
                  <div className="font-bold text-gray-800">Petterson Amorin – Frederico Westphalen/RS</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 rounded-3xl p-8 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                    <Star className="w-5 h-5 text-orange-500 fill-current" />
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "Atendimento excepcional e produto de qualidade. A logística deles é rápida e o João me atende muito
                    bem. Parceria que realmente funciona."
                  </p>
                  <div className="font-bold text-gray-800">Sônia Lopes – São Paulo/SP</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Último bloco CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100" ref={finalCtaRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isFinalCtaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
              Última chance de <span className="text-orange-500">transformar seu negócio</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center p-6">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Resposta Imediata</h3>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center p-6">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Entrega Rápida</h3>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center p-6">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Sem Burocracia</h3>
                </CardContent>
              </Card>
            </div>

            <div className="text-center space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
              

              <Button
                onClick={scrollToForm}
                size="lg"
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-10 py-5 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 group"
              >
                FALAR COM EQUIPE
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <p className="text-gray-400 mb-2 text-lg">Café Canastra - Desde 1985</p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-sm">
            <div className="space-y-3">
              <div className="flex items-start">
                <Building className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-orange-400" />
                <p>Boaventura Cafés Especiais Ltda - CNPJ 24.252.228/0001-37</p>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-orange-400" />
                <p>Fazenda Divineia: Rodovia LMG827, km15 - Pratinha-Medeiros - Minas Gerais</p>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-orange-400" />
                <p>Torrefação: Rua Nivaldo Guerreiro Nunes, 701 - Distrito Industrial - Uberlândia/MG</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0 text-orange-400" />
                <p>Telefone: (34) 3226-2600</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0 text-orange-400" />
                <p>Email: comercial@cafecanastra.com</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Café Canastra. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
