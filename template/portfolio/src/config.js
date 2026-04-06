// ─── Portfolio Configuration ─────────────────────────────────────────────────

export const OWNER_NAME    = 'Marco Von Fürstenberg'
export const OWNER_TITLE   = 'Creative Technologist'
export const CONTACT_LABEL = 'GET IN TOUCH'

export const INTER_FONT =
  'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff'

// ─── 3D Space Zones ──────────────────────────────────────────────────────────
// position = where the camera teleports to
export const ZONES = [
  { key: 'entry',    label: 'Entry',          color: '#ffffff', position: [0,  1.5,  8]  },
  { key: 'creative', label: '3D & Creative',  color: '#a78bfa', position: [0,  1.5, -5]  },
  { key: 'apps',     label: 'Apps & Tools',   color: '#38bdf8', position: [0,  1.5, -53] },
  { key: 'clients',  label: 'Client Work',    color: '#4ade80', position: [0,  1.5, -103] },
  { key: 'tech',     label: 'Tech Stack',     color: '#fb923c', position: [20, 1.5, -74] },
]

// ─── Projects ─────────────────────────────────────────────────────────────────
// category: 'creative' | 'apps' | 'clients'
export const PROJECTS = [
  // ── 3D & Creative ──
  { category: 'creative', name: '3D-Keyboard',            url: 'https://comarni.github.io/3D-Keyboard/' },
  { category: 'creative', name: 'atmos-experience-clone', url: 'https://comarni.github.io/atmos-experience-clone/' },
  { category: 'creative', name: 'bmw-showcase-site',      url: 'https://comarni.github.io/bmw-showcase-site/' },
  { category: 'creative', name: 'DisasterSim-Analytics',  url: 'https://comarni.github.io/DisasterSim-Analytics./' },
  { category: 'creative', name: 'Ignite',                 url: 'https://comarni.github.io/Ignite/' },
  { category: 'creative', name: 'Komarn.IA',              url: 'https://comarni.github.io/Komarn.IA/' },
  { category: 'creative', name: 'renderHub',              url: 'https://comarni.github.io/renderHub/' },
  { category: 'creative', name: 'RenderHub-V2',           url: 'https://comarni.github.io/RenderHub-V2/' },
  { category: 'creative', name: 'ruleta3D',               url: 'https://comarni.github.io/ruleta3D/' },
  { category: 'creative', name: 'threejs-prueba',         url: 'https://comarni.github.io/threejs-prueba/' },
  { category: 'creative', name: 'void',                   url: 'https://comarni.github.io/void/' },

  // ── Apps & Tools ──
  { category: 'apps', name: 'CarHub',                  url: 'https://comarni.github.io/CarHub/' },
  { category: 'apps', name: 'ChessHub',                url: 'https://comarni.github.io/ChessHub/' },
  { category: 'apps', name: 'Conversor-de-divisas',    url: 'https://comarni.github.io/Conversor-de-divisas/' },
  { category: 'apps', name: 'conversor-de-texto',      url: 'https://comarni.github.io/conversor-de-texto/' },
  { category: 'apps', name: 'generador-gradiente-css', url: 'https://comarni.github.io/generador-gradiente-css/' },
  { category: 'apps', name: 'LanhHub',                 url: 'https://comarni.github.io/LanhHub/' },
  { category: 'apps', name: 'montecar',                url: 'https://comarni.github.io/montecar/' },
  { category: 'apps', name: 'parque-de-atracciones',   url: 'https://comarni.github.io/parque-de-atracciones/' },
  { category: 'apps', name: 'PinPanPun',               url: 'https://comarni.github.io/PinPanPun/' },
  { category: 'apps', name: 'PokerHub',                url: 'https://comarni.github.io/PokerHub/' },
  { category: 'apps', name: 'TypeHub',                 url: 'https://comarni.github.io/TypeHub/' },
  { category: 'apps', name: 'webhub',                  url: 'https://comarni.github.io/webhub/' },

  // ── Client Work ──
  { category: 'clients', name: 'de-Melani',              url: 'https://comarni.github.io/de-Melani/' },
  { category: 'clients', name: 'DreamsCoffee',           url: 'https://comarni.github.io/DreamsCoffee/' },
  { category: 'clients', name: 'El-Rincon-del-Tapeo-II', url: 'https://comarni.github.io/El-Rincon-del-Tapeo-II/' },
  { category: 'clients', name: 'ElRinconDeMamaInes',     url: 'https://comarni.github.io/ElRinconDeMamaInes/' },
  { category: 'clients', name: 'El_rincon_de_mama_ines', url: 'https://comarni.github.io/El_rincon_de_mama_ines/' },
  { category: 'clients', name: 'Op1Ramiro',              url: 'https://comarni.github.io/Op1Ramiro/' },
  { category: 'clients', name: 'op2Ramiro',              url: 'https://comarni.github.io/op2Ramiro/' },
  { category: 'clients', name: 'op3Ramiro',              url: 'https://comarni.github.io/op3Ramiro/' },
  { category: 'clients', name: 'pasteleriaBalaguer',     url: 'https://comarni.github.io/pasteleriaBalaguer/' },
  { category: 'clients', name: 'pikolin',                url: 'https://comarni.github.io/pikolin/' },
  { category: 'clients', name: 'portfolio',              url: 'https://comarni.github.io/portfolio/' },
  { category: 'clients', name: 'Prech-T-Star-Bar',       url: 'https://comarni.github.io/Prech-T-Star-Bar/' },
  { category: 'clients', name: 'Ramiro',                 url: 'https://comarni.github.io/Ramiro/' },
  { category: 'clients', name: 'valdelasfuentes',        url: 'https://comarni.github.io/valdelasfuentes/' },
]

