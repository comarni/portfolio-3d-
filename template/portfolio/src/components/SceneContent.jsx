import { useState } from 'react'
import { Float, Text } from '@react-three/drei'

import CameraController from './CameraController'
import ProjectsZone     from './ProjectsZone'
import TechStackZone    from './TechStackZone'
import BlissEnvironment from './BlissEnvironment'
import FolderIcon       from './FolderIcon'
import { PROJECTS, OWNER_NAME, CONTACT_LABEL, INTER_FONT } from '../config'

// ── Folder definitions ────────────────────────────────────────────────────────
// position: where the folder icon sits on the grass
// labelPos / startZ: passed to ProjectsZone for panel layout
const FOLDERS = [
  {
    key:      'creative',
    label:    '3D & Creative',
    color:    '#a78bfa',
    position: [-3.5, -1.8, -11],
    labelPos: [-0.5, 3.2, -10],
    startZ:   -15,
  },
  {
    key:      'apps',
    label:    'Apps & Tools',
    color:    '#38bdf8',
    position: [4, -1.8, -57],
    labelPos: [0.5, 3.2, -57],
    startZ:   -62,
  },
  {
    key:      'clients',
    label:    'Client Work',
    color:    '#4ade80',
    position: [-3.5, -1.8, -107],
    labelPos: [-0.5, 3.2, -106],
    startZ:   -112,
  },
]

export default function SceneContent() {
  const [open, setOpen] = useState({ creative: false, apps: false, clients: false })
  const toggle = key => setOpen(prev => ({ ...prev, [key]: !prev[key] }))

  const byCategory = {
    creative: PROJECTS.filter(p => p.category === 'creative'),
    apps:     PROJECTS.filter(p => p.category === 'apps'),
    clients:  PROJECTS.filter(p => p.category === 'clients'),
  }

  return (
    <>
      <CameraController />
      <BlissEnvironment />

      {/* ── Hero title ───────────────────────────────────────── */}
      <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.18}>
        <Text
          font={INTER_FONT}
          fontSize={0.75}
          letterSpacing={-0.04}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[0, 1.6, 2]}
          outlineWidth={0.015}
          outlineColor="#00000055"
        >
          {OWNER_NAME}
        </Text>
      </Float>
      <Text
        font={INTER_FONT}
        fontSize={0.13}
        letterSpacing={0.2}
        color="#eeeeee"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.9, 2]}
        outlineWidth={0.012}
        outlineColor="#00000055"
      >
        CREATIVE TECHNOLOGIST · FULL STACK DEVELOPER
      </Text>

      {/* ── Folder icons on the grass ────────────────────────── */}
      {FOLDERS.map(f => (
        <FolderIcon
          key={f.key}
          label={f.label}
          color={f.color}
          position={f.position}
          isOpen={open[f.key]}
          onToggle={() => toggle(f.key)}
        />
      ))}

      {/* ── Project panels — only visible when folder is open ── */}
      {FOLDERS.map(f => open[f.key] && (
        <ProjectsZone
          key={f.key}
          label={f.label}
          color={f.color}
          projects={byCategory[f.key]}
          labelPosition={f.labelPos}
          startZ={f.startZ}
        />
      ))}

      {/* ── Tech Stack zone (always visible, off to the right) ─ */}
      <TechStackZone />

      {/* ── End-of-scene contact label ───────────────────────── */}
      <Text
        font={INTER_FONT}
        position={[0, 0.5, -160]}
        fontSize={0.55}
        letterSpacing={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#00000066"
      >
        {CONTACT_LABEL}
      </Text>
    </>
  )
}
