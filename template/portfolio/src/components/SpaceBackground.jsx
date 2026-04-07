import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

// ── Estrella field ────────────────────────────────────────────────────────────
function Stars({ count = 2000 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Distribute in a large shell around the scene
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 180 + Math.random() * 120
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  const sizes = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = 0.5 + Math.random() * 2.5
    return arr
  }, [count])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('size',     new THREE.BufferAttribute(sizes, 1))
    return g
  }, [positions, sizes])

  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.9}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}

// ── Planeta individual ────────────────────────────────────────────────────────
function Planet({ radius, color, emissive, emissiveIntensity = 0, position, orbitSpeed = 0, orbitCenter = [0,0,0], orbitRadius = 0, rings = false }) {
  const ref = useRef()
  const angle = useRef(Math.random() * Math.PI * 2)

  useFrame((_, delta) => {
    if (!ref.current) return
    if (orbitRadius > 0) {
      angle.current += orbitSpeed * delta
      ref.current.position.x = orbitCenter[0] + Math.cos(angle.current) * orbitRadius
      ref.current.position.z = orbitCenter[2] + Math.sin(angle.current) * orbitRadius * 0.4
    }
    ref.current.rotation.y += delta * 0.05
  })

  return (
    <group ref={ref} position={position}>
      <Sphere args={[radius, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={emissive || color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.85}
          metalness={0.05}
        />
      </Sphere>
      {rings && (
        <mesh rotation={[Math.PI / 2.4, 0, 0.3]}>
          <torusGeometry args={[radius * 1.7, radius * 0.22, 2, 80]} />
          <meshStandardMaterial color="#c8a96e" transparent opacity={0.45} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

// ── Sol ───────────────────────────────────────────────────────────────────────
function Sun({ position }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02
  })

  return (
    <group position={position}>
      {/* Glow corona */}
      <Sphere args={[12, 32, 32]}>
        <meshBasicMaterial color="#ff9900" transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>
      {/* Sun body */}
      <Sphere ref={ref} args={[9, 48, 48]}>
        <meshStandardMaterial
          color="#ffcc33"
          emissive="#ff8800"
          emissiveIntensity={2.5}
          roughness={1}
          metalness={0}
        />
      </Sphere>
      {/* Sun light source */}
      <pointLight color="#fff5cc" intensity={80} distance={400} decay={1.5} />
    </group>
  )
}

// ── Scene completa ────────────────────────────────────────────────────────────
export default function SpaceBackground() {
  return (
    <group>
      <Stars count={2500} />

      {/* Sol — arriba a la derecha, lejos */}
      <Sun position={[80, 40, -180]} />

      {/* Planetas orbitando — visibles a lo largo del recorrido */}
      {/* Rojo (tipo Marte) */}
      <Planet
        radius={4.5} color="#c1440e" emissiveIntensity={0.1}
        position={[0, 0, 0]}
        orbitCenter={[80, 30, -180]} orbitRadius={70} orbitSpeed={0.04}
      />
      {/* Azul (tipo Neptuno) */}
      <Planet
        radius={6} color="#3a7bd5" emissiveIntensity={0.12}
        position={[0, 0, 0]}
        orbitCenter={[80, 20, -180]} orbitRadius={110} orbitSpeed={0.025}
      />
      {/* Con anillos (tipo Saturno) */}
      <Planet
        radius={7} color="#c8a96e" emissiveIntensity={0.08}
        rings
        position={[0, 0, 0]}
        orbitCenter={[60, 10, -180]} orbitRadius={155} orbitSpeed={0.015}
      />
      {/* Pequeño verde */}
      <Planet
        radius={2.5} color="#4ec94e" emissiveIntensity={0.15}
        position={[0, 0, 0]}
        orbitCenter={[80, 35, -180]} orbitRadius={45} orbitSpeed={0.07}
      />
      {/* Púrpura lejano */}
      <Planet
        radius={5} color="#9b59b6" emissiveIntensity={0.1}
        position={[-60, -20, -200]}
        orbitRadius={0}
      />
    </group>
  )
}
