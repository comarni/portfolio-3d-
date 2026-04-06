"""
generate_bliss_headless.py
──────────────────────────────────────────────────────────────────────────────
Script todo-en-uno para generar bliss.splat sin interfaz gráfica.
Ejecución: blender --background --python generate_bliss_headless.py

Crea el terreno con bmesh (sin bpy.ops) para máxima compatibilidad headless,
luego muestrea la superficie y escribe el .splat binario directamente.

Formato .splat – 32 bytes por splat:
  bytes  0-11  position   3 × float32
  bytes 12-23  scale      3 × float32
  bytes 24-27  color      4 × uint8  (RGBA)
  bytes 28-31  rotation   4 × uint8  (quaternion 0-255)
──────────────────────────────────────────────────────────────────────────────
"""
import bpy, bmesh, struct, math, random, os
from mathutils import Vector, noise as mnoise

OUTPUT_PATH        = r"C:\Users\marko\Desktop\dollars\Portfolio\template\portfolio\public\bliss.splat"
NUM_TERRAIN_SPLATS = 120_000
NUM_SKY_SPLATS     =  40_000
SKY_RADIUS         = 85.0
TERRAIN_SIZE       = 60.0
SUBDIVISIONS       = 160       # cuts per side
random.seed(42)

# ── Coordenadas: Blender (Z-up) → COLMAP/native splat (Y-down, Z-forward) ────
# drei's SplatLoader expects COLMAP format and converts it to Three.js internally:
#   stored = (cx, -cy, -cz)  where input is (cx=COLMAP_X, cy=COLMAP_Y, cz=COLMAP_Z)
# Blender → COLMAP:  COLMAP_X = blender_X,  COLMAP_Y = -blender_Z,  COLMAP_Z = blender_Y
def to_colmap(x, y, z):
    return (float(x), float(-z), float(y))

# ── Encoding helpers ──────────────────────────────────────────────────────────
def quat_bytes(w, x, y, z):
    def enc(v): return max(0, min(255, int((v * 0.5 + 0.5) * 255)))
    return enc(w), enc(x), enc(y), enc(z)

IDENTITY_QUAT = quat_bytes(1.0, 0.0, 0.0, 0.0)

def write_splat(f, pos, sx, sy, sz, r, g, b, a=255, quat=IDENTITY_QUAT):
    f.write(struct.pack('<3f', *pos))
    f.write(struct.pack('<3f', sx, sy, sz))
    f.write(struct.pack('4B',  r, g, b, a))
    f.write(struct.pack('4B',  *quat))

# ── Displacement height (Blender's built-in noise) ────────────────────────────
def terrain_height(x, y):
    """Smooth hills using Blender's musgrave-like noise."""
    # Big hills
    v_big   = Vector((x / 12.0, y / 12.0, 0.5))
    n_big   = mnoise.noise(v_big, noise_basis='PERLIN_ORIGINAL')   # -1..1
    # Small detail
    v_small = Vector((x / 4.0,  y / 4.0,  0.5))
    n_small = mnoise.noise(v_small, noise_basis='PERLIN_ORIGINAL')

    # strength=4.5, mid=0.30 → offset = (n*0.5+0.5 - 0.30) * 4.5
    big   = ((n_big   * 0.5 + 0.5) - 0.30) * 4.5
    small = ((n_small * 0.5 + 0.5) - 0.50) * 0.6
    return big + small

# ── Color helpers ─────────────────────────────────────────────────────────────
def grass_color(z, z_min, z_max):
    rng = z_max - z_min if z_max != z_min else 1.0
    t   = max(0.0, min(1.0, (z - z_min) / rng))
    r = 0.06 + t * 0.20
    g = 0.25 + t * 0.38
    b = 0.03 + t * 0.09
    nr = random.gauss(0, 0.010)
    ng = random.gauss(0, 0.018)
    nb = random.gauss(0, 0.007)
    return (
        max(0, min(255, round((r + nr) * 255))),
        max(0, min(255, round((g + ng) * 255))),
        max(0, min(255, round((b + nb) * 255))),
    )

def sky_color(phi, theta):
    t   = phi / (math.pi / 2)
    r_s = 0.27 + (1 - t) * 0.18
    g_s = 0.50 + (1 - t) * 0.14
    b_s = 0.90 - (1 - t) * 0.08
    cloud  = (math.sin(theta * 3.7 + phi * 5.1) * 0.5 + 0.5)
    cloud *= (math.cos(theta * 2.3 - phi * 7.2) * 0.5 + 0.5)
    cloud  = max(0.0, cloud - 0.40) * 2.8
    cloud *= max(0.0, 1.0 - t * 2.8)
    cloud  = min(1.0, cloud)
    warm   = max(0.0, 1.0 - t * 4.5) * 0.28
    r_s += warm * 0.30
    g_s += warm * 0.10
    r = r_s * (1 - cloud) + 0.97 * cloud
    g = g_s * (1 - cloud) + 0.97 * cloud
    b = b_s * (1 - cloud) + 0.99 * cloud
    return (
        max(0, min(255, round(r * 255))),
        max(0, min(255, round(g * 255))),
        max(0, min(255, round(b * 255))),
    )

