"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Eye,
  Edit,
  Save,
  Info,
  Loader2,
  ArrowLeft,
  Coffee,
  MessageCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Calendar,
  Tag,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import {
  getAllPosts,
  updateBlogPost,
  deleteBlogPost,
  testSupabaseConnection,
  type BlogPost,
  debugEnvironmentVariables, // agora reexportada por lib/supabase
} from "@/lib/supabase"
import SupabaseStatus from "@/components/supabase-status"

export default function BlogManagerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("automatico")

  // Estado para verificação do Supabase
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "error">("checking")

  // Estado para a aba de Postagem Automática
  const [quantidadePosts, setQuantidadePosts] = useState(1)
  const [atrasoPosts, setAtrasoPosts] = useState(1000)

  // Estado para a aba de Postagem Personalizada
  const [tema, setTema] = useState("")
  const [publicoAlvo, setPublicoAlvo] = useState("")

  // Estado para a aba de Gerenciamento de Posts
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editedPost, setEditedPost] = useState<BlogPost | null>(null)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)

  const { toast } = useToast()

  // Verificar status do Supabase na inicialização
  useEffect(() => {
    checkSupabaseStatus()
  }, [])

  // Carregar posts do Supabase quando a aba de gerenciamento for ativada
  useEffect(() => {
    if (isAuthenticated && activeTab === "gerenciamento") {
      loadPostsFromSupabase()
    }
  }, [isAuthenticated, activeTab])

  const checkSupabaseStatus = async () => {
    try {
      console.log("=== VERIFICANDO STATUS DO SUPABASE ===")
      debugEnvironmentVariables()

      const isConnected = await testSupabaseConnection()
      setSupabaseStatus(isConnected ? "connected" : "error")

      if (!isConnected) {
        toast({
          title: "⚠️ Problema de Conexão",
          description: "Não foi possível conectar ao Supabase. Verifique as variáveis de ambiente.",
          variant: "destructive",
          duration: 10000,
        })
      }
    } catch (error) {
      console.error("Erro ao verificar Supabase:", error)
      setSupabaseStatus("error")
      toast({
        title: "❌ Erro de Configuração",
        description: "Variáveis de ambiente do Supabase não configuradas corretamente.",
        variant: "destructive",
        duration: 10000,
      })
    }
  }

  const loadPostsFromSupabase = async () => {
    if (supabaseStatus !== "connected") {
      toast({
        title: "Erro",
        description: "Supabase não está conectado. Verifique a configuração.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsLoadingPosts(true)
    try {
      console.log("=== CARREGANDO POSTS DO SUPABASE NO ADMIN ===")
      const allPosts = await getAllPosts()
      console.log("Posts carregados:", allPosts)
      setPosts(allPosts)
    } catch (error) {
      console.error("Erro ao carregar posts:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar posts do Supabase.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoadingPosts(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (username === "Canastrainteligencia" && password === "Canastrainteligencia@321") {
        setIsAuthenticated(true)
        setLoginError("")
      } else {
        setLoginError("Usuário ou senha incorretos")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleEnviarAutomatico = async () => {
    if (supabaseStatus !== "connected") {
      toast({
        title: "Erro",
        description: "Supabase não está conectado. Não é possível criar posts.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsLoading(true)
    const payload = {
      modo: "automático",
      quantidade: quantidadePosts,
      atraso: atrasoPosts,
    }

    console.log("=== ENVIANDO WEBHOOK AUTOMÁTICO ===")
    console.log("Payload:", payload)

    try {
      const res = await fetch("/api/blog-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const { webhookResults, createdPosts, savedPosts } = await res.json()
      console.log("Resposta do webhook:", { webhookResults, createdPosts, savedPosts })

      if (createdPosts > 0) {
        toast({
          title: "✅ Posts criados!",
          description: `${createdPosts} post(s) criados e salvos no Supabase.`,
          duration: 5000,
        })
        setActiveTab("gerenciamento")
        setTimeout(() => loadPostsFromSupabase(), 500)
      } else {
        throw new Error("Nenhum post criado")
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao acionar webhooks.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnviarPersonalizado = async () => {
    if (supabaseStatus !== "connected") {
      toast({
        title: "Erro",
        description: "Supabase não está conectado. Não é possível criar posts.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsLoading(true)
    const payload = {
      modo: "personalizado",
      tema: tema,
      publico_alvo: publicoAlvo,
    }

    console.log("=== ENVIANDO WEBHOOK PERSONALIZADO ===")
    console.log("Payload:", payload)

    try {
      const res = await fetch("/api/blog-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const { webhookResults, createdPosts, savedPosts } = await res.json()
      console.log("Resposta do webhook:", { webhookResults, createdPosts, savedPosts })

      if (createdPosts > 0) {
        toast({
          title: "✅ Post personalizado criado!",
          description: `Post sobre "${tema}" criado e salvo no Supabase.`,
          duration: 5000,
        })
        setTema("")
        setPublicoAlvo("")
        setActiveTab("gerenciamento")
        setTimeout(() => loadPostsFromSupabase(), 500)
      } else {
        throw new Error("Nenhum post criado")
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao acionar webhooks.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewPost = (post: BlogPost) => {
    setSelectedPost(post)
    setIsViewModalOpen(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setEditedPost({ ...post })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editedPost) return

    setIsLoading(true)
    try {
      const updatedPost = await updateBlogPost(editedPost.id, editedPost)

      if (updatedPost) {
        const updatedPosts = posts.map((post) => {
          if (post.id === editedPost.id) {
            return updatedPost
          }
          return post
        })

        setPosts(updatedPosts)

        toast({
          title: "Sucesso!",
          description: "Post atualizado no Supabase com sucesso.",
          duration: 5000,
        })
        setIsEditModalOpen(false)
      } else {
        throw new Error("Falha ao atualizar post")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as alterações no Supabase.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const success = await deleteBlogPost(postId)

      if (success) {
        const updatedPosts = posts.filter((post) => post.id !== postId)
        setPosts(updatedPosts)

        toast({
          title: "Post excluído",
          description: "O post foi removido do Supabase com sucesso.",
          duration: 3000,
        })
      } else {
        throw new Error("Falha ao deletar post")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir post do Supabase.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const viewBlogPage = (slug: string) => {
    window.open(`/blog/${slug}`, "_blank")
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Data inválida"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="w-full max-w-md shadow-lg border-amber-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img src="/logo-canastra.png" alt="Café Canastra" className="h-16" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Administração do Blog</CardTitle>
              <CardDescription className="text-gray-600">Faça login para acessar o painel</CardDescription>

              {/* Status do Supabase */}
              <div className="mt-4 p-3 rounded-lg bg-gray-50 border">
                <div className="flex items-center justify-center">
                  {supabaseStatus === "checking" && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">Verificando Supabase...</span>
                    </>
                  )}
                  {supabaseStatus === "connected" && (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-green-700">Supabase conectado</span>
                    </>
                  )}
                  {supabaseStatus === "error" && (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm text-red-700">Erro no Supabase</span>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">
                    Usuário
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300"
                  />
                </div>
                {loginError && <p className="text-sm font-medium text-red-500">{loginError}</p>}
                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={isLoading || supabaseStatus === "error"}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                {supabaseStatus === "error" && (
                  <p className="text-xs text-red-600 text-center">
                    Configure as variáveis de ambiente do Supabase antes de fazer login
                  </p>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/cafecanastra" className="text-amber-600 hover:text-amber-800 flex items-center text-sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para o site
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Status do Supabase */}
        <SupabaseStatus />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center">
            <img src="/logo-canastra.png" alt="Café Canastra" className="h-10 sm:h-12 mr-4" />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Painel do Blog</h1>
              <div className="flex items-center mt-1">
                {supabaseStatus === "connected" && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-700">Supabase conectado</span>
                  </>
                )}
                {supabaseStatus === "error" && (
                  <>
                    <AlertTriangle className="w-3 h-3 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">Erro no Supabase</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={checkSupabaseStatus}
              className="text-gray-600 hover:text-gray-800"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Link href="/cafecanastra">
              <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o site
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="automatico" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
            <TabsTrigger value="automatico" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Postagem Automática
            </TabsTrigger>
            <TabsTrigger
              value="personalizado"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Postagem Personalizada
            </TabsTrigger>
            <TabsTrigger
              value="gerenciamento"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Gerenciamento ({posts.length})
            </TabsTrigger>
          </TabsList>

          {/* Aba 1: Postagem Automática */}
          <TabsContent value="automatico">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Postagem Automática</CardTitle>
                <CardDescription className="text-gray-600">
                  Configure os parâmetros para postagens automáticas no blog
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quantidade" className="text-gray-700">
                      Quantidade de posts
                    </Label>
                    <span className="text-sm font-medium text-amber-600">{quantidadePosts}</span>
                  </div>
                  <Slider
                    id="quantidade"
                    min={1}
                    max={10}
                    step={1}
                    value={[quantidadePosts]}
                    onValueChange={(value) => setQuantidadePosts(value[0])}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label htmlFor="atraso" className="mr-2 text-gray-700">
                        Atraso entre posts (ms)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border-gray-200 text-gray-800">
                            <p className="w-[200px] text-sm">
                              Tempo de espera em milissegundos entre a publicação de cada post automático.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="text-sm font-medium text-amber-600">{atrasoPosts}ms</span>
                  </div>
                  <Input
                    id="atraso"
                    type="number"
                    min={100}
                    max={10000}
                    step={100}
                    value={atrasoPosts}
                    onChange={(e) => setAtrasoPosts(Number.parseInt(e.target.value))}
                    className="border-gray-300"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleEnviarAutomatico}
                  disabled={isLoading || supabaseStatus !== "connected"}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Aba 2: Postagem Personalizada */}
          <TabsContent value="personalizado">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">Postagem Personalizada</CardTitle>
                <CardDescription className="text-gray-600">Crie uma postagem personalizada para o blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tema" className="text-gray-700">
                    Tema
                  </Label>
                  <Input
                    id="tema"
                    placeholder="Ex: Café especial da Serra da Canastra"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publico" className="text-gray-700">
                    Público-Alvo
                  </Label>
                  <Input
                    id="publico"
                    placeholder="Ex: Apreciadores de café gourmet"
                    value={publicoAlvo}
                    onChange={(e) => setPublicoAlvo(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleEnviarPersonalizado}
                  disabled={isLoading || !tema || !publicoAlvo || supabaseStatus !== "connected"}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Aba 3: Gerenciamento de Posts */}
          <TabsContent value="gerenciamento">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-800">
                  <span>Gerenciamento de Posts do Blog (Supabase)</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadPostsFromSupabase}
                      disabled={isLoadingPosts || supabaseStatus !== "connected"}
                      className="border-amber-500 text-amber-600 hover:bg-amber-50 bg-transparent"
                    >
                      {isLoadingPosts ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Visualize, edite e gerencie os posts salvos no Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                {supabaseStatus !== "connected" ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Supabase não conectado</h3>
                    <p className="text-gray-600 mb-6">
                      Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
                    </p>
                    <Button onClick={checkSupabaseStatus} className="bg-amber-600 hover:bg-amber-700 text-white">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Verificar novamente
                    </Button>
                  </div>
                ) : isLoadingPosts ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum post encontrado</h3>
                    <p className="text-gray-600 mb-6">
                      Use as abas "Postagem Automática" ou "Postagem Personalizada" para criar novos posts
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => setActiveTab("automatico")}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Criar Post Automático
                      </Button>
                      <Button
                        onClick={() => setActiveTab("personalizado")}
                        variant="outline"
                        className="border-amber-500 text-amber-600 hover:bg-amber-50"
                      >
                        Criar Post Personalizado
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <Card
                        key={post.id}
                        className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-video w-full bg-gradient-to-br from-amber-100 to-yellow-100 relative">
                          {post.imagem_titulo ? (
                            <img
                              src={post.imagem_titulo || "/placeholder.svg"}
                              alt={post.alt_imagem_titulo || post.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Coffee className="w-16 h-16 text-amber-600 opacity-50" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                post.modo === "automático" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                              }`}
                            >
                              {post.modo}
                            </span>
                          </div>
                          <div className="absolute top-2 left-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                post.status === "publicado"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {post.status}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-800">{post.titulo}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.resumo}</p>

                          <div className="flex items-center text-xs text-gray-400 mb-3">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>

                          <div className="flex items-center text-xs text-gray-400 mb-4">
                            <Tag className="w-3 h-3 mr-1" />
                            <span className="truncate">/{post.slug}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPost(post)}
                              className="border-amber-500 text-amber-600 hover:bg-amber-50 flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" /> Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewBlogPage(post.slug)}
                              className="border-green-500 text-green-600 hover:bg-green-50 flex-1"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" /> Página
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPost(post)}
                              className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePost(post.id)}
                              className="border-red-500 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Visualização */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-800 text-xl">{selectedPost?.titulo}</DialogTitle>
              <DialogDescription className="text-gray-600">
                Criado em: {selectedPost ? formatDate(selectedPost.created_at) : ""} | Modo: {selectedPost?.modo} |
                Status: {selectedPost?.status}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {selectedPost?.imagem_titulo && (
                <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedPost.imagem_titulo || "/placeholder.svg"}
                    alt={selectedPost.alt_imagem_titulo || selectedPost.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Resumo:</h4>
                  <p className="text-gray-700">{selectedPost?.resumo}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">SEO Meta Description:</h4>
                  <p className="text-sm text-gray-600">{selectedPost?.meta_description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Keywords:</h4>
                  <p className="text-sm text-gray-600">{selectedPost?.meta_keywords}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Slug:</h4>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">/blog/{selectedPost?.slug}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
                className="border-amber-500 text-amber-600 hover:bg-amber-50"
              >
                Fechar
              </Button>
              {selectedPost && (
                <Button
                  onClick={() => viewBlogPage(selectedPost.slug)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Página
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-800">Editar Post</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-titulo" className="text-gray-700">
                    Título
                  </Label>
                  <Input
                    id="edit-titulo"
                    value={editedPost?.titulo || ""}
                    onChange={(e) => setEditedPost(editedPost ? { ...editedPost, titulo: e.target.value } : null)}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug" className="text-gray-700">
                    Slug
                  </Label>
                  <Input
                    id="edit-slug"
                    value={editedPost?.slug || ""}
                    onChange={(e) => setEditedPost(editedPost ? { ...editedPost, slug: e.target.value } : null)}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-resumo" className="text-gray-700">
                  Resumo
                </Label>
                <Textarea
                  id="edit-resumo"
                  rows={3}
                  value={editedPost?.resumo || ""}
                  onChange={(e) => setEditedPost(editedPost ? { ...editedPost, resumo: e.target.value } : null)}
                  className="border-gray-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-meta-desc" className="text-gray-700">
                    Meta Description
                  </Label>
                  <Textarea
                    id="edit-meta-desc"
                    rows={2}
                    value={editedPost?.meta_description || ""}
                    onChange={(e) =>
                      setEditedPost(editedPost ? { ...editedPost, meta_description: e.target.value } : null)
                    }
                    className="border-gray-300 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-meta-keywords" className="text-gray-700">
                    Meta Keywords
                  </Label>
                  <Textarea
                    id="edit-meta-keywords"
                    rows={2}
                    value={editedPost?.meta_keywords || ""}
                    onChange={(e) =>
                      setEditedPost(editedPost ? { ...editedPost, meta_keywords: e.target.value } : null)
                    }
                    className="border-gray-300 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-conclusao" className="text-gray-700">
                  Conclusão
                </Label>
                <Textarea
                  id="edit-conclusao"
                  rows={4}
                  value={editedPost?.conclusao || ""}
                  onChange={(e) => setEditedPost(editedPost ? { ...editedPost, conclusao: e.target.value } : null)}
                  className="border-gray-300 resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="border-amber-500 text-amber-600 hover:bg-amber-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <Coffee className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-sm text-gray-600">Café Canastra - Painel Administrativo (Supabase)</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-600 hover:bg-amber-50"
                onClick={() => window.open("https://webhook.canastrainteligencia.com", "_blank")}
              >
                Webhooks
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-600 hover:bg-amber-50"
                onClick={() => window.open("https://n8n.canastrainteligencia.com", "_blank")}
              >
                Automações
              </Button>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Help Button */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button size="icon" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-md h-12 w-12">
          <MessageCircle className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Status do Supabase */}
      <SupabaseStatus />
    </div>
  )
}
