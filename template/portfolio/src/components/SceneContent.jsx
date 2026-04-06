import React from 'react'
import { Float, Text, Sparkles } from '@react-three/drei'

import CameraController    from './CameraController'
import ProjectsZone        from './ProjectsZone'
import TechStackZone       from './TechStackZone'
import GaussianBackground  from './GaussianBackground'
import { PROJECTS, OWNER_NAME, CONTACT_LABEL, INTER_FONT } from '../config'

// ── Activa el entorno Gaussian Splat cuando bliss.splat esté en public/ ──────
const GAUSSIAN_ENABLED = false // ← cámbialo a true después de generar el splat

/**
 * Root scene graph.
 *
 * World layout (Z axis is depth, X is left/right):
 *
 *   z=+8   Camera start
 *   z= 0   Hero title
 *   z=-12  3D & Creative zone  (11 panels, z -12 → -49)
 *   z=-60  Apps & Tools zone   (12 panels, z -60 → -98)
 *   z=-110 Client Work zone    (14 panels, z -110 → -155)
 *
 *   x=+30  Tech Stack zone     (z -60 → -90, to the right)
 */
export default function SceneContent() {
  const creative = PROJECTS.filter(p => p.category === 'creative')
  const apps     = PROJECTS.filter(p => p.category === 'apps')
  const clients  = PROJECTS.filter(p => p.category === 'clients')

  return (
    <>
      <CameraController />

      {/* ── Entorno Gaussian Splat (activar tras generar bliss.splat) ─── */}
      {GAUSSIAN_ENABLED && (
        <GaussianBackground
          url="/bliss.splat"
          scale={1}
          position={[0, -2, -10]}
          opacity={1}
        />
      )}

      {/* ── Hero ───────────────────────────────────────────────── */}
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
        <Text
          font={INTER_FONT}
          fontSize={0.75}
          letterSpacing={-0.04}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[0, 1.6, 2]}
        >
          {OWNER_NAME}
        </Text>
      </Float>
      <Text
        font={INTER_FONT}
        fontSize={0.13}
        letterSpacing={0.2}
        color="#555555"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.95, 2]}
      >
        CREATIVE TECHNOLOGIST · FULL STACK DEVELOPER
      </Text>

      {/* ── Subtle ground grid (orientation reference) ─────────── */}
      <gridHelper args={[300, 60, '#1a1a1a', '#111111']} position={[0, -2, -80]} />

      {/* ── Project zones ──────────────────────────────────────── */}
      <ProjectsZone
        label="3D & Creative"
        color="#a78bfa"
        projects={creative}
        labelPosition={[0, 2.8, -8]}
        startZ={-14}
      />
      <ProjectsZone
        label="Apps & Tools"
        color="#38bdf8"
        projects={apps}
        labelPosition={[0, 2.8, -56]}
        startZ={-62}
      />
      <ProjectsZone
        label="Client Work"
        color="#4ade80"
        projects={clients}
        labelPosition={[0, 2.8, -106]}
        startZ={-112}
      />

      {/* ── Tech Stack zone (to the right) ─────────────────────── */}
      <TechStackZone />

      {/* ── Ambient sparkles across the full scene ─────────────── */}
      <Sparkles
        count={350}
        scale={[25, 12, 170]}
        size={2}
        speed={0.25}
        opacity={0.18}
        color="#ffffff"
        position={[5, 0, -85]}
      />

      {/* ── End-of-scene contact label ──────────────────────────── */}
      <Text
        font={INTER_FONT}
        position={[0, 0.5, -160]}
        fontSize={0.55}
        letterSpacing={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {CONTACT_LABEL}
      </Text>
    </>
  )
}
