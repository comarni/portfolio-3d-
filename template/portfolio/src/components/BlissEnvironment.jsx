import React, { useMemo } from 'react'
import { Sky, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// ── Procedural terrain ────────────────────────────────────────────────────────
function Terrain() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(500, 500, 120, 120)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)

      // Hills only appear beyond the interactive zone (z < -155)
      const bgT = THREE.MathUtils.smoothstep(-z, 155, 215)

      // Main Bliss-style central hill
      const hill  = Math.exp(-((x - 12) ** 2 + (z + 198) ** 2) / (2 * 88 ** 2)) * 40
      // Left secondary hill
      const hill2 = Math.exp(-((x + 68) ** 2 + (z + 218) ** 2) / (2 * 72 ** 2)) * 26
      // Right ridge
      const hill3 = Math.exp(-((x - 95) ** 2 + (z + 185) ** 2) / (2 * 65 ** 2)) * 20

      // Gentle near-ground undulation (low amplitude everywhere)
      const wave = Math.sin(x * 0.045) * Math.cos(z * 0.038) * 1.5
                 + Math.sin(x * 0.09 + 0.9) * Math.sin(z * 0.06) * 0.6

      pos.setY(i, (hill + hill2 + hill3) * bgT + wave - 3.2)
    }

    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#56b830" roughness={0.92} metalness={0} />
    </mesh>
  )
}

// ── Cloud puff (overlapping spheres) ─────────────────────────────────────────
function CloudPuff({ position, scale = 1 }) {
  const puffs = [
    [0,    0,    0,    2.8 * scale],
    [-2.4, -0.4, 0,   2.2 * scale],
    [2.6,  -0.3, 0,   2.0 * scale],
    [0.9,   1.0, 0.6, 1.8 * scale],
    [-1.4,  0.7,-0.6, 1.7 * scale],
    [1.8,  -1.0,-0.9, 1.4 * scale],
    [-0.5, -1.0, 0.8, 1.5 * scale],
  ]
  return (
    <group position={position}>
      {puffs.map(([x, y, z, r], i) => (
        <Sphere key={i} args={[r, 7, 5]} position={[x, y, z]}>
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.72}
            depthWrite={false}
            roughness={1}
          />
        </Sphere>
      ))}
    </group>
  )
}

// ── Full Bliss environment ────────────────────────────────────────────────────
export default function BlissEnvironment() {
  return (
    <>
      {/* Physically-based sky with Rayleigh scattering */}
      <Sky
        sunPosition={[100, 22, -80]}
        turbidity={7}
        rayleigh={2.5}
        mieCoefficient={0.004}
        mieDirectionalG={0.82}
      />

      {/* Rolling green terrain */}
      <Terrain />

      {/* Cloud clusters scattered across the sky */}
      <CloudPuff position={[-45, 24, -75]}  scale={1.1} />
      <CloudPuff position={[55,  30, -105]} scale={1.3} />
      <CloudPuff position={[-75, 27, -140]} scale={0.9} />
      <CloudPuff position={[30,  34, -60]}  scale={1.0} />
      <CloudPuff position={[10,  38, -125]} scale={1.4} />
      <CloudPuff position={[-22, 22, -48]}  scale={0.8} />
      <CloudPuff position={[85,  28, -90]}  scale={1.2} />
    </>
  )
}
