import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Café Canastra - Torrefação sob medida com a sua marca",
  description:
    "Você cuida da marca. A gente entrega o sabor que conquista corações. Café 100% Arábica da Serra da Canastra com design personalizado."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const enableGtm = process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_ENABLE_GTM === "true"
  return (
    <html lang="pt-BR">
      <head>
        {enableGtm && (
          <>
            {/* Google Tag Manager */}
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PX8PWW6');`,
              }}
            />
            {/* End Google Tag Manager */}
          </>
        )}
      </head>
      <body className={inter.className}>
        {enableGtm && (
          <>
            {/* Google Tag Manager (noscript) */}
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-PX8PWW6"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
            {/* End Google Tag Manager (noscript) */}
          </>
        )}
        {children}
      </body>
    </html>
  )
}
