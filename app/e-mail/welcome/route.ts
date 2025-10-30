import fs from "fs"
import path from "path"

export async function GET() {
  const filePath = path.join(process.cwd(), "e-mail", "welcome.html")
  try {
    const html = fs.readFileSync(filePath, "utf-8")
    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    return new Response("Arquivo de e-mail não encontrado.", { status: 404 })
  }
}