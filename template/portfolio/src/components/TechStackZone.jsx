import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import { TECH_STACK, INTER_FONT } from '../config'

// ─── Category cluster config ──────────────────────────────────────────────────
// Positioned so the guided path (x=14-22, z=-68 to -82) passes right through.
// Items at cx=16-22 are within 0-6 units of the path at its deepest point.
const CAT_CONFIG = {
  frontend: { label: 'Frontend',  color: '#61dafb', cx: 18, cy: 2.8,  cz: -64 },
  backend:  { label: 'Backend',   color: '#86efac', cx: 20, cy: 1.2,  cz: -70 },
  database: { label: 'Database',  color: '#34d399', cx: 18, cy: -0.2, cz: -75 },
  tools:    { label: 'Tools',     color: '#fb923c', cx: 20, cy: 1.8,  cz: -80 },
  deploy:   { label: 'Deploy',    color: '#a78bfa', cx: 18, cy: -0.8, cz: -86 },
}

const ITEMS_PER_ROW = 4
const COL_GAP       = 2.05
const ROW_GAP       = 0.82

// ─── Single tech card ─────────────────────────────────────────────────────────
function TechCard({ name, color, position }) {
  const groupRef = useRef()
  const bgRef    = useRef()
  const [hovered, setHover] = useState(false)

  useFrame(() => {
    if (!groupRef.current) return
    const t = hovered ? 1.16 : 1
    groupRef.current.scale.lerp(new THREE.Vector3(t, t, 1), 0.1)
    if (bgRef.current) {
      bgRef.current.material.color.lerp(
        new THREE.Color(hovered ? color : '#0b0b1e'), 0.12
      )
    }
  })

  return (
    <Billboard position={position}>
      <group ref={groupRef}>
        {/* Card background */}
        <mesh
          ref={bgRef}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true)  }}
          onPointerOut={()  => { document.body.style.cursor = 'auto';    setHover(false) }}
        >
          <planeGeometry args={[1.82, 0.56]} />
          <meshStandardMaterial color="#0b0b1e" transparent opacity={0.9} />
        </mesh>

        {/* Left accent bar */}
        <mesh position={[-0.865, 0, 0.005]}>
          <planeGeometry args={[0.048, 0.56]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.55} />
        </mesh>

        {/* Name label */}
        <Text
          font={INTER_FONT}
          fontSize={0.145}
          color={hovered ? color : '#bbbbbb'}
          anchorX="center"
          anchorY="middle"
          position={[0.04, 0, 0.01]}
          letterSpacing={0.02}
        >
          {name}
        </Text>
      </group>
    </Billboard>
  )
}

// ─── One category block ───────────────────────────────────────────────────────
function CategoryBlock({ catKey }) {
  const cfg   = CAT_CONFIG[catKey]
  const items = TECH_STACK.filter(t => t.category === catKey)

  return (
    <group>
      {/* Category label */}
      <Billboard position={[cfg.cx, cfg.cy + 0.62, cfg.cz]}>
        <Text
          font={INTER_FONT}
          fontSize={0.19}
          color={cfg.color}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          fillOpacity={0.8}
        >
          — {cfg.label} —
        </Text>
      </Billboard>

      {/* Cards */}
      {items.map((tech, i) => {
        const row = Math.floor(i / ITEMS_PER_ROW)
        const col = i % ITEMS_PER_ROW
        const n   = Math.min(ITEMS_PER_ROW, items.length - row * ITEMS_PER_ROW)
        return (
          <TechCard
            key={tech.name}
            name={tech.name}
            color={cfg.color}
            position={[
              cfg.cx + (col - (n - 1) / 2) * COL_GAP,
              cfg.cy - row * ROW_GAP,
              cfg.cz,
            ]}
          />
        )
      })}
    </group>
  )
}

// ─── Full zone ────────────────────────────────────────────────────────────────
export default function TechStackZone() {
  return (
    <group>
      {/* Zone entrance label — visible from path point [5, 1.5, -60] */}
      <Text
        font={INTER_FONT}
        position={[14, 3.6, -60]}
        rotation={[0, 1.2, 0]}   // angled to face the incoming corridor
        fontSize={0.9}
        color="#fb923c"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        fillOpacity={0.65}
      >
        Tech Stack
      </Text>

      {Object.keys(CAT_CONFIG).map(k => (
        <CategoryBlock key={k} catKey={k} />
      ))}
    </group>
  )
}
