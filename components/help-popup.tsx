"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import WhatsAppChat from "./whatsapp-chat"
import { usePathname } from "next/navigation"
import { X, AlertTriangle, Sparkles, Tag, BadgeCheck, Truck, Timer } from "lucide-react"

export default function HelpPopup() {
  const pathname = usePathname()
  const [popupVisible, setPopupVisible] = useState(false)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [bubbleTyping, setBubbleTyping] = useState(false)
  const [bubbleTextVisible, setBubbleTextVisible] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [exitIntentOpen, setExitIntentOpen] = useState(false)

  const route = pathname || ""
  // Considera aliases da página de terceirização
  const isPrivateLabel = route.includes("/terceirizacaocafe") || route.includes("/terceirizacao")
  const isAtacado = route.includes("/graocafeteria")
  const variant: "private-label" | "atacado" | "default" = isPrivateLabel ? "private-label" : isAtacado ? "atacado" : "default"

  const gradientClass =
    variant === "private-label"
      ? "from-fuchsia-500 to-purple-600"
      : variant === "atacado"
      ? "from-orange-500 to-amber-600"
      : "from-teal-500 to-emerald-600"

  const headline =
    variant === "private-label"
      ? "Você está prestes a perder o café dos seus sonhos com a sua marca."
      : variant === "atacado"
      ? "Você está prestes a perder o melhor preço e agilidade no atacado."
      : "Antes de sair, você pode garantir vantagens exclusivas do Café Canastra."

  const subtext =
    variant === "private-label"
      ? "Produzimos seu café com sua marca: blends exclusivos, rotulagem e acompanhamento completo."
      : variant === "atacado"
      ? "Fechamos pedidos com rapidez: preço competitivo, cotação instantânea e frete ágil."
      : "Fale com a Valéria para condições especiais, suporte e resposta imediata."

  const bullets =
    variant === "private-label"
      ? [
          { icon: Sparkles, text: "Crie um blend exclusivo com perfil sensorial da sua marca." },
          { icon: Tag, text: "Rótulo e identidade visual personalizados sem complicação." },
          { icon: BadgeCheck, text: "Qualidade controlada e torras consistentes, lote a lote." },
          { icon: Truck, text: "Logística e prazos de produção alinhados ao seu lançamento." },
        ]
      : variant === "atacado"
      ? [
          { icon: Tag, text: "Preço de atacado competitivo para maximizar sua margem." },
          { icon: Timer, text: "Cotação imediata e fechamento ágil pelo WhatsApp." },
          { icon: Truck, text: "Frete rápido e previsível para Sul/Sudeste." },
          { icon: BadgeCheck, text: "Atendimento dedicado para seleção de linhas e volumes." },
        ]
      : [
          { icon: Tag, text: "Preços de atacado com margem real para revenda." },
          { icon: Truck, text: "Frete ágil e suporte direto no WhatsApp." },
          { icon: BadgeCheck, text: "Condições especiais para primeira compra." },
          { icon: Timer, text: "Resposta rápida: menos de 1 minuto para começar." },
        ]

  const ctaLabel =
    variant === "private-label"
      ? "Quero minha marca no café"
      : variant === "atacado"
      ? "Quero o melhor preço agora"
      : "Conversar no WhatsApp"

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

  // Abre o chat automaticamente após 15 segundos
  useEffect(() => {
    const autoOpenTimer = setTimeout(() => {
      // Evita abrir o chat se o pop-up anti-saída estiver visível
      setChatOpen((prev) => (exitIntentOpen ? prev : true))
    }, 15000)

    return () => {
      clearTimeout(autoOpenTimer)
    }
  }, [exitIntentOpen])

  // Exit-intent: abre pop-up quando o usuário tenta sair da página (desktop)
  useEffect(() => {
    const KEY = `exit_intent_shown:${variant}`

    const maybeShow = (e: MouseEvent) => {
      // Evita em mobile e quando o chat já está aberto
      if (window.innerWidth < 768 || chatOpen) return
      const already = sessionStorage.getItem(KEY)
      if (already) return

      // Dispara quando o cursor chega próximo ao topo
      const nearTop = e.clientY <= 10
      const leavingWindow = !e.relatedTarget && e.clientY < 10

      if (nearTop || leavingWindow) {
        setExitIntentOpen(true)
        try { sessionStorage.setItem(KEY, '1') } catch {}
      }
    }

    // Usa mousemove para captar intenção de saída de forma mais confiável
    document.addEventListener('mousemove', maybeShow)
    document.addEventListener('mouseleave', maybeShow)
    document.addEventListener('mouseout', maybeShow)

    return () => {
      document.removeEventListener('mousemove', maybeShow)
      document.removeEventListener('mouseleave', maybeShow)
      document.removeEventListener('mouseout', maybeShow)
    }
  }, [chatOpen, variant])

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
              className={`${`relative rounded-2xl bg-[#25D366] text-white px-3 py-2 sm:px-4 sm:py-3 shadow-xl hover:bg-[#1EBE5C] transition-all duration-200 hover:scale-105`} ${
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
                    Vamos falar no Whatsapp?
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
          className="group relative h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl active:scale-95 overflow-visible"
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

          {/* Indicador online: círculo pequeno no canto inferior direito */}
          <div
            className="absolute bottom-[-3px] right-[-3px] h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#25D366] ring-2 ring-white z-20"
            aria-hidden="true"
          ></div>
          
          {/* Efeito Ripple */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400/20 to-teal-500/20 animate-ping opacity-20 z-10"></div>
        </button>
      </div>

      {/* Chat do WhatsApp */}
      <WhatsAppChat 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
      />

      {/* Pop-up Anti-Saída */}
      {exitIntentOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
            <div className={`h-1 w-full bg-gradient-to-r ${gradientClass}`} />
            <button
              onClick={() => setExitIntentOpen(false)}
              aria-label="Fechar"
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${gradientClass} text-white px-3 py-1 text-xs font-bold tracking-wide`}>ESPERA...</span>
                <AlertTriangle className="text-orange-600" size={18} />
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug">{headline}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{subtext}</p>
              <ul className="mt-4 space-y-2">
                {bullets.map(({ icon: Icon, text }, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Icon size={18} className="text-foreground/80 mt-[2px]" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  onClick={() => setExitIntentOpen(false)}
                  className="px-3 py-2 rounded-md border bg-white hover:bg-muted/40 transition-colors"
                >
                  Continuar navegando
                </button>
                <button
                  onClick={() => { setExitIntentOpen(false); setChatOpen(true) }}
                  className={`px-4 py-2 rounded-md text-white bg-gradient-to-r ${gradientClass} hover:brightness-110 transition-colors`}
                >
                  {ctaLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}