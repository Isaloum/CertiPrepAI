/**
 * prerender.mjs — build-time per-route <head> injection
 *
 * Runs AFTER `vite build`. For each public route in route-meta.json it writes
 * dist/<route>/index.html with route-correct <title>, description, og:*,
 * twitter:* and canonical tags — so non-JS crawlers and link-preview bots
 * (LinkedIn, Slack, X, Google's first pass) see the right metadata per URL
 * instead of the homepage shell on every page.
 *
 * Pure Node, zero dependencies, runs in ~milliseconds. The SPA's SEOMeta.tsx
 * still overwrites these at runtime in the browser — this only fixes what
 * crawlers see before JS executes.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const shellPath = join(distDir, 'index.html')

const { base, ogImage, routes } = JSON.parse(
  readFileSync(join(__dirname, 'route-meta.json'), 'utf8'),
)

if (!existsSync(shellPath)) {
  console.error('[prerender] dist/index.html not found — run vite build first.')
  process.exit(1)
}
const shell = readFileSync(shellPath, 'utf8')

// Escape for use inside an HTML attribute value (content="...").
const attr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Escape for use as element text (<title>...</title>).
const text = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function renderHead(html, route, meta) {
  const url = route === '/' ? `${base}/` : `${base}${route}`
  const t = meta.title
  const d = meta.description

  let out = html

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${text(t)}</title>`)

  // <meta name="description">
  out = out.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="description" content="${attr(d)}" />`,
  )

  // Open Graph
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:url" content="${attr(url)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:title" content="${attr(t)}" />`,
  )
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta property="og:description" content="${attr(d)}" />`,
  )

  // Twitter
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:title" content="${attr(t)}" />`,
  )
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta name="twitter:description" content="${attr(d)}" />`,
  )

  // Canonical — inject before </head> (index.html ships without one)
  out = out.replace(
    /\s*<\/head>/,
    `\n    <link rel="canonical" href="${attr(url)}" />\n  </head>`,
  )

  return out
}

let count = 0
for (const [route, meta] of Object.entries(routes)) {
  const html = renderHead(shell, route, meta)
  const outPath =
    route === '/' ? shellPath : join(distDir, route.replace(/^\//, ''), 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  count++
  console.log(`[prerender] ${route} -> ${outPath.replace(distDir, 'dist')}`)
}
console.log(`[prerender] wrote ${count} route(s).`)
