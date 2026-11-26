'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Point3D {
  x: number
  y: number
  z: number
  size: number
  color: string
  pulseSpeed: number
  pulseOffset: number
  label?: string
}

interface OrbitalRing {
  radius: number
  tiltX: number
  tiltZ: number
  speed: number
  angle: number
  packetAngle: number
  packetColor: string
}

export default function HealthDataGlobe3D({
  className = '',
  size = 280,
}: {
  className?: string
  size?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0.35, y: 0.5 })
  const velocity = useRef({ x: 0.002, y: 0.005 })
  const [activeMetric, setActiveMetric] = useState<string>('Vigilância Ativa')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let isVisible = true

    // Responsive DPI scaling
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Generate 3D sphere points (epidemiological and health data nodes)
    const points: Point3D[] = []
    const numPoints = 120
    const globeRadius = size * 0.38

    // Golden spiral distribution for uniform sphere points
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i

      const isKeyNode = i % 14 === 0
      const pointColor = isKeyNode
        ? 'rgba(251, 146, 60, 0.95)' // bright orange
        : i % 5 === 0
        ? 'rgba(245, 158, 11, 0.75)' // amber
        : 'rgba(255, 255, 255, 0.45)' // subtle white/cyan

      points.push({
        x: globeRadius * Math.sin(phi) * Math.cos(theta),
        y: globeRadius * Math.sin(phi) * Math.sin(theta),
        z: globeRadius * Math.cos(phi),
        size: isKeyNode ? 3.5 : Math.random() * 1.5 + 1.2,
        color: pointColor,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        pulseOffset: Math.random() * Math.PI * 2,
        label: isKeyNode ? ['SINAN', 'SIM/SINASC', 'Indicadores', 'Vigilância', 'Metas'][i % 5] : undefined,
      })
    }

    // 3D Orbital Rings
    const rings: OrbitalRing[] = [
      {
        radius: globeRadius * 1.18,
        tiltX: 0.45,
        tiltZ: 0.25,
        speed: 0.015,
        angle: 0,
        packetAngle: 0,
        packetColor: '#f97316',
      },
      {
        radius: globeRadius * 1.32,
        tiltX: -0.55,
        tiltZ: -0.35,
        speed: -0.012,
        angle: 0,
        packetAngle: Math.PI,
        packetColor: '#fbbf24',
      },
      {
        radius: globeRadius * 1.05,
        tiltX: 1.1,
        tiltZ: 0.6,
        speed: 0.018,
        angle: 0,
        packetAngle: Math.PI / 2,
        packetColor: '#38bdf8',
      },
    ]

    let time = 0

    // Intersection observer to pause when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    observer.observe(canvas)

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      time += 0.02

      // Apply auto-rotation inertia
      if (!isDragging.current) {
        rotation.current.y += velocity.current.y
        rotation.current.x += velocity.current.x * 0.5
      }

      ctx.clearRect(0, 0, size, size)

      const centerX = size / 2
      const centerY = size / 2
      const fov = size * 1.2

      const cosY = Math.cos(rotation.current.y)
      const sinY = Math.sin(rotation.current.y)
      const cosX = Math.cos(rotation.current.x)
      const sinX = Math.sin(rotation.current.x)

      // Ambient radial glow at center of globe
      const coreGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.1,
        centerX,
        centerY,
        globeRadius * 1.3
      )
      coreGlow.addColorStop(0, 'rgba(249, 115, 22, 0.22)')
      coreGlow.addColorStop(0.5, 'rgba(234, 88, 12, 0.08)')
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = coreGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, globeRadius * 1.3, 0, Math.PI * 2)
      ctx.fill()

      // Draw 3D Orbital Rings
      rings.forEach((ring) => {
        ring.packetAngle += ring.speed
        ctx.save()
        ctx.translate(centerX, centerY)

        // Draw ring segments with 3D projection
        ctx.beginPath()
        const ringSegments = 48
        for (let j = 0; j <= ringSegments; j++) {
          const a = (j / ringSegments) * Math.PI * 2
          const rx = ring.radius * Math.cos(a)
          const ry = ring.radius * Math.sin(a)
          const rz = 0

          // Tilt ring
          const t1y = ry * Math.cos(ring.tiltX) - rz * Math.sin(ring.tiltX)
          const t1z = ry * Math.sin(ring.tiltX) + rz * Math.cos(ring.tiltX)
          const t2x = rx * Math.cos(ring.tiltZ) - t1y * Math.sin(ring.tiltZ)
          const t2y = rx * Math.sin(ring.tiltZ) + t1y * Math.cos(ring.tiltZ)

          // Rotate with globe
          const rxRot = t2x * cosY + t1z * sinY
          const rzRot = -t2x * sinY + t1z * cosY
          const ryRot = t2y * cosX - rzRot * sinX
          const finalZ = t2y * sinX + rzRot * cosX

          const scale = fov / (fov + finalZ)
          const px = rxRot * scale
          const py = ryRot * scale

          if (j === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.18)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw moving data packet on ring
        const pa = ring.packetAngle
        const px = ring.radius * Math.cos(pa)
        const py = ring.radius * Math.sin(pa)
        const pz = 0

        const pt1y = py * Math.cos(ring.tiltX) - pz * Math.sin(ring.tiltX)
        const pt1z = py * Math.sin(ring.tiltX) + pz * Math.cos(ring.tiltX)
        const pt2x = px * Math.cos(ring.tiltZ) - pt1y * Math.sin(ring.tiltZ)
        const pt2y = px * Math.sin(ring.tiltZ) + pt1y * Math.cos(ring.tiltZ)

        const prx = pt2x * cosY + pt1z * sinY
        const prz = -pt2x * sinY + pt1z * cosY
        const pry = pt2y * cosX - prz * sinX
        const pzFinal = pt2y * sinX + prz * cosX

        const pScale = fov / (fov + pzFinal)
        const screenPx = prx * pScale
        const screenPy = pry * pScale

        if (pzFinal > -globeRadius) {
          ctx.beginPath()
          ctx.arc(screenPx, screenPy, 3 * pScale, 0, Math.PI * 2)
          ctx.fillStyle = ring.packetColor
          ctx.shadowColor = ring.packetColor
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }

        ctx.restore()
      })

      // Project and sort points by Z (depth sorting)
      interface ProjectedPoint {
        x: number
        y: number
        z: number
        size: number
        color: string
        alpha: number
        label?: string
      }

      const projected: ProjectedPoint[] = []

      points.forEach((pt) => {
        // Y-axis rotation
        const x1 = pt.x * cosY + pt.z * sinY
        const z1 = -pt.x * sinY + pt.z * cosY

        // X-axis rotation
        const y2 = pt.y * cosX - z1 * sinX
        const z2 = pt.y * sinX + z1 * cosX

        // Perspective scale & depth
        const scale = fov / (fov + z2)
        const projX = centerX + x1 * scale
        const projY = centerY + y2 * scale

        // Depth fog (alpha between 0.15 and 0.95)
        const depthRatio = (z2 + globeRadius) / (globeRadius * 2)
        const alpha = Math.max(0.12, Math.min(1, depthRatio * 0.85 + 0.15))
        const pulse = Math.sin(time * 3 * pt.pulseSpeed + pt.pulseOffset) * 0.5 + 0.5

        projected.push({
          x: projX,
          y: projY,
          z: z2,
          size: pt.size * scale * (0.8 + 0.3 * pulse),
          color: pt.color,
          alpha,
          label: pt.label,
        })
      })

      // Sort points so back points are drawn first, front points drawn last
      projected.sort((a, b) => a.z - b.z)

      // Connect nearby front points with neural/network lines
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.14)'
      ctx.lineWidth = 0.8
      for (let i = 0; i < projected.length; i++) {
        if (projected[i].z < 0) continue // only connect front points
        for (let j = i + 1; j < projected.length; j++) {
          if (projected[j].z < 0) continue
          const dx = projected[i].x - projected[j].x
          const dy = projected[i].y - projected[j].y
          const distSq = dx * dx + dy * dy
          if (distSq < 1300) {
            ctx.moveTo(projected[i].x, projected[i].y)
            ctx.lineTo(projected[j].x, projected[j].y)
          }
        }
      }
      ctx.stroke()

      // Draw points
      projected.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()

        // Highlight key nodes with subtle glow and label
        if (p.label && p.z > globeRadius * 0.3) {
          ctx.shadowColor = '#f97316'
          ctx.shadowBlur = 8
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.fill()
          ctx.shadowBlur = 0

          // Subtle label
          ctx.font = '9px monospace'
          ctx.fillStyle = '#fdba74'
          ctx.fillText(p.label, p.x + 6, p.y - 4)
        }
      })
      ctx.globalAlpha = 1.0

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    // Mouse drag interaction
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      previousMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) {
        // Subtle tilt when hovering
        const rect = canvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.left - size / 2
        const mouseY = e.clientY - rect.top - size / 2
        velocity.current.x = (mouseY / size) * 0.008
        velocity.current.y = (mouseX / size) * 0.008
        return
      }

      const deltaX = e.clientX - previousMousePosition.current.x
      const deltaY = e.clientY - previousMousePosition.current.y

      rotation.current.y += deltaX * 0.008
      rotation.current.x += deltaY * 0.008

      previousMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isDragging.current = false
      velocity.current = { x: 0.001, y: 0.005 }
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
      canvas.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [size])

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="cursor-grab active:cursor-grabbing drop-shadow-[0_0_35px_rgba(249,115,22,0.35)]"
        title="Arraste para rotacionar o globo 3D de inteligência epidemiológica"
      />

      {/* Interactive 3D Status Overlay Pill */}
      <div className="absolute -bottom-2 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-orange-500/30 backdrop-blur-md shadow-lg pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
        <span className="text-[10px] font-mono text-orange-300 font-semibold tracking-wider uppercase">
          Fluxo 3D de Vigilância Ativa
        </span>
      </div>
    </div>
  )
}
