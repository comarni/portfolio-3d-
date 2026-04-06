import React from 'react'
import { OWNER_NAME, OWNER_TITLE, ZONES } from '../config'

const teleport = key =>
  window.dispatchEvent(new CustomEvent('portfolio:teleport', { detail: key }))

/**
 * Fixed HTML overlay on top of the 3D canvas.
 *
 * Mode badge + zone name are updated via DOM by CameraController (no re-render).
 */
export default function UIOverlay() {
  return (
    <div
      id="ui-layer"
      className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 md:p-10 text-zinc-300"
    >
      {/* ── Top bar ── */}
      <nav className="flex justify-between items-start w-full">
        {/* Identity */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-white uppercase">
            {OWNER_NAME}
          </h1>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {OWNER_TITLE}
          </span>
        </div>

        {/* Zone + mode */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {/* Mode badge — text updated via DOM */}
            <span
              id="nav-mode"
              className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border"
              style={{
                color: '#4ade80',
                borderColor: '#4ade80',
                opacity: 0.8,
              }}
            >
              GUIDED
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[9px] uppercase tracking-widest text-zinc-600">Zone</span>
            <span id="current-zone" className="text-xs font-mono text-zinc-300 uppercase tracking-widest">
              Entry
            </span>
          </div>
        </div>
      </nav>

      {/* ── Bottom bar ── */}
      <div className="flex justify-between items-end w-full">

        {/* Controls legend */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Controls</span>
          <span className="text-[11px] font-mono text-zinc-500">SCROLL  · Advance path</span>
          <span className="text-[11px] font-mono text-zinc-500">DRAG    · Look around</span>
          <span className="text-[11px] font-mono text-zinc-400 font-semibold">
            SPACE   · Toggle free / guided
          </span>
          <span className="text-[11px] font-mono text-zinc-600">W A S D · Move  (free)</span>
          <span className="text-[11px] font-mono text-zinc-600">Q / E   · Up / Down  (free)</span>
          <span className="text-[11px] font-mono text-zinc-500">CLICK   · Open project</span>
        </div>

        {/* Zone teleport */}
        <div className="flex flex-col gap-2 items-end pointer-events-auto">
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1">Jump to</span>
          {ZONES.filter(z => z.key !== 'entry').map(z => (
            <button
              key={z.key}
              onClick={() => teleport(z.key)}
              className="text-[11px] font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: z.color }}
            >
              → {z.label}
            </button>
          ))}
          <button
            onClick={() => teleport('entry')}
            className="text-[11px] font-mono uppercase tracking-widest opacity-30 hover:opacity-70 transition-opacity text-zinc-400 mt-1"
          >
            ↑ Start
          </button>
        </div>
      </div>
    </div>
  )
}
