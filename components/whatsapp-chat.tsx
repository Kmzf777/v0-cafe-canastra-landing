"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { X, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface ChatProps {
  isOpen: boolean
  onClose: () => void
}

type ConversationStep = 'greeting' | 'name' | 'phone' | 'email' | 'completed'

export default function WhatsAppChat({ isOpen, onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting')
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: ""
  })
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messageIdCounter = useRef(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage('Olá! É um prazer te ter aqui na Café Canastra! 👋');
        setTimeout(() => {
          addBotMessage('Para que eu possa te ajudar melhor, preciso de algumas informações. Qual é o seu nome?');
          setCurrentStep('name')
        }, 2000);
      }, 1000);
    }
    
    // Cleanup do timeout quando o chat é fechado
    if (!isOpen) {
      clearReplyTimeout();
    }
  }, [isOpen]);

  // Cleanup do timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
      clearReplyTimeout();
    };
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    messageIdCounter.current += 1;
    const newMessage: Message = {
      id: `msg-${messageIdCounter.current}`,
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearReplyTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTimeout = () => {
    clearReplyTimeout();
    timeoutRef.current = setTimeout(() => {
      if (currentStep !== 'completed') {
        addBotMessage('Preciso que você me diga para que eu te chame no WhatsApp, é rapidinho! 😊', false);
      }
    }, 15000); // 15 segundos
  };

  const addBotMessage = (text: string, shouldStartTimeout: boolean = true) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      messageIdCounter.current += 1;
      const newMessage: Message = {
        id: `msg-${messageIdCounter.current}`,
        text,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, newMessage])
      // Inicia o timeout após cada mensagem do bot (exceto se já completou ou se especificado para não iniciar)
      if (currentStep !== 'completed' && shouldStartTimeout) {
        startTimeout();
      }
    }, 1000 + Math.random() * 1000) // Simula tempo de digitação variável
  }

  const addUserMessage = (text: string) => {
    messageIdCounter.current += 1;
    const newMessage: Message = {
      id: `msg-${messageIdCounter.current}`,
      text,
      isUser: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const validatePhone = (phone: string) => {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '')
    return cleanPhone.length >= 10 && cleanPhone.length <= 11
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSubmitting) return

    // Limpa o timeout quando o usuário responde
    clearReplyTimeout();

    const message = inputValue.trim()
    addUserMessage(message)
    setInputValue("")

    // Processa a resposta baseada no step atual
    switch (currentStep) {
      case 'greeting':
        // Qualquer mensagem no greeting avança para o nome
        setTimeout(() => {
          addBotMessage('Para que eu possa te ajudar melhor, preciso de algumas informações. Qual é o seu nome?');
          setCurrentStep('name')
        }, 800)
        break

      case 'name':
        if (message.length < 2) {
          setTimeout(() => {
            addBotMessage("Por favor, digite um nome válido com pelo menos 2 caracteres.")
          }, 800)
          return
        }
        setUserInfo(prev => ({ ...prev, name: message }))
        setTimeout(() => {
          addBotMessage(`Prazer em conhecê-lo, ${message}! 😊`)
          setTimeout(() => {
            addBotMessage("Agora, qual é o seu número de telefone? (com DDD)")
            setCurrentStep('phone')
          }, 1500)
        }, 800)
        break

      case 'phone':
        if (!validatePhone(message)) {
          setTimeout(() => {
            addBotMessage("Por favor, digite um número de telefone válido com DDD (ex: 11999999999)")
          }, 800)
          return
        }
        setUserInfo(prev => ({ ...prev, phone: message }))
        setTimeout(() => {
          addBotMessage("Perfeito! 📱")
          setTimeout(() => {
            addBotMessage("Por último, qual é o seu e-mail?")
            setCurrentStep('email')
          }, 1500)
        }, 800)
        break

      case 'email':
        if (!validateEmail(message)) {
          setTimeout(() => {
            addBotMessage("Por favor, digite um e-mail válido (ex: seuemail@exemplo.com)")
          }, 800)
          return
        }
        setUserInfo(prev => ({ ...prev, email: message }))
        setCurrentStep('completed')
        setIsSubmitting(true)
        
        setTimeout(() => {
          addBotMessage("Obrigada pelas informações! 📧")
          setTimeout(() => {
            addBotMessage("Estou processando seus dados...")
            // Enviar para webhook
            submitToWebhook({
              ...userInfo,
              email: message
            })
          }, 1500)
        }, 800)
        break
    }
  }

  const submitToWebhook = async (data: typeof userInfo) => {
    try {
      const formData = {
        nome: data.name,
        whatsapp: data.phone,
        email: data.email,
        origem: "Chat WhatsApp",
        timestamp: new Date().toISOString()
      }

      // Enviar para os dois webhooks (mesmo padrão das outras páginas)
      const webhookPromises = [
        fetch("https://n8n.canastrainteligencia.com/webhook-test/landing-page", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }).catch(err => {
          console.warn("Webhook 1 falhou:", err)
          return { ok: false }
        }),
        fetch("https://webhook.canastrainteligencia.com/webhook/landing-page", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }).catch(err => {
          console.warn("Webhook 2 falhou:", err)
          return { ok: false }
        })
      ]

      const results = await Promise.all(webhookPromises)
      
      // Considera sucesso se pelo menos um webhook funcionou
      const hasSuccess = results.some(result => result.ok !== false)
      
      if (hasSuccess) {
        setTimeout(() => {
          addBotMessage("Tudo certo! Em breve entraremos em contato. ✅")
          setTimeout(() => {
            addBotMessage("Redirecionando você...")
            setTimeout(() => {
              // Detectar a página atual e redirecionar para a página correta
              const currentPath = window.location.pathname
              let redirectPath = '/obrigadoatacado' // padrão
              
              if (currentPath.includes('/terceirizacaocafe')) {
                redirectPath = '/obrigadoterceirizacao'
              } else if (currentPath.includes('/graocafeteria')) {
                redirectPath = '/obrigadoatacado'
              } else if (currentPath.includes('/cafeatacado')) {
                redirectPath = '/obrigadocafeatacado'
              }
              
              router.push(redirectPath)
            }, 2000)
          }, 1500)
        }, 1000)
      } else {
        throw new Error("Todos os webhooks falharam")
      }

    } catch (error) {
      console.error("Erro ao enviar dados:", error)
      setTimeout(() => {
        addBotMessage("Ops! Houve um erro. Tente novamente mais tarde. ❌")
        setIsSubmitting(false)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-0 md:p-4">
      <div className="w-full h-full md:max-w-md md:h-[90vh] bg-white md:rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#075e54] text-white p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src="/valeria-foto.jpeg"
              alt="Valéria"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Valéria</h3>
            <p className="text-xs text-green-200">
              {isTyping ? "digitando..." : "online"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] space-y-3">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.isUser
                    ? 'bg-[#dcf8c6] text-black rounded-br-sm'
                    : 'bg-white text-black shadow-sm rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? 'text-gray-600' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f0f0] p-4 flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite uma mensagem..."
            disabled={isSubmitting || currentStep === 'completed'}
            className="flex-1 bg-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#075e54] disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSubmitting}
            className="bg-[#075e54] text-white p-2 rounded-full hover:bg-[#064e45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}