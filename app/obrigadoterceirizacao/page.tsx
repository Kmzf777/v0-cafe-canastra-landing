"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Instagram, MapPin, Mail, Building, MessageCircle } from "lucide-react"

const WHATSAPP_URL = "https://wa.me/553491461669"
const AUTO_REDIRECT_SECONDS = 10

export default function ObrigadoPage() {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_REDIRECT_SECONDS)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          window.open(WHATSAPP_URL, "_blank")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              {/* Logo */}
              <div className="mb-12">
                <Image
                  src="/images/logo-canastra.png"
                  alt="Café Canastra"
                  width={200}
                  height={120}
                  className="mx-auto"
                />
              </div>

              {/* Thank you message */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 leading-tight">
                Obrigado pelo seu contato!
                <br />
                <span className="text-orange-500">Já te chamamos no Whatsapp.</span>
              </h1>

              {/* Countdown */}
              <p className="text-gray-500 text-base mb-6">
                Abrindo WhatsApp automaticamente em{" "}
                <span className="font-bold text-green-600">{secondsLeft}s</span>...
              </p>

              {/* Buttons Container */}
              <div className="flex flex-col space-y-4">
                {/* WhatsApp Button */}
                <Button
                  asChild
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-3 w-6 h-6" />
                    Abrir WhatsApp agora
                  </a>
                </Button>

                {/* Instagram Button */}
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                >
                  <a href="https://instagram.com/cafecanastra" target="_blank" rel="noopener noreferrer">
                    <Instagram className="mr-3 w-6 h-6" />
                    Siga-nos no Instagram
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </main>

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
                  <Mail className="w-5 h-5 mr-2 flex-shrink-0 text-orange-400" />
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
      </div>
    </>
  )
}
