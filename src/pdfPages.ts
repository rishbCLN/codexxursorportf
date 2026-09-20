import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// pdf.js needs a worker. Vite resolves the bundled worker to a URL for us.
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export type RenderedPdf = {
  name: string
  pages: HTMLCanvasElement[]
}

type RenderOptions = {
  maxPages?: number
  targetWidth?: number
}

/*
  Render an uploaded PDF into an array of <canvas> elements — one per page —
  so they can be used directly as WebGL textures on the glass slabs. Pages are
  rasterised at a high-ish target width for legibility and capped so a huge PDF
  can't spawn hundreds of slabs.
*/
export async function renderPdfToCanvases(file: File, options: RenderOptions = {}): Promise<RenderedPdf> {
  const { maxPages = 12, targetWidth = 1240 } = options

  const buffer = await file.arrayBuffer()
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise

  try {
    const pageCount = Math.min(doc.numPages, maxPages)
    const pages: HTMLCanvasElement[] = []

    for (let i = 1; i <= pageCount; i++) {
      const page = await doc.getPage(i)
      const base = page.getViewport({ scale: 1 })
      const scale = targetWidth / base.width
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      const ctx = canvas.getContext('2d')
      if (!ctx) continue

      // PDFs are frequently transparent; lay down paper white first.
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      await page.render({ canvasContext: ctx, viewport }).promise
      page.cleanup()
      pages.push(canvas)
    }

    const name = file.name.replace(/\.pdf$/i, '')
    return { name, pages }
  } finally {
    doc.destroy()
  }
}
