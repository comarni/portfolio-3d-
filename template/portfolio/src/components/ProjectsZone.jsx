import React from 'react'
import { Text } from '@react-three/drei'
import CustomImage from './CustomImage'
import { INTER_FONT } from '../config'

// Panel sizes — landscape 16:10 (microlink screenshot ratio)
const SIZES = [
  [2.56, 1.60],
  [3.20, 2.00],
  [3.84, 2.40],
  [2.88, 1.80],
  [3.52, 2.20],
]
const X_AMPLITUDES = [1.8, 2.1, 2.0, 1.9, 2.2, 1.7, 2.3, 1.85]
const Y_OFFSETS    = [0, 0.6, -0.6, 0.3, -0.3, 0.9, -0.9, 0.5, -0.5, 0.15, 0.75, -0.75]
const ROT_AMOUNTS  = [0.18, 0.12, 0.22, 0.08, 0.28, 0.16, 0.20, 0.10]
const Z_STEP       = 3.5

/**
 * Renders one category zone: a large label + a zigzag gallery of project panels.
 *
 * Props:
 *  label         – zone name displayed in 3D
 *  color         – accent color for label
 *  projects      – array of { name, url } objects
 *  labelPosition – [x, y, z] for the big floating label
 *  startZ        – z coord of the first panel
 */
export default function ProjectsZone({ label, color, projects, labelPosition, startZ }) {
  return (
    <group>
      {/* Zone title */}
      <Text
        font={INTER_FONT}
        position={labelPosition}
        fontSize={1.0}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        fillOpacity={0.65}
      >
        {label}
      </Text>

      {/* Subtle separator line */}
      <mesh position={[0, labelPosition[1] - 0.9, labelPosition[2]]}>
        <planeGeometry args={[8, 0.004]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>

      {/* Project panels in a zigzag pattern */}
      {projects.map((proj, i) => {
        const side  = i % 2 === 0 ? 1 : -1
        const x     = side * X_AMPLITUDES[i % X_AMPLITUDES.length]
        const y     = Y_OFFSETS[i % Y_OFFSETS.length]
        const z     = startZ - i * Z_STEP
        const rot   = ROT_AMOUNTS[i % ROT_AMOUNTS.length]
        const scale = SIZES[i % SIZES.length]
        const screenshotUrl =
          `https://api.microlink.io/?url=${encodeURIComponent(proj.url)}&screenshot=true&meta=false&embed=screenshot.url`
        return (
          <CustomImage
            key={proj.name}
            position={[x, y, z]}
            rotation={[0, side * -rot, 0]}
            scale={scale}
            url={screenshotUrl}
            link={proj.url}
            name={proj.name}
          />
        )
      })}
    </group>
  )
}
