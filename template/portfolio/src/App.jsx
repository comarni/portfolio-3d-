import React, { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useProgress, Html } from '@react-three/drei'

import SceneContent from './components/SceneContent'
import UIOverlay    from './components/UIOverlay'

function Loader() {
  const { progress, active } = useProgress()

  if (!active && progress === 100) {
    // hide loader — done
    document.getElementById('loader')?.classList.add('done')
    return null
  }

  return (
    <Html center>
      <div style={{ color: '#555', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase' }}>
        {Math.round(progress)}%
      </div>
    </Html>
  )
}

export default function App() {
  return (
    <>
      <div id="loader">
        <div style={{ color: '#444', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase' }}>
          Loading…
        </div>
      </div>

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
        <fog attach="fog" args={['#07071a', 18, 70]} />

        <ambientLight intensity={0.18} />
        <hemisphereLight skyColor="#1e1b4b" groundColor="#050510" intensity={0.55} />
        <directionalLight position={[5, 12, 8]} intensity={0.7} color="#dde8ff" />

        <pointLight position={[0, 4, -32]}  color="#a78bfa" intensity={6}  distance={40} decay={2} />
        <pointLight position={[18, 4, -74]} color="#fb923c" intensity={7}  distance={45} decay={2} />
        <pointLight position={[0, 4, -90]}  color="#38bdf8" intensity={6}  distance={40} decay={2} />
        <pointLight position={[0, 4, -132]} color="#4ade80" intensity={6}  distance={40} decay={2} />

        <Suspense fallback={<Loader />}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </>
  )
}
