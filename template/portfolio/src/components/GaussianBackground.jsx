import { Splat } from '@react-three/drei'

/**
 * Carga un archivo .splat como entorno de fondo usando el componente Splat de drei.
 * El SplatLoader de drei espera coordenadas en formato COLMAP (Y-down, Z-forward)
 * y las convierte automáticamente a Three.js.
 */
export default function GaussianBackground({
  url      = '/bliss.splat',
  scale    = 1,
  position = [0, 0, 0],
}) {
  return (
    <Splat
      src={url}
      position={position}
      scale={scale}
      alphaTest={0.05}
    />
  )
}
