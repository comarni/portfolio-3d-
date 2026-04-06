import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ZONES } from '../config'

// ─── Guided path keypoints ────────────────────────────────────────────────────
// The path winds through every zone; the tech-stack detour (points 7-11)
// physically brings the camera through the tech stack area (x ≈ 22).
const PATH_POINTS = [
  [0,    1.5,   8],   //  0 – Entry / hero
  [0,    1.5,   1],   //  1 – Past hero title
  [0.5,  1.5,  -8],   //  2 – 3D & Creative label
  [1.5,  1.5, -18],   //  3 – Creative panels (right)
  [-1,   1.5, -28],   //  4 – Creative panels (left)
  [1,    1.5, -38],   //  5 – Creative panels (right)
  [0,    1.5, -50],   //  6 – Creative exit
  [5,    1.5, -60],   //  7 – Start curving right
  [14,   1.5, -68],   //  8 – Entering tech stack
  [22,   1.5, -75],   //  9 – Inside tech stack (items visible)
  [14,   1.5, -82],   // 10 – Exiting tech stack
  [5,    1.5, -88],   // 11 – Back to main corridor
  [0,    1.5, -96],   // 12 – Apps & Tools label
  [1.5,  1.5, -104],  // 13 – Apps panels (right)
  [-1,   1.5, -114],  // 14 – Apps panels (left)
  [0,    1.5, -122],  // 15 – Client Work label
  [1.5,  1.5, -132],  // 16 – Client panels (right)
  [-1.5, 1.5, -145],  // 17 – Client panels (left)
  [0,    1.5, -158],  // 18 – Contact / end
].map(([x, y, z]) => new THREE.Vector3(x, y, z))

const curve = new THREE.CatmullRomCurve3(PATH_POINTS, false, 'catmullrom', 0.5)

// Total accumulated wheel-delta needed to traverse the full path
const TOTAL_SCROLL = 6000

