import React, { useRef, useState } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { INTER_FONT } from '../config'

/**
 * 3D Windows-XP-style folder icon sitting on the grass.
 * Click to open/close — parent controls `isOpen` state.
 */
export default function FolderIcon({ label, color, isOpen, onToggle, position = [0, 0, 0] }) {
  const [hovered, setHovered] = useState(false)
  const floatRef = useRef()

  useFrame(({ clock }) => {
    if (floatRef.current) {
      const t = clock.elapsedTime
      floatRef.current.position.y = Math.sin(t * 1.1) * (isOpen ? 0.12 : 0.06)
    }
  })

  const bodyColor  = isOpen ? '#ffe066' : (hovered ? '#f8d050' : '#f0c030')
  const frontColor = isOpen ? '#fff0a0' : (hovered ? '#ffe87a' : '#fdd835')

  return (
    <group position={position}>
      <group ref={floatRef}>

        {/* ── Folder back ── */}
        <mesh position={[0, 0.85, -0.06]}>
          <boxGeometry args={[2.1, 1.6, 0.1]} />
          <meshStandardMaterial color={bodyColor} roughness={0.55} />
        </mesh>

        {/* ── Tab (top-left corner) ── */}
        <mesh position={[-0.58, 1.73, -0.06]}>
          <boxGeometry args={[0.82, 0.30, 0.1]} />
          <meshStandardMaterial color={bodyColor} roughness={0.55} />
        </mesh>

        {/* ── Front face (slightly lighter) ── */}
        <mesh
          position={[0, 0.75, 0.06]}
          onClick={(e) => { e.stopPropagation(); onToggle() }}
          onPointerOver={() => { setHovered(true);  document.body.style.cursor = 'pointer' }}
          onPointerOut={()  => { setHovered(false); document.body.style.cursor = 'default' }}
        >
          <boxGeometry args={[2.1, 1.4, 0.1]} />
          <meshStandardMaterial color={frontColor} roughness={0.45} />
        </mesh>

        {/* ── Category color stripe ── */}
        <mesh position={[0, 1.28, 0.12]}>
          <boxGeometry args={[2.1, 0.07, 0.01]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.0} />
        </mesh>

        {/* ── Bottom shadow line ── */}
        <mesh position={[0, 0.07, 0.12]}>
          <boxGeometry args={[2.1, 0.04, 0.01]} />
          <meshStandardMaterial color="#c8940a" />
        </mesh>

        {/* ── Open arrow indicator ── */}
        {isOpen && (
          <mesh position={[0, 1.95, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.13, 0.28, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
          </mesh>
        )}
      </group>

      {/* ── Label below ── */}
      <Text
        font={INTER_FONT}
        position={[0, -0.2, 0.14]}
        fontSize={0.22}
        color={isOpen ? color : '#ffffff'}
        anchorX="center"
        anchorY="top"
        letterSpacing={0.05}
        outlineWidth={0.028}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* ── Hint text ── */}
      <Text
        font={INTER_FONT}
        position={[0, 2.05, 0.14]}
        fontSize={0.13}
        color={isOpen ? color : '#aaaaaa'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.018}
        outlineColor="#000000"
      >
        {isOpen ? '▼  OPEN' : '▶  CLICK TO OPEN'}
      </Text>
    </group>
  )
}