# ── Build terrain mesh ────────────────────────────────────────────────────────
def build_terrain_mesh():
    """Creates the terrain mesh using bmesh (no bpy.ops needed)."""
    print("Construyendo mesh del terreno con bmesh...")

    me = bpy.data.meshes.new("TerrainMesh")
    obj = bpy.data.objects.new("Terrain", me)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()

    n    = SUBDIVISIONS + 1          # vértices por lado
    step = TERRAIN_SIZE / SUBDIVISIONS
    half = TERRAIN_SIZE / 2.0

    print(f"  Generando {n}×{n} = {n*n:,} vértices...")
    verts = []
    z_vals = []
    for iy in range(n):
        row = []
        for ix in range(n):
            x = -half + ix * step
            y = -half + iy * step
            z = terrain_height(x, y)
            v = bm.verts.new((x, y, z))
            row.append(v)
            z_vals.append(z)
        verts.append(row)

    z_min, z_max = min(z_vals), max(z_vals)
    print(f"  Rango Z: {z_min:.3f} .. {z_max:.3f}")

    print(f"  Generando {SUBDIVISIONS}×{SUBDIVISIONS} = {SUBDIVISIONS**2:,} quads...")
    for iy in range(SUBDIVISIONS):
        for ix in range(SUBDIVISIONS):
            bm.faces.new([
                verts[iy    ][ix    ],
                verts[iy    ][ix + 1],
                verts[iy + 1][ix + 1],
                verts[iy + 1][ix    ],
            ])

    bm.to_mesh(me)
    bm.free()
    me.update()

    return obj, z_min, z_max

# ── Sample terrain surface ────────────────────────────────────────────────────
def sample_terrain(obj, n_samples):
    """Uniform area-weighted surface sampling using existing bm from mesh."""
    print(f"Muestreando {n_samples:,} puntos del terreno...")

    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bm.verts.ensure_lookup_table()

    tris = []
    for face in bm.faces:
        a = face.verts[0].co.copy()
        b = face.verts[1].co.copy()
        c = face.verts[2].co.copy()
        area = ((b - a).cross(c - a)).length * 0.5
        if area > 1e-10:
            tris.append((a, b, c, area))

    bm.free()

    total = sum(t[3] for t in tris)
    cum, acc = [], 0.0
    for t in tris:
        acc += t[3] / total
        cum.append(acc)
    cum[-1] = 1.0

    # Get z range from actual tris
    all_z = []
    for t in tris:
        all_z.extend([t[0].z, t[1].z, t[2].z])
    z_min, z_max = min(all_z), max(all_z)

    points = []
    for _ in range(n_samples):
        r = random.random()
        lo, hi = 0, len(cum) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if cum[mid] < r:
                lo = mid + 1
            else:
                hi = mid
        a, b, c, _ = tris[lo]
        r1, r2 = random.random(), random.random()
        if r1 + r2 > 1.0:
            r1, r2 = 1.0 - r1, 1.0 - r2
        p = a + r1 * (b - a) + r2 * (c - a)
        points.append(p)

    return points, z_min, z_max

# ── Main export ───────────────────────────────────────────────────────────────
def main():
    print("\n" + "=" * 60)
    print("GENERANDO BLISS.SPLAT")
    print("=" * 60)

    # Clear default scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Build terrain
    terrain_obj, z_min_build, z_max_build = build_terrain_mesh()

    # Sample
    terrain_pts, z_min, z_max = sample_terrain(terrain_obj, NUM_TERRAIN_SPLATS)
    print(f"  Z range (sampling): {z_min:.3f} .. {z_max:.3f}")

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    total = NUM_TERRAIN_SPLATS + NUM_SKY_SPLATS
    print(f"\nEscribiendo {total:,} splats → {OUTPUT_PATH}")

    with open(OUTPUT_PATH, 'wb') as f:

        # Terrain splats
        for p in terrain_pts:
            pos = to_colmap(p.x, p.y, p.z)
            r, g, b = grass_color(p.z, z_min, z_max)
            base_s = 0.06 + random.uniform(0.0, 0.04)
            write_splat(f, pos, sx=base_s, sy=base_s, sz=0.014, r=r, g=g, b=b)

        # Sky dome splats
        print(f"Generando {NUM_SKY_SPLATS:,} splats de cielo...")
        R = SKY_RADIUS
        for _ in range(NUM_SKY_SPLATS):
            u, v   = random.random(), random.random()
            phi    = math.asin(math.sqrt(u))
            theta  = v * 2 * math.pi
            bx = R * math.cos(phi) * math.cos(theta)
            by = R * math.cos(phi) * math.sin(theta)
            bz = R * math.sin(phi)
            pos = to_colmap(bx, by, bz)
            r, g, b = sky_color(phi, theta)
            s = 1.6 + random.uniform(0.0, 1.2)
            if phi < 0.30:
                s *= 2.8 + random.uniform(0, 2.0)
            alpha = 210 if phi > 0.35 else 185
            write_splat(f, pos, sx=s, sy=s, sz=s * 0.30, r=r, g=g, b=b, a=alpha)

    size_mb = os.path.getsize(OUTPUT_PATH) / 1_000_000
    print("=" * 60)
    print(f"✓  Exportado: {total:,} splats  |  {size_mb:.1f} MB")
    print(f"   {OUTPUT_PATH}")
    print("=" * 60)

main()