// Find the t (0-1) on the curve closest to a world position
function nearestT(position) {
  let minDist = Infinity
  let best = 0
  for (let i = 0; i <= 300; i++) {
    const t = i / 300
    const d = curve.getPoint(t).distanceTo(position)
    if (d < minDist) { minDist = d; best = t }
  }
  return best
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CameraController() {
  const { camera, gl } = useThree()

  // Mode: 'guided' follows the scroll path; 'free' is WASD
  const mode            = useRef('guided')
  const rawProgress     = useRef(0)      // target scroll progress (0-1)
  const smoothProgress  = useRef(0)      // lerped scroll progress
  const returnTimer     = useRef(0)      // > 0 while snapping back to path

  // Look offsets applied on top of path tangent (guided) or freely (free)
  const yaw   = useRef(0)
  const pitch = useRef(0)

  // Free-roam state
  const keys      = useRef({})
  const velocity  = useRef(new THREE.Vector3())
  const dragging  = useRef(false)
  const prevMouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Initialise camera at path start
    camera.position.copy(curve.getPoint(0))

    // ── Key handlers ─────────────────────────────────────────────
    const onKeyDown = e => {
      keys.current[e.code] = true

      if (e.code === 'Space') {
        e.preventDefault()
        if (mode.current === 'guided') {
          // Enter free roam — seed yaw/pitch from current camera orientation
          const e3 = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
          yaw.current   = e3.y
          pitch.current = e3.x
          velocity.current.set(0, 0, 0)
          mode.current = 'free'
          setModeDOM('free')
        } else {
          // Return to guided — snap to nearest path point
          const t = nearestT(camera.position)
          rawProgress.current    = t
          smoothProgress.current = t
          returnTimer.current    = 1.8   // seconds of boosted lerp
          yaw.current   = 0
          pitch.current = 0
          mode.current  = 'guided'
          setModeDOM('guided')
        }
      }
    }
    const onKeyUp = e => { keys.current[e.code] = false }

    // ── Scroll ───────────────────────────────────────────────────
    const onWheel = e => {
      if (mode.current !== 'guided') return
      rawProgress.current = Math.max(0, Math.min(1,
        rawProgress.current + e.deltaY / TOTAL_SCROLL
      ))
    }

    // ── Mouse look ───────────────────────────────────────────────
    const onMouseDown = e => {
      dragging.current  = true
      prevMouse.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseUp   = () => { dragging.current = false }
    const onMouseMove = e => {
      if (!dragging.current) return
      const dx = (e.clientX - prevMouse.current.x) * 0.003
      const dy = (e.clientY - prevMouse.current.y) * 0.003
      if (mode.current === 'free') {
        yaw.current  -= dx
        pitch.current = clampPitch(pitch.current - dy)
      } else {
        // Guided: limited look offset (±60° / ±35°)
        yaw.current   = Math.max(-Math.PI / 3,  Math.min(Math.PI / 3,  yaw.current  - dx))
        pitch.current = Math.max(-Math.PI / 5,  Math.min(Math.PI / 5,  pitch.current - dy))
      }
      prevMouse.current = { x: e.clientX, y: e.clientY }
    }

    // ── Teleport buttons ─────────────────────────────────────────
    const onTeleport = e => {
      const zone = ZONES.find(z => z.key === e.detail)
      if (!zone) return
      if (mode.current === 'guided') {
        const t = nearestT(new THREE.Vector3(...zone.position))
        rawProgress.current    = t
        smoothProgress.current = t
        yaw.current   = 0
        pitch.current = 0
      } else {
        camera.position.set(...zone.position)
        velocity.current.set(0, 0, 0)
      }
    }

    window.addEventListener('keydown',  onKeyDown)
    window.addEventListener('keyup',    onKeyUp)
    window.addEventListener('wheel',    onWheel, { passive: true })
    gl.domElement.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup',  onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('portfolio:teleport', onTeleport)

    return () => {
      window.removeEventListener('keydown',  onKeyDown)
      window.removeEventListener('keyup',    onKeyUp)
      window.removeEventListener('wheel',    onWheel)
      gl.domElement.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup',  onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('portfolio:teleport', onTeleport)
    }
  }, [camera, gl])

  useFrame((_, delta) => {
    if (mode.current === 'guided') {
      // ── Guided mode ────────────────────────────────────────────
      const posLerp  = returnTimer.current > 0 ? 0.09 : 0.06
      const progLerp = returnTimer.current > 0 ? 0.09 : 0.05
      if (returnTimer.current > 0) returnTimer.current -= delta

      smoothProgress.current = THREE.MathUtils.lerp(
        smoothProgress.current, rawProgress.current, progLerp
      )
      const t       = Math.max(0.001, Math.min(0.999, smoothProgress.current))
      const pathPos = curve.getPoint(t)
      const tangent = curve.getTangent(t)

      camera.position.lerp(pathPos, posLerp)

      // Base yaw from tangent direction, plus user look offset
      const baseYaw  = Math.atan2(-tangent.x, -tangent.z)
      const euler    = new THREE.Euler(pitch.current, baseYaw + yaw.current, 0, 'YXZ')
      camera.quaternion.slerp(new THREE.Quaternion().setFromEuler(euler), 0.08)

      // Slowly decay look offset back to neutral when not dragging
      if (!dragging.current) {
        yaw.current   *= 0.96
        pitch.current *= 0.96
      }
    } else {
      // ── Free-roam mode ─────────────────────────────────────────
      const quat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
      )
      camera.quaternion.copy(quat)

      const dir = new THREE.Vector3()
      if (keys.current['KeyW'] || keys.current['ArrowUp'])    dir.z -= 1
      if (keys.current['KeyS'] || keys.current['ArrowDown'])  dir.z += 1
      if (keys.current['KeyA'] || keys.current['ArrowLeft'])  dir.x -= 1
      if (keys.current['KeyD'] || keys.current['ArrowRight']) dir.x += 1
      if (keys.current['KeyQ'])                               dir.y += 1
      if (keys.current['KeyE'])                               dir.y -= 1

      if (dir.lengthSq() > 0) {
        dir.normalize().multiplyScalar(10 * delta)
        dir.applyQuaternion(camera.quaternion)
        velocity.current.lerp(dir, 0.25)
      } else {
        velocity.current.lerp(new THREE.Vector3(), 0.12)
      }

      camera.position.add(velocity.current)
      camera.position.y = Math.max(-1, Math.min(6, camera.position.y))
    }

    // ── DOM updates ────────────────────────────────────────────────
    updateZoneDOM(camera.position)
  })

  return null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clampPitch(v) {
  return Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, v))
}

function setModeDOM(m) {
  const el = document.getElementById('nav-mode')
  if (!el) return
  el.innerText = m === 'guided' ? 'GUIDED' : 'FREE ROAM'
  el.style.color = m === 'guided' ? '#4ade80' : '#fb923c'
}

function updateZoneDOM({ x, z }) {
  let zone = 'Entry'
  if (x > 10)        zone = 'Tech Stack'
  else if (z < -103) zone = 'Client Work'
  else if (z < -53)  zone = 'Apps & Tools'
  else if (z < -5)   zone = '3D & Creative'
  const el = document.getElementById('current-zone')
  if (el && el.innerText !== zone) el.innerText = zone
}
