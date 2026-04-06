"""
create_bliss_scene.py
─────────────────────────────────────────────────────────────────────────────
Crea una escena procedural tipo "Bliss" (Windows XP) en Blender:
  · Terreno de colinas suaves con displacement
  · Material de hierba verde con variación por altura
  · Cielo Nishita con sol a baja elevación
  · Luz solar

Instrucciones:
  1. Abre Blender (3.x / 4.x)
  2. Ve a Scripting > New > pega este código > Run Script
  3. A continuación ejecuta export_bliss_splat.py
─────────────────────────────────────────────────────────────────────────────
"""
import bpy
import math


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials,
                  bpy.data.textures, bpy.data.lights):
        for item in block:
            block.remove(item)


def make_terrain():
    # Plano base 60×60 unidades
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.name = "Terrain"

    # Subdivisión densa para hills suaves
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.subdivide(number_cuts=160)
    bpy.ops.object.mode_set(mode='OBJECT')

    # Textura procedural para displacement (colinas suaves)
    tex_big = bpy.data.textures.new("Hills_Big", 'CLOUDS')
    tex_big.noise_scale  = 12.0
    tex_big.noise_depth  = 2
    tex_big.noise_basis  = 'ORIGINAL_PERLIN'

    tex_small = bpy.data.textures.new("Hills_Small", 'CLOUDS')
    tex_small.noise_scale = 4.0
    tex_small.noise_depth = 1

    # Primer displacement – forma principal de las colinas
    mod1 = obj.modifiers.new("Hills", 'DISPLACE')
    mod1.texture        = tex_big
    mod1.strength       = 4.5
    mod1.mid_level      = 0.30
    mod1.texture_coords = 'LOCAL'

    # Segundo displacement – microdetalle
    mod2 = obj.modifiers.new("Detail", 'DISPLACE')
    mod2.texture        = tex_small
    mod2.strength       = 0.6
    mod2.mid_level      = 0.50
    mod2.texture_coords = 'LOCAL'

    # Aplicar y suavizar normales
    bpy.ops.object.modifier_apply(modifier="Hills")
    bpy.ops.object.modifier_apply(modifier="Detail")
    bpy.ops.object.shade_smooth()

    return obj


def make_grass_material():
    mat = bpy.data.materials.new("Grass")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # Posición → altura Z → mix de colores
    geom     = nodes.new('ShaderNodeNewGeometry')
    sep      = nodes.new('ShaderNodeSeparateXYZ')
    links.new(geom.outputs['Position'], sep.inputs['Vector'])

    ramp = nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.20
    ramp.color_ramp.elements[0].color    = (0.07, 0.28, 0.04, 1)   # valle oscuro
    ramp.color_ramp.elements[1].position = 0.85
    ramp.color_ramp.elements[1].color    = (0.25, 0.60, 0.12, 1)   # ladera brillante

    map_r = nodes.new('ShaderNodeMapRange')
    map_r.inputs['From Min'].default_value = -2.0
    map_r.inputs['From Max'].default_value =  4.5
    links.new(sep.outputs['Z'],            map_r.inputs['Value'])
    links.new(map_r.outputs['Result'],     ramp.inputs['Fac'])

    # Ruido sutil para variación de color
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value    = 40.0
    noise.inputs['Detail'].default_value   = 4.0
    noise.inputs['Roughness'].default_value = 0.5

    mix_noise = nodes.new('ShaderNodeMixRGB')
    mix_noise.blend_type = 'OVERLAY'
    mix_noise.inputs['Fac'].default_value = 0.15
    links.new(ramp.outputs['Color'],       mix_noise.inputs['Color1'])
    links.new(noise.outputs['Color'],      mix_noise.inputs['Color2'])

    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Roughness'].default_value    = 0.92
    bsdf.inputs['Specular'].default_value     = 0.02
    bsdf.inputs['Sheen Weight'].default_value = 0.1
    links.new(mix_noise.outputs['Color'],  bsdf.inputs['Base Color'])

    out = nodes.new('ShaderNodeOutputMaterial')
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])

    return mat


def make_sky():
    world = bpy.context.scene.world or bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    wn = world.node_tree.nodes
    wl = world.node_tree.links
    wn.clear()

    sky = wn.new('ShaderNodeTexSky')
    sky.sky_type      = 'NISHITA'
    sky.sun_elevation = math.radians(22)    # sol bajo → sombras largas
    sky.sun_rotation  = math.radians(220)
    sky.altitude      = 80
    sky.air_density   = 1.0
    sky.dust_density  = 0.25
    sky.ozone_density = 1.0

    bg  = wn.new('ShaderNodeBackground')
    bg.inputs['Strength'].default_value = 0.9
    wl.new(sky.outputs['Color'], bg.inputs['Color'])

    out = wn.new('ShaderNodeOutputWorld')
    wl.new(bg.outputs['Background'], out.inputs['Surface'])


def make_sun():
    bpy.ops.object.light_add(type='SUN', location=(8, -12, 18))
    sun = bpy.context.active_object
    sun.name = "Sun"
    sun.data.energy          = 4.0
    sun.data.color           = (1.0, 0.95, 0.85)
    sun.data.angle           = math.radians(0.5)
    sun.rotation_euler       = (math.radians(55), 0, math.radians(220))


def make_camera():
    bpy.ops.object.camera_add(location=(0, -18, 6))
    cam = bpy.context.active_object
    cam.name = "Camera"
    cam.rotation_euler       = (math.radians(72), 0, 0)
    cam.data.lens            = 24          # gran angular
    cam.data.clip_end        = 500
    bpy.context.scene.camera = cam


# ── Main ──────────────────────────────────────────────────────────────────────
clear_scene()

terrain = make_terrain()
mat     = make_grass_material()
terrain.data.materials.append(mat)

make_sky()
make_sun()
make_camera()

# Render settings (para preview rápido en Eevee)
bpy.context.scene.render.engine         = 'BLENDER_EEVEE'
bpy.context.scene.eevee.use_bloom       = True
bpy.context.scene.eevee.bloom_intensity = 0.05
bpy.context.scene.render.resolution_x   = 1280
bpy.context.scene.render.resolution_y   = 720

print("=" * 60)
print("✓  Escena Bliss creada correctamente.")
print("   Siguiente paso: ejecuta export_bliss_splat.py")
print("=" * 60)
