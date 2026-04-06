"""
export_bliss_splat.py
─────────────────────────────────────────────────────────────────────────────
Convierte la escena Bliss al formato binario .splat listo para Three.js.

Formato .splat – 32 bytes por splat:
  bytes  0-11  position   3 × float32
  bytes 12-23  scale      3 × float32
  bytes 24-27  color      4 × uint8  (RGBA)
  bytes 28-31  rotation   4 × uint8  (quaternion 0-255)

Instrucciones:
  1. Ejecuta create_bliss_scene.py y comprueba que el terrain tiene colinas
  2. Pega este script en Scripting > Run Script
─────────────────────────────────────────────────────────────────────────────
"""
import bpy, bmesh, struct, math, random, os
from mathutils import Vector

# ── Configuración ─────────────────────────────────────────────────────────────
OUTPUT_PATH        = r"C:\Users\marko\Desktop\dollars\Portfolio\template\portfolio\public\bliss.splat"
NUM_TERRAIN_SPLATS = 120_000
NUM_SKY_SPLATS     =  40_000
SKY_RADIUS         = 85.0
random.seed(42)


# ── Coordenadas: Blender (Z-up) → Three.js (Y-up) ────────────────────────────
def to_three(bv):
    """blender(x,y,z) → threejs(x, z, -y)"""
    return (float(bv.x), float(bv.z), float(-bv.y))


# ── Codificación binaria ──────────────────────────────────────────────────────
def quat_bytes(w, x, y, z):
    def enc(v): return max(0, min(255, int((v * 0.5 + 0.5) * 255)))
    return enc(w), enc(x), enc(y), enc(z)

IDENTITY_QUAT = quat_bytes(1.0, 0.0, 0.0, 0.0)

def write_splat(f, pos, sx, sy, sz, r, g, b, a=255, quat=IDENTITY_QUAT):
    f.write(struct.pack('<3f', *pos))
    f.write(struct.pack('<3f', sx, sy, sz))
    f.write(struct.pack('4B',  r, g, b, a))
    f.write(struct.pack('4B',  *quat))


# ── Color hierba ──────────────────────────────────────────────────────────────
def grass_color(z, z_min, z_max):
    """
    Verde tipo Bliss interpolado por altura.
    z_min / z_max son los extremos reales del mesh (calculados al inicio).
    """
    rng = z_max - z_min if z_max != z_min else 1.0
    t   = max(0.0, min(1.0, (z - z_min) / rng))

    # Valle oscuro (t=0) → ladera brillante (t=1)
    r = 0.06 + t * 0.20
    g = 0.25 + t * 0.38
    b = 0.03 + t * 0.09

    # Pequeño ruido por punto
    nr = random.gauss(0, 0.010)
    ng = random.gauss(0, 0.018)
    nb = random.gauss(0, 0.007)

    return (
        max(0, min(255, round((r + nr) * 255))),
        max(0, min(255, round((g + ng) * 255))),
        max(0, min(255, round((b + nb) * 255))),
    )


# ── Color cielo ───────────────────────────────────────────────────────────────
def sky_color(phi, theta):
    """phi = elevación [0..π/2],  theta = acimut [0..2π]"""
    t = phi / (math.pi / 2)          # 0 = horizonte, 1 = cénit

    # Gradiente azul
    r_s = 0.27 + (1 - t) * 0.18
    g_s = 0.50 + (1 - t) * 0.14
    b_s = 0.90 - (1 - t) * 0.08

    # Nubes (ruido trigonométrico)
    cloud  = (math.sin(theta * 3.7 + phi * 5.1) * 0.5 + 0.5)
    cloud *= (math.cos(theta * 2.3 - phi * 7.2) * 0.5 + 0.5)
    cloud  = max(0.0, cloud - 0.40) * 2.8
    cloud *= max(0.0, 1.0 - t * 2.8)   # solo en zona baja del cielo
    cloud  = min(1.0, cloud)

    # Tono cálido en horizonte
    warm = max(0.0, 1.0 - t * 4.5) * 0.28
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


