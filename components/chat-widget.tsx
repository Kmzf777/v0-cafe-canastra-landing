"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, ArrowLeft, Send, ExternalLink } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface ChatMessage {
  id: number
  author: "Atendente" | "Você"
  text?: string
  type?: "text" | "button"
  buttonLabel?: string
  buttonHref?: string
}

type ChatStep = "name" | "phone" | "email" | "done"

export default function ChatWidget() {
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typing, setTyping] = useState(false)
  const [step, setStep] = useState<ChatStep>("name")
  const [contact, setContact] = useState<{ name?: string; phone?: string; phoneRaw?: string; email?: string }>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputBarRef = useRef<HTMLDivElement>(null)
  const [inputBarHeight, setInputBarHeight] = useState(72)
  const [vvHeight, setVvHeight] = useState<number | null>(null)

  const pushMessage = (author: ChatMessage["author"], payload: Omit<ChatMessage, "id" | "author">) => {
    setMessages((prev) => [...prev, { id: Date.now() + prev.length, author, ...payload }])
  }

  const typeAndSend = (text: string, typeDelay = 900) => {
    setTyping(true)
    setTimeout(() => {
      pushMessage("Atendente", { type: "text", text })
      setTyping(false)
    }, typeDelay)
  }

  const sanitizePhone = (s: string) => s.replace(/\D/g, "")
  const isValidEmail = (s: string) => /.+@.+\..+/.test(s)

  const formatPhoneForWa = (digits: string) => {
    if (!digits) return ""
    if (digits.startsWith("55")) return digits
    return `55${digits}`
  }

  const sendWebhooks = async () => {
    const baseData = {
      nome: contact.name ?? "",
      whatsapp: contact.phoneRaw ?? contact.phone ?? "",
      email: contact.email ?? "",
      timestamp: new Date().toISOString(),
    }
    const isGrao = pathname?.startsWith("/graocafeteria")
    const formData = isGrao ? { ...baseData, origem: "graocafeteria" } : baseData

    try {
      await Promise.all([
        fetch("https://n8n.canastrainteligencia.com/webhook-test/landing-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
        fetch("https://webhook.canastrainteligencia.com/webhook/landing-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
      ])
    } catch (e) {
      console.error("Erro ao enviar dados do chat:", e)
    }
  }

  const handleOpen = () => {
    setMessages([])
    setContact({})
    setStep("name")
    setOpen(true)
    typeAndSend("Olá! 😊 Bem-vindo ao atendimento Canastra.")
    setTimeout(() => {
      typeAndSend("Qual o seu nome?")
    }, 1300)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleClose = () => setOpen(false)

  const handleSend = () => {
    const text = message.trim()
    if (!text) return

    pushMessage("Você", { type: "text", text })
    setMessage("")

    if (step === "name") {
      setContact((prev) => ({ ...prev, name: text }))
      typeAndSend(`Prazer, ${text}! Qual seu telefone (WhatsApp)?`)
      setStep("phone")
      return
    }

    if (step === "phone") {
      const digits = sanitizePhone(text)
      if (digits.length < 10) {
        typeAndSend("Pode informar o telefone com DDD?")
        return
      }
      setContact((prev) => ({ ...prev, phone: digits, phoneRaw: text }))
      typeAndSend("Legal! Qual seu e-mail?")
      setStep("email")
      return
    }

    if (step === "email") {
      if (!isValidEmail(text)) {
        typeAndSend("Hmm, parece inválido. Poderia confirmar seu e-mail?")
        return
      }
      setContact((prev) => ({ ...prev, email: text }))
      typeAndSend("Perfeito! Obrigado, já vamos te chamar. ☕️")
      setTimeout(() => {
        const summary = `Recebemos: Nome ${contact.name ?? ""}, WhatsApp ${contact.phoneRaw ?? contact.phone ?? ""}, Email ${text}.`
        pushMessage("Atendente", { type: "text", text: summary })
        // Dispara webhooks e redireciona para página de obrigado após 3s
        sendWebhooks()
        const redirectPath = pathname?.startsWith("/graocafeteria") ? "/obrigadoatacado" : "/obrigadoterceirizacao"
        setTimeout(() => {
          router.push(redirectPath)
        }, 3000)
      }, 1100)
      setStep("done")
      return
    }

    if (step === "done") {
      typeAndSend("Um atendente vai continuar por aqui. Como posso ajudar?")
    }

    setTimeout(() => inputRef.current?.focus(), 50)
  }

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, typing])

  return (
    <>
      <button
        aria-label="Abrir chat"
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[1000] bg-white overflow-hidden" style={{ height: vvHeight ?? undefined }}>
          <div className="fixed top-0 left-0 right-0 h-16 px-4 flex items-center gap-3 border-b bg-white/95 backdrop-blur">
            <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold">Atendimento Canastra</div>
                <div className="text-xs text-muted-foreground">Online agora • WhatsApp</div>
              </div>
            </div>
          </div>

          <div
            ref={listRef}
            className="overflow-y-auto"
            style={{ paddingTop: 80, paddingBottom: inputBarHeight + 16, height: vvHeight ? vvHeight - 64 - inputBarHeight : undefined }}
          >
            <div className="max-w-2xl mx-auto px-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.author === "Você" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      m.author === "Você"
                        ? "bg-[#E7F9EF] text-gray-800 rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wide mb-1 text-gray-500">
                      {m.author}
                    </div>

                    {m.type !== "button" ? (
                      <div>{m.text}</div>
                    ) : (
                      <a
                        href={m.buttonHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white font-medium shadow-sm hover:bg-[#1ebe5b] transition"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {m.buttonLabel ?? "Abrir Whatsapp."}
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm bg-gray-100 text-gray-800 rounded-bl-none">
                    <div className="text-[10px] uppercase tracking-wide mb-1 text-gray-500">Atendente</div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-2">
                <div className="text-xs text-muted-foreground">Canastra está respondendo rapidamente ✨</div>
              </div>
            </div>
          </div>

          <div
            ref={inputBarRef}
            className="fixed left-0 right-0 bg-white border-t px-3 py-3"
            style={{ bottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="max-w-2xl mx-auto flex items-center gap-2">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend()
                }}
                onFocus={() => {
                  // Garante que a última mensagem esteja visível quando o teclado abrir
                  setTimeout(() => {
                    const el = listRef.current
                    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "auto" })
                  }, 350)
                }}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button onClick={handleSend} className="bg-[#25D366] hover:bg-[#1ebe5b]">
                Enviar
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}