import React from 'react'

/**
 * Full-screen loading overlay shown until React mounts the scene.
 * Fades out automatically when the `loaded` class is added to <body>.
 */
export default function Loader() {
  return (
    <div id="loader">
      <div className="flex flex-col items-center gap-4">
        <span
          className="iconify text-zinc-600 animate-spin"
          data-icon="lucide:loader-2"
          data-width="32"
        />
        <span className="text-[10px] tracking-widest text-zinc-600 uppercase">
          Initializing Env
        </span>
      </div>
    </div>
  )
}
