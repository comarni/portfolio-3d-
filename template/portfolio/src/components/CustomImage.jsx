import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, Image, Text } from '@react-three/drei'
import { INTER_FONT } from '../config'

/**
 * Single portfolio panel: screenshot + project name label.
 *
 * Props:
 *  position – [x, y, z]
 *  rotation – [x, y, z]
 *  scale    – [width, height]  (landscape 16:10 ratio)
 *  url      – screenshot image URL
 *  link     – project URL (opened on click)
 *  name     – project name shown below the panel
 */
export default function CustomImage({ position, rotation, scale = [3.20, 2.00], url, link, name }) {
  const ref    = useRef()
  const [hovered, setHover] = useState(false)
  const [w, h] = scale

  useFrame(() => {
    if (!ref.current) return
    const t = hovered ? 1.08 : 1
    ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, t * w, 0.1)
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, t * h, 0.1)
    ref.current.material.grayscale = THREE.MathUtils.lerp(
      ref.current.material.grayscale,
      hovered ? 0 : 0.55,
      0.1
    )
    ref.current.material.color.lerp(
      new THREE.Color(hovered ? '#ffffff' : '#aaaaaa'),
      0.1
    )
  })

  return (
    <Float speed={1.8} rotationIntensity={0.08} floatIntensity={0.3}>
      {/* Screenshot panel */}
      <Image
        ref={ref}
        url={url}
        position={position}
        rotation={rotation}
        scale={[w, h, 1]}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true)  }}
        onPointerOut={()  => { document.body.style.cursor = 'auto';    setHover(false) }}
        onClick={() => link && window.open(link, '_blank', 'noopener,noreferrer')}
        transparent
        opacity={0.92}
      />
      {/* Project name */}
      <Text
        font={INTER_FONT}
        fontSize={0.095}
        letterSpacing={0.05}
        color={hovered ? '#ffffff' : '#777777'}
        anchorX="center"
        anchorY="top"
        position={[position[0], position[1] - h / 2 - 0.13, position[2]]}
        rotation={rotation}
      >
        {name}
      </Text>
    </Float>
  )
}
