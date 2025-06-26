import { type NextRequest, NextResponse } from "next/server"
import { saveBlogPost } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("=== WEBHOOK BLOG RECEBIDO ===")

    const body = await request.json()
    console.log("Body recebido:", JSON.stringify(body, null, 2))

    // Verificar se é um array de posts ou um objeto de configuração
    let postsToProcess = []
    let modo = "automático"

    if (Array.isArray(body)) {
      // Formato antigo: array de posts
      postsToProcess = body
    } else if (body.modo) {
      // Formato novo: objeto de configuração
      modo = body.modo

      if (body.posts && Array.isArray(body.posts)) {
        postsToProcess = body.posts
      } else {
        // Se não há posts no body, simular criação baseada nos parâmetros
        console.log("Simulando criação de posts baseado nos parâmetros:", body)

        if (modo === "automático") {
          const quantidade = body.quantidade || 1
          for (let i = 0; i < quantidade; i++) {
            postsToProcess.push({
              titulo: `Post Automático ${i + 1} - ${new Date().toLocaleDateString("pt-BR")}`,
              resumo: `Este é um post gerado automaticamente pelo sistema em ${new Date().toLocaleString("pt-BR")}.`,
              "seção 1 titulo": "Introdução",
              "seção 1 texto": "Este é o conteúdo da primeira seção do post automático.",
              "seção 2 titulo": "Desenvolvimento",
              "seção 2 texto": "Aqui temos o desenvolvimento do tema abordado no post.",
              Conclusão: "Esta é a conclusão do post gerado automaticamente.",
              'meta name="description"': `Post automático ${i + 1} sobre café especial da Serra da Canastra.`,
              'meta name="keywords"': "café especial, serra da canastra, café brasileiro, automático",
              "<title>": `Post Automático ${i + 1} | Blog Café Canastra`,
            })
          }
        } else if (modo === "personalizado") {
          const tema = body.tema || "Café Especial"
          const publicoAlvo = body.publico_alvo || "Apreciadores de café"

          postsToProcess.push({
            titulo: `${tema} - Post Personalizado`,
            resumo: `Post personalizado sobre ${tema} direcionado para ${publicoAlvo}.`,
            "seção 1 titulo": "Sobre o Tema",
            "seção 1 texto": `Neste post, vamos explorar o tema: ${tema}.`,
            "seção 2 titulo": "Para Quem é Este Conteúdo",
            "seção 2 texto": `Este conteúdo é especialmente direcionado para: ${publicoAlvo}.`,
            Conclusão: `Esperamos que este post sobre ${tema} tenha sido útil para ${publicoAlvo}.`,
            'meta name="description"': `Post personalizado sobre ${tema} para ${publicoAlvo}.`,
            'meta name="keywords"': `${tema.toLowerCase()}, café especial, serra da canastra`,
            "<title>": `${tema} | Blog Café Canastra`,
          })
        }
      }
    } else {
      // Formato desconhecido
      console.log("Formato de body não reconhecido, tratando como post único")
      postsToProcess = [body]
    }

    console.log(`Processando ${postsToProcess.length} post(s) no modo: ${modo}`)

    // Processar cada post
    const results = []
    const savedPosts = []
    let createdPosts = 0

    for (const [index, postData] of postsToProcess.entries()) {
      try {
        console.log(`\n--- Processando post ${index + 1}/${postsToProcess.length} ---`)
        console.log("Dados do post:", postData)

        // Salvar no Supabase
        const savedPost = await saveBlogPost(postData, modo)

        if (savedPost) {
          console.log(`✅ Post ${index + 1} salvo com sucesso:`, savedPost.titulo)
          savedPosts.push(savedPost)
          createdPosts++
          results.push({
            success: true,
            post: savedPost.titulo,
            slug: savedPost.slug,
            id: savedPost.id,
          })
        } else {
          console.log(`❌ Falha ao salvar post ${index + 1}`)
          results.push({
            success: false,
            error: "Falha ao salvar no Supabase",
            postData: postData.titulo || "Sem título",
          })
        }

        // Atraso entre posts (se especificado)
        if (body.atraso && index < postsToProcess.length - 1) {
          console.log(`Aguardando ${body.atraso}ms antes do próximo post...`)
          await new Promise((resolve) => setTimeout(resolve, body.atraso))
        }
      } catch (error) {
        console.error(`Erro ao processar post ${index + 1}:`, error)
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
          postData: postData.titulo || "Sem título",
        })
      }
    }

    console.log("\n=== RESUMO DO PROCESSAMENTO ===")
    console.log(`Posts processados: ${postsToProcess.length}`)
    console.log(`Posts criados com sucesso: ${createdPosts}`)
    console.log(`Posts salvos no Supabase: ${savedPosts.length}`)

    return NextResponse.json({
      success: true,
      message: `Webhook processado com sucesso. ${createdPosts} post(s) criado(s).`,
      webhookResults: results,
      createdPosts: createdPosts,
      savedPosts: savedPosts.length,
      modo: modo,
      processedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Webhook do blog está funcionando",
    endpoint: "/api/blog-webhook",
    methods: ["POST"],
    timestamp: new Date().toISOString(),
  })
}
