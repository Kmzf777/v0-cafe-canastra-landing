import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug, getRecentPosts } from "@/lib/supabase"
import ClientBlogPostPage from "./ClientBlogPostPage"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post não encontrado | Blog Café Canastra",
      description: "O post que você está procurando não foi encontrado.",
      openGraph: {
        title: "Post não encontrado | Blog Café Canastra",
        description: "O post que você está procurando não foi encontrado.",
        url: `https://cafecanastra.com/blog/${slug}`,
        type: "article",
        images: [
          {
            url: "/placeholder.svg?height=630&width=1200&text=Café+Canastra",
            width: 1200,
            height: 630,
            alt: "Café Canastra",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Post não encontrado | Blog Café Canastra",
        description: "O post que você está procurando não foi encontrado.",
        images: ["/placeholder.svg?height=630&width=1200&text=Café+Canastra"],
      },
    }
  }

  return {
    title: post.title || `${post.titulo} | Blog Café Canastra`,
    description: post.meta_description || post.resumo || "Descubra os segredos do café especial da Serra da Canastra.",
    keywords: post.meta_keywords || "café especial, serra da canastra, café brasileiro",
    authors: [{ name: "Equipe Café Canastra" }],
    robots: "index, follow",
    openGraph: {
      title: post.og_title || post.titulo || "Blog Café Canastra",
      description: post.og_description || post.resumo || "Descubra os segredos do café especial da Serra da Canastra.",
      url: post.og_url || `https://cafecanastra.com/blog/${slug}`,
      type: "article",
      publishedTime: post.created_at,
      authors: ["Equipe Café Canastra"],
      siteName: "Café Canastra",
      locale: "pt_BR",
      images: [
        {
          url: post.imagem_titulo || "/placeholder.svg?height=630&width=1200&text=Café+Canastra+Blog",
          width: 1200,
          height: 630,
          alt: post.alt_imagem_titulo || post.titulo || "Blog Café Canastra",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@cafecanastra",
      creator: "@cafecanastra",
      title: post.twitter_title || post.titulo || "Blog Café Canastra",
      description:
        post.twitter_description || post.resumo || "Descubra os segredos do café especial da Serra da Canastra.",
      images: [post.imagem_titulo || "/placeholder.svg?height=630&width=1200&text=Café+Canastra+Blog"],
    },
    alternates: {
      canonical: post.og_url || `https://cafecanastra.com/blog/${slug}`,
    },
    other: {
      "article:author": "Equipe Café Canastra",
      "article:published_time": post.created_at,
      "article:modified_time": post.updated_at,
      "article:section": "Blog",
      "article:tag": post.meta_keywords || "café especial, serra da canastra",
    },
  }
}

export async function generateStaticParams() {
  return []
}

export const dynamicParams = true

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, recentPosts] = await Promise.all([getPostBySlug(slug), getRecentPosts(5)])

  if (!post) {
    notFound()
  }

  // Filtrar posts relacionados (excluindo o atual)
  const relatedPosts = recentPosts.filter((p) => p.id !== post.id).slice(0, 4)

  return (
    <>
      {/* Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.titulo,
            description: post.resumo || "Descubra os segredos do café especial da Serra da Canastra.",
            image: post.imagem_titulo || "/placeholder.svg?height=630&width=1200&text=Café+Canastra+Blog",
            author: {
              "@type": "Organization",
              name: "Café Canastra",
              url: "https://cafecanastra.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Café Canastra",
              logo: {
                "@type": "ImageObject",
                url: "https://cafecanastra.com/logo-canastra.png",
              },
            },
            datePublished: post.created_at,
            dateModified: post.updated_at,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": post.og_url || `https://cafecanastra.com/blog/${slug}`,
            },
          }),
        }}
      />

      <ClientBlogPostPage post={post} relatedPosts={relatedPosts} />
    </>
  )
}