// ─── Tech Stack ───────────────────────────────────────────────────────────────
export const TECH_STACK = [
  // Frontend
  { name: 'HTML5',       category: 'frontend', color: '#e34f26' },
  { name: 'CSS3',        category: 'frontend', color: '#1572b6' },
  { name: 'JavaScript',  category: 'frontend', color: '#f7df1e' },
  { name: 'TypeScript',  category: 'frontend', color: '#3178c6' },
  { name: 'React',       category: 'frontend', color: '#61dafb' },
  { name: 'Three.js',    category: 'frontend', color: '#ffffff' },
  { name: 'R3F',         category: 'frontend', color: '#ff6b6b' },
  { name: 'Tailwind',    category: 'frontend', color: '#06b6d4' },
  { name: 'GSAP',        category: 'frontend', color: '#88ce02' },
  // Backend
  { name: 'Node.js',     category: 'backend',  color: '#339933' },
  { name: 'Express',     category: 'backend',  color: '#cccccc' },
  { name: 'Python',      category: 'backend',  color: '#3776ab' },
  { name: 'REST APIs',   category: 'backend',  color: '#ff6c37' },
  // Database
  { name: 'MongoDB',     category: 'database', color: '#47a248' },
  { name: 'PostgreSQL',  category: 'database', color: '#336791' },
  { name: 'Supabase',    category: 'database', color: '#3ecf8e' },
  { name: 'Firebase',    category: 'database', color: '#ffca28' },
  // Tools
  { name: 'Git',         category: 'tools',    color: '#f05032' },
  { name: 'GitHub',      category: 'tools',    color: '#cccccc' },
  { name: 'Docker',      category: 'tools',    color: '#2496ed' },
  { name: 'Figma',       category: 'tools',    color: '#f24e1e' },
  { name: 'Blender',     category: 'tools',    color: '#f5792a' },
  { name: 'n8n',         category: 'tools',    color: '#ea4b71' },
  { name: 'Claude API',  category: 'tools',    color: '#d97706' },
  { name: 'Vite',        category: 'tools',    color: '#646cff' },
  // Deploy
  { name: 'GitHub Pages', category: 'deploy',  color: '#cccccc' },
  { name: 'Vercel',       category: 'deploy',  color: '#cccccc' },
  { name: 'Netlify',      category: 'deploy',  color: '#00c7b7' },
]
