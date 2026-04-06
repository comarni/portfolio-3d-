import React, { Suspense, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

import SceneContent from './components/SceneContent'
import UIOverlay    from './components/UIOverlay'
import Loader       from './components/Loader'

export default function App() {
  useEffect(() => {
    const timer = setTimeout(() => document.body.classList.add('loaded'), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Loader />
      <UIOverlay />

      <Canvas
        gl={{
          antialias: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.85,
        }}
        camera={{ position: [0, 1.5, 8], fov: 60 }}
        dpr={[1, 1.5]}
      >
        {/* Deep blue-black fog for atmosphere */}
        <fog attach="fog" args={['#07071a', 18, 70]} />

        {/* ── Lighting ──────────────────────────────────────────── */}
        {/* Soft base fill — avoids pure black in unlit areas */}
        <ambientLight intensity={0.18} />

        {/* Hemisphere: cool sky tint, dark ground */}
        <hemisphereLight
          skyColor="#1e1b4b"
          groundColor="#050510"
          intensity={0.55}
        />

        {/* Main directional key light — cool-white, no harsh shadows */}
        <directionalLight
          position={[5, 12, 8]}
          intensity={0.7}
          color="#dde8ff"
        />

        {/* ── Zone accent point lights ───────────────────────────── */}
        {/* 3D & Creative — purple */}
        <pointLight position={[0, 4, -32]}  color="#a78bfa" intensity={6}  distance={40} decay={2} />
        {/* Tech Stack — orange (near the path detour) */}
        <pointLight position={[18, 4, -74]} color="#fb923c" intensity={7}  distance={45} decay={2} />
        {/* Apps & Tools — blue */}
        <pointLight position={[0, 4, -90]}  color="#38bdf8" intensity={6}  distance={40} decay={2} />
        {/* Client Work — green */}
        <pointLight position={[0, 4, -132]} color="#4ade80" intensity={6}  distance={40} decay={2} />

        <Environment preset="city" blur={1} />

        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </>
  )
}
