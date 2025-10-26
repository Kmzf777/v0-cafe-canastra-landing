"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import WhatsAppChat from "./whatsapp-chat"

export default function HelpPopup() {
  const [popupVisible, setPopupVisible] = useState(false)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [bubbleTyping, setBubbleTyping] = useState(false)
  const [bubbleTextVisible, setBubbleTextVisible] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  // Sequência de animações
  useEffect(() => {
    // 1. Exibe popup com animação de entrada após 1 segundo
    const showPopupTimer = setTimeout(() => {
      setPopupVisible(true)
    }, 1000)

    // 2. Após popup aparecer, mostra balão com loading após 1.5 segundos
    const showBubbleTimer = setTimeout(() => {
      setBubbleVisible(true)
      setBubbleTyping(true)
    }, 2500)

    // 3. Após 2 segundos de loading, mostra a mensagem
    const showMessageTimer = setTimeout(() => {
      setBubbleTyping(false)
      setBubbleTextVisible(true)
    }, 4500)

    return () => {
      clearTimeout(showPopupTimer)
      clearTimeout(showBubbleTimer)
      clearTimeout(showMessageTimer)
    }
  }, [])

  return (
    <>
      {/* Popup Principal */}
      <div
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-500 ${
          popupVisible 
            ? "animate-in fade-in-0 slide-in-from-bottom-4 scale-in-95 duration-500" 
            : "opacity-0 pointer-events-none scale-95"
        }`}
      >
        {/* Balão de Mensagem */}
        {bubbleVisible && (
          <div className={`absolute flex items-center animate-in fade-in-0 duration-300 ${
            // Mobile: mensagem ao lado esquerdo do botão, alinhada verticalmente
            'top-1/2 -translate-y-1/2 ' +
            // Posicionamento horizontal responsivo para todas as telas
            (bubbleTyping 
              ? '-left-20 sm:-left-24 md:-left-24 lg:-left-24' // Quando está digitando (balão menor)
              : '-left-52 sm:-left-56 md:-left-60 lg:-left-50 xl:-left-68' // Quando mostra texto completo
            )
          }`}>
            <button
              onClick={() => setChatOpen(true)}
              className={`${`relative rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 sm:px-4 sm:py-3 shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:scale-105`} ${
                bubbleTyping 
                  ? "w-auto" 
                  : "whitespace-nowrap"
              } text-xs sm:text-sm`}
            >
              <div className="text-sm font-medium min-h-[20px]" aria-live="polite">
                {bubbleTyping ? (
                  <div className="flex items-center gap-1 justify-center w-full px-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2.5 w-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2.5 w-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : bubbleTextVisible ? (
                  <span>
                    Olá? precisa de ajuda? 👋
                  </span>
                ) : null}
              </div>
            </button>
          </div>
        )}

        {/* Botão com Foto de Perfil */}
        <button
          onClick={() => setChatOpen(true)}
          aria-label="Abrir ajuda"
          className="group relative h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl active:scale-95 overflow-hidden"
        >
          {/* Foto de Perfil */}
          <div className="relative h-full w-full">
            <Image
              src="/valeria-foto.jpeg"
              alt="Valéria - Atendimento"
              fill
              className="object-cover rounded-full transition-transform group-hover:scale-110"
              sizes="64px"
            />
          </div>
          
          {/* Efeito Ripple */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400/20 to-teal-500/20 animate-ping opacity-20"></div>
        </button>
      </div>

      {/* Chat do WhatsApp */}
      <WhatsAppChat 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />
    </>
  )
}