# ── Muestreo de superficie del mesh ──────────────────────────────────────────
def sample_mesh_surface(obj, n_samples):
    """
    Devuelve n_samples puntos (Vector, normal_Vector) distribuidos
    uniformemente sobre la superficie del objeto evaluado (con modifiers).
    """
    # ¡IMPORTANTE! evaluated_get aplica los Displace modifiers
    depsgraph = bpy.context.evaluated_depsgraph_get()
    eval_obj  = obj.evaluated_get(depsgraph)
    mesh_data = eval_obj.to_mesh()

    bm = bmesh.new()
    bm.from_mesh(mesh_data)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bm.verts.ensure_lookup_table()

    # Recoge triángulos con sus áreas
    tris = []
    for face in bm.faces:
        a = face.verts[0].co.copy()
        b = face.verts[1].co.copy()
        c = face.verts[2].co.copy()
        n = face.normal.copy()
        area = ((b - a).cross(c - a)).length * 0.5
        if area > 1e-10:
            tris.append((a, b, c, n, area))

    bm.free()
    eval_obj.to_mesh_clear()

    if not tris:
        raise RuntimeError("El mesh no tiene triángulos. ¿Se aplicaron los modifiers?")

    total = sum(t[4] for t in tris)

    # Diagnóstico de altura
    all_z = [t[0].z for t in tris] + [t[1].z for t in tris] + [t[2].z for t in tris]
    z_min, z_max = min(all_z), max(all_z)
    print(f"  → Rango Z del terreno: {z_min:.3f} .. {z_max:.3f}  "
          f"({'OK – hay relieve' if (z_max - z_min) > 0.5 else 'PLANO – modifiers no aplicados'})")

    # Pesos acumulados
    cum, acc = [], 0.0
    for t in tris:
        acc += t[4] / total
        cum.append(acc)
    cum[-1] = 1.0   # evita errores de punto flotante

    points = []
    for _ in range(n_samples):
        r = random.random()
        # Búsqueda binaria del triángulo
        lo, hi = 0, len(cum) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if cum[mid] < r:
                lo = mid + 1
            else:
                hi = mid
        a, b, c, normal, _ = tris[lo]

        r1, r2 = random.random(), random.random()
        if r1 + r2 > 1.0:
            r1, r2 = 1.0 - r1, 1.0 - r2
        p = a + r1 * (b - a) + r2 * (c - a)
        points.append((p, normal))

    return points, z_min, z_max


# ── Export ────────────────────────────────────────────────────────────────────
def export():
    terrain = bpy.data.objects.get("Terrain")
    if not terrain:
        raise RuntimeError("No se encontró el objeto 'Terrain'. "
                           "Ejecuta create_bliss_scene.py primero.")

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    print(f"\nMuestreando {NUM_TERRAIN_SPLATS:,} puntos del terreno...")
    terrain_pts, z_min, z_max = sample_mesh_surface(terrain, NUM_TERRAIN_SPLATS)

    total = NUM_TERRAIN_SPLATS + NUM_SKY_SPLATS
    print(f"Escribiendo {total:,} splats en:\n  {OUTPUT_PATH}")

    with open(OUTPUT_PATH, 'wb') as f:

        # ── Terrain splats ────────────────────────────────────────────
        for p, _normal in terrain_pts:
            pos = to_three(p)
            r, g, b = grass_color(p.z, z_min, z_max)

            # Splat ligeramente plano (pancake alineado con la superficie)
            base_s = 0.06 + random.uniform(0.0, 0.04)
            write_splat(f, pos,
                sx=base_s, sy=base_s, sz=0.014,
                r=r, g=g, b=b, a=255)

        # ── Sky dome splats ───────────────────────────────────────────
        print(f"Generando {NUM_SKY_SPLATS:,} splats de cielo...")
        R = SKY_RADIUS
        for _ in range(NUM_SKY_SPLATS):
            u, v  = random.random(), random.random()
            phi   = math.asin(math.sqrt(u))   # distribución uniforme en área
            theta = v * 2 * math.pi

            bx = R * math.cos(phi) * math.cos(theta)
            by = R * math.cos(phi) * math.sin(theta)
            bz = R * math.sin(phi)
            pos = to_three(Vector((bx, by, bz)))

            r, g, b = sky_color(phi, theta)

            s = 1.6 + random.uniform(0.0, 1.2)
            if phi < 0.30:          # zona de nubes cerca del horizonte
                s *= 2.8 + random.uniform(0, 2.0)
            alpha = 210 if phi > 0.35 else 185

            write_splat(f, pos, sx=s, sy=s, sz=s * 0.30,
                        r=r, g=g, b=b, a=alpha)

    size_mb = os.path.getsize(OUTPUT_PATH) / 1_000_000
    print("=" * 60)
    print(f"✓  Exportado: {total:,} splats  |  {size_mb:.1f} MB")
    print(f"   {OUTPUT_PATH}")
    print("=" * 60)
    print("Siguiente paso: pon GAUSSIAN_ENABLED = True en SceneContent.jsx")


export()
