/**
 * fetch-screenshots.mjs
 * Toma capturas de pantalla de todos los proyectos con Puppeteer (Chrome headless)
 * y las guarda en public/screenshots/ como archivos estáticos.
 *
 * Uso: node scripts/fetch-screenshots.mjs
 */
import puppeteer from 'puppeteer'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR   = join(__dirname, '../public/screenshots')

const PROJECTS = [
  { name: '3D-Keyboard',            url: 'https://comarni.github.io/3D-Keyboard/' },
  { name: 'atmos-experience-clone', url: 'https://comarni.github.io/atmos-experience-clone/' },
  { name: 'bmw-showcase-site',      url: 'https://comarni.github.io/bmw-showcase-site/' },
  { name: 'DisasterSim-Analytics',  url: 'https://comarni.github.io/DisasterSim-Analytics./' },
  { name: 'Ignite',                 url: 'https://comarni.github.io/Ignite/' },
  { name: 'Komarn-IA',              url: 'https://comarni.github.io/Komarn.IA/' },
  { name: 'renderHub',              url: 'https://comarni.github.io/renderHub/' },
  { name: 'RenderHub-V2',           url: 'https://comarni.github.io/RenderHub-V2/' },
  { name: 'ruleta3D',               url: 'https://comarni.github.io/ruleta3D/' },
  { name: 'threejs-prueba',         url: 'https://comarni.github.io/threejs-prueba/' },
  { name: 'void',                   url: 'https://comarni.github.io/void/' },
  { name: 'CarHub',                 url: 'https://comarni.github.io/CarHub/' },
  { name: 'ChessHub',               url: 'https://comarni.github.io/ChessHub/' },
  { name: 'Conversor-de-divisas',   url: 'https://comarni.github.io/Conversor-de-divisas/' },
  { name: 'conversor-de-texto',     url: 'https://comarni.github.io/conversor-de-texto/' },
  { name: 'generador-gradiente-css',url: 'https://comarni.github.io/generador-gradiente-css/' },
  { name: 'LanhHub',                url: 'https://comarni.github.io/LanhHub/' },
  { name: 'montecar',               url: 'https://comarni.github.io/montecar/' },
  { name: 'parque-de-atracciones',  url: 'https://comarni.github.io/parque-de-atracciones/' },
  { name: 'PinPanPun',              url: 'https://comarni.github.io/PinPanPun/' },
  { name: 'PokerHub',               url: 'https://comarni.github.io/PokerHub/' },
  { name: 'TypeHub',                url: 'https://comarni.github.io/TypeHub/' },
  { name: 'webhub',                 url: 'https://comarni.github.io/webhub/' },
  { name: 'de-Melani',              url: 'https://comarni.github.io/de-Melani/' },
  { name: 'DreamsCoffee',           url: 'https://comarni.github.io/DreamsCoffee/' },
  { name: 'El-Rincon-del-Tapeo-II', url: 'https://comarni.github.io/El-Rincon-del-Tapeo-II/' },
  { name: 'ElRinconDeMamaInes',     url: 'https://comarni.github.io/ElRinconDeMamaInes/' },
  { name: 'El_rincon_de_mama_ines', url: 'https://comarni.github.io/El_rincon_de_mama_ines/' },
  { name: 'Op1Ramiro',              url: 'https://comarni.github.io/Op1Ramiro/' },
  { name: 'op2Ramiro',              url: 'https://comarni.github.io/op2Ramiro/' },
  { name: 'op3Ramiro',              url: 'https://comarni.github.io/op3Ramiro/' },
  { name: 'pasteleriaBalaguer',     url: 'https://comarni.github.io/pasteleriaBalaguer/' },
  { name: 'pikolin',                url: 'https://comarni.github.io/pikolin/' },
  { name: 'portfolio',              url: 'https://comarni.github.io/portfolio/' },
  { name: 'Prech-T-Star-Bar',       url: 'https://comarni.github.io/Prech-T-Star-Bar/' },
  { name: 'Ramiro',                 url: 'https://comarni.github.io/Ramiro/' },
  { name: 'valdelasfuentes',        url: 'https://comarni.github.io/valdelasfuentes/' },
]

mkdirSync(OUT_DIR, { recursive: true })

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

let ok = 0, failed = 0

for (const project of PROJECTS) {
  const outPath = join(OUT_DIR, project.name + '.jpg')

  if (existsSync(outPath)) {
    console.log(`⏭  skip  ${project.name}`)
    ok++
    continue
  }

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  try {
    await page.goto(project.url, { waitUntil: 'networkidle2', timeout: 20000 })
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 85 })
    const stat = (await import('fs')).statSync(outPath)
    console.log(`✓  ${project.name}  (${(stat.size/1024).toFixed(0)} KB)`)
    ok++
  } catch (err) {
    console.error(`✗  ${project.name}  →  ${err.message.split('\n')[0]}`)
    failed++
  } finally {
    await page.close()
  }
}

await browser.close()
console.log(`\nDone: ${ok} OK, ${failed} failed`)
console.log(`Screenshots en: ${OUT_DIR}`)
