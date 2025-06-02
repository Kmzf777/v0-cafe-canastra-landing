"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Package, Truck, Star, Award, CheckCircle, ChevronDown, ChevronUp, ArrowRight } from "lucide-react"

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

export default function CafeCanastraLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { isVisible: isHeroVisible, elementRef: heroRef } = useScrollAnimation()
  const { isVisible: isLogoVisible, elementRef: logoRef } = useScrollAnimation()
  const { isVisible: isBenefitsVisible, elementRef: benefitsRef } = useScrollAnimation()
  const { isVisible: isHowItWorksVisible, elementRef: howItWorksRef } = useScrollAnimation()
  const { isVisible: isSocialProofVisible, elementRef: socialProofRef } = useScrollAnimation()
  const { isVisible: isOptionsVisible, elementRef: optionsRef } = useScrollAnimation()
  const { isVisible: isHistoryVisible, elementRef: historyRef } = useScrollAnimation()
  const { isVisible: isFaqVisible, elementRef: faqRef } = useScrollAnimation()
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isContactVisible, setIsContactVisible] = useState(false)
  const contactRef = useRef<HTMLElement>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const scrollToForm = () => {
    const contactSection = document.getElementById("contact")
    contactSection?.scrollIntoView({ behavior: "smooth" })
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
      timestamp: new Date().toISOString(),
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

      // Abrir WhatsApp
      window.open("https://wa.me/5534997308171", "_blank")

      // Limpar formulário
      setName("")
      setWhatsapp("")
    } catch (error) {
      console.error("Erro ao enviar dados:", error)
      // Mesmo com erro, abrir WhatsApp
      window.open("https://wa.me/5534997308171", "_blank")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsContactVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    if (contactRef.current) {
      observer.observe(contactRef.current)
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banner-hero.png"
            alt="Café personalizado com sua marca"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={scrollToForm}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 group"
          >
            Quero minha marca de café
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Entre em contato */}
      <section className="py-20 bg-white" id="contact" ref={contactRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isContactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">
              Entre em <span className="text-orange-500">contato agora!</span>
            </h2>
            <p className="text-lg md:text-xl text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Assim que você preencher, já vamos te mandar uma mensagem!
            </p>
            <div className="max-w-lg mx-auto">
              <Card className="bg-white border-0 rounded-3xl p-8 shadow-2xl shadow-orange-200/20">
                <CardContent className="space-y-6">
                  <div>
                    <input
                      type="text"
                      className="w-full py-4 px-6 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                      placeholder="Nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      className="w-full py-4 px-6 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
                      placeholder="WhatsApp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-full focus:outline-none focus:shadow-outline transform hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar"}
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

      {/* Logo + Mini CTA */}
      <section className="pb-0 pt-0 bg-white" ref={logoRef}>
        <div className="container mx-auto px-4 text-center">
          <div
            className={`transition-all duration-1000 delay-200 ${
              isLogoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Image
              src="/images/logo-canastra.png"
              alt="Café Canastra"
              width={144}
              height={86}
              className="mx-auto mb-12"
            />

            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Torrefação sob medida
              <br />
              <span className="text-orange-500">com a sua marca.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 font-light max-w-2xl mx-auto">
              Você cuida da marca. A gente entrega o sabor que conquista corações.
            </p>

            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 group"
            >
              Quero minha marca de café
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100" ref={benefitsRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isBenefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16 leading-tight">
              Por que criar sua marca de café
              <br />
              <span className="text-orange-500">com a Canastra?</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {[
                {
                  icon: Coffee,
                  title: "Café 100% Arábica",
                  desc: "Grãos selecionados da Serra da Canastra",
                },
                {
                  icon: Package,
                  title: "Design Incluso",
                  desc: "Embalagem personalizada com sua marca",
                },
                {
                  icon: Star,
                  title: "Torra Personalizada",
                  desc: "Ponto ideal para seu público",
                },
                {
                  icon: Truck,
                  title: "Entrega Nacional",
                  desc: "Logística ágil para todo Brasil",
                },
                {
                  icon: CheckCircle,
                  title: "Sua Marca",
                  desc: "Produto exclusivo e diferenciado",
                },
                {
                  icon: Award,
                  title: "Qualidade Garantida",
                  desc: "Tradição desde 1985",
                },
              ].map((benefit, index) => (
                <Card
                  key={index}
                  className={`text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-3 bg-white/90 backdrop-blur-sm border-0 rounded-3xl  flex flex-col justify-center group shadow-lg hover:shadow-orange-200/50 ${
                    isBenefitsVisible ? "animate-in slide-in-from-bottom-4" : ""
                  } h-[220px] md:h-[250px]`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">{benefit.title}</h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{benefit.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-white" ref={howItWorksRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isHowItWorksVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
              Do design ao sabor,
              <br />
              <span className="text-orange-500">a gente cuida de tudo.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Design da embalagem", desc: "Criamos o visual perfeito da sua marca" },
                { step: "2", title: "Torra personalizada", desc: "Perfil de torra ideal para seu público" },
                { step: "3", title: "Empacotamento", desc: "Processo artesanal com máximo cuidado" },
                { step: "4", title: "Entrega até você", desc: "Logística confiável e pontual" },
              ].map((step, index) => (
                <div
                  key={index}
                  className={`text-center group ${isHowItWorksVisible ? "animate-in slide-in-from-bottom-4" : ""}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    {index < 3 && (
                      <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-transparent"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nossas Opções */}
      <section className="py-20 bg-white" ref={optionsRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isOptionsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
              Escolha o <span className="text-orange-500">formato ideal:</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-3xl group shadow-lg hover:shadow-orange-200/50 transform hover:-translate-y-2">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/capsulas-produto.png"
                    alt="Cápsulas de café personalizadas"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Cápsulas</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Compatíveis com Nespresso. Praticidade e qualidade premium em cada xícara para seus clientes.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full group"
                    onClick={scrollToForm}
                  >
                    Entrar em contato agora!
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 rounded-3xl group shadow-lg hover:shadow-orange-200/50 transform hover:-translate-y-2">
                <div className="h-64 relative overflow-hidden">
                  <Image
                    src="/images/cafe-tradicional-produto.png"
                    alt="Café tradicional personalizado"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Café Especial</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Moído ou em grãos. Disponível em 250g, 500g e 1Kg. Versatilidade para todos os momentos.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full group"
                    onClick={scrollToForm}
                  >
                    Entrar em contato agora!
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100" ref={historyRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isHistoryVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">
                Feito na Serra da Canastra.
                <br />
                <span className="text-orange-500">Com alma.</span>
              </h2>

              <div className="mb-12">
                <Image
                  src="/images/serra-canastra.jpg"
                  alt="Serra da Canastra - Terroir do café"
                  width={800}
                  height={400}
                  className="mx-auto rounded-3xl shadow-2xl"
                />
              </div>

              <div className="text-lg text-gray-700 leading-relaxed space-y-6 max-w-3xl mx-auto">
                <p className="text-xl">
                  Desde 1985, nossa família cultiva não apenas café, mas tradição e paixão. Na Serra da Canastra, em
                  Minas Gerais, cada grão é tratado com o carinho que só quem ama o que faz pode oferecer.
                </p>
                <p>
                  Hoje, levamos essa mesma dedicação para sua marca, garantindo que cada pacote carregue não só o melhor
                  sabor, mas também nossa história de compromisso com a qualidade e autenticidade que conquistam
                  corações.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100" ref={faqRef}>
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 ${
              isFaqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
              Perguntas <span className="text-orange-500">Frequentes</span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-4">
              {[
                {
                  question: "Posso usar meu próprio grão?",
                  answer:
                    "Sim! Trabalhamos tanto com nossos grãos premium quanto com grãos fornecidos pelo cliente, sempre mantendo nossa qualidade de torra excepcional.",
                },
                {
                  question: "Vocês fazem só a torra?",
                  answer:
                    "Oferecemos o serviço completo: desde o design da embalagem, torra personalizada, empacotamento até a entrega. Você pode escolher quais etapas deseja terceirizar.",
                },
                {
                  question: "Qual o pedido mínimo?",
                  answer:
                    "O pedido mínimo é de 100 unidades. Você pode começar com essa quantidade e ir crescendo gradualmente conosco conforme seu negócio se desenvolve.",
                },
                {
                  question: "Qual o prazo médio de entrega?",
                  answer:
                    "O prazo varia de 7 a 15 dias úteis, dependendo da personalização e quantidade. Para pedidos urgentes, nossa equipe comercial oferece soluções expressas.",
                },
                {
                  question: "Como funciona a personalização da embalagem?",
                  answer:
                    "Nossa equipe de design trabalha com você para criar uma embalagem única e impactante. Você pode enviar sua arte ou podemos criar do zero baseado na sua marca.",
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className="overflow-hidden bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex justify-between items-center hover:bg-orange-50 transition-colors group"
                    >
                      <span className="font-bold text-gray-800 text-lg group-hover:text-orange-600 transition-colors">
                        {faq.question}
                      </span>
                      {openFaq === index ? (
                        <ChevronUp className="w-6 h-6 text-orange-500" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-orange-500" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed text-lg">{faq.answer}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Image
            src="/images/logo-canastra.png"
            alt="Café Canastra"
            width={150}
            height={90}
            className="mx-auto mb-6 filter invert"
          />
          <p className="text-gray-400 mb-2 text-lg">Café Canastra - Desde 1985</p>
          <p className="text-gray-400">Serra da Canastra, Minas Gerais</p>
        </div>
      </footer>
    </div>
  )
}
