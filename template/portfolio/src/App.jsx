import React, { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useProgress, Html } from '@react-three/drei'

import SceneContent from './components/SceneContent'
import UIOverlay    from './components/UIOverlay'

function Loader() {
  const { progress, active } = useProgress()
  if (!active && progress === 100) {
    document.getElementById('loader')?.classList.add('done')
    return null
  }
  return (
    <Html center>
      <div style={{ color: '#333', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase' }}>
        {Math.round(progress)}%
      </div>
    </Html>
  )
}

export default function App() {
  return (
    <>
      <div id="loader">
        <div style={{ color: '#555', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase' }}>
          Loading…
        </div>
      </div>

      <UIOverlay />

      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        camera={{ position: [0, 1.5, 8], fov: 60 }}
        dpr={[1, 1.5]}
      >
        {/* Light daytime fog — matches Bliss horizon */}
        <fog attach="fog" args={['#a8d4f5', 80, 280]} />

        {/* Bright daytime ambient */}
        <ambientLight intensity={1.4} />

        {/* Sun directional — warm, from upper right */}
        <directionalLight
          position={[60, 40, -80]}
          intensity={3.5}
          color="#fff8e8"
          castShadow={false}
        />

        {/* Soft fill from the other side */}
        <hemisphereLight skyColor="#87ceeb" groundColor="#56b830" intensity={1.2} />

        {/* Zone accent lights — visible in daylight */}
        <pointLight position={[0,   5, -30]}  color="#c4b5fd" intensity={18} distance={55} decay={2} />
        <pointLight position={[18,  5, -74]}  color="#fdba74" intensity={20} distance={60} decay={2} />
        <pointLight position={[0,   5, -90]}  color="#7dd3fc" intensity={18} distance={55} decay={2} />
        <pointLight position={[0,   5, -132]} color="#86efac" intensity={18} distance={55} decay={2} />

        <Suspense fallback={<Loader />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </>
  )
}
