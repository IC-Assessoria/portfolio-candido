'use client'

import React, { useEffect, useRef } from 'react'

interface Particle3D {
  x: number
  y: number
  z: number
  baseSize: number
  color: string
}

export default function Particles3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Mouse coordinates for 3D parallax
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.05
      targetMouseY = (e.clientY - height / 2) * 0.05
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Generate 3D particles
    const particleCount = 65
    const particles: Particle3D[] = []
    const depth = 1200

    const colors = [
      'rgba(249, 115, 22, 0.45)', // orange
      'rgba(245, 158, 11, 0.35)', // amber
      'rgba(255, 255, 255, 0.25)', // star white
      'rgba(251, 146, 60, 0.4)',  // warm orange
    ]

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * depth,
        baseSize: Math.random() * 2 + 1,
        color: colors[i % colors.length],
      })
    }

    const render = () => {
      // Ease mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      ctx.clearRect(0, 0, width, height)

      const fov = 400
      const centerX = width / 2
      const centerY = height / 2

      particles.forEach((p) => {
        // Move particle forward in Z space
        p.z -= 0.6
        if (p.z <= 1) {
          p.z = depth
          p.x = (Math.random() - 0.5) * width * 1.5
          p.y = (Math.random() - 0.5) * height * 1.5
        }

        // Project 3D coordinates to 2D
        const k = fov / p.z
        const px = (p.x + mouseX) * k + centerX
        const py = (p.y + mouseY) * k + centerY
        const size = p.baseSize * k

        // Depth alpha: fade in as it approaches, fade out when too close
        const alpha = Math.min(1, Math.max(0, (1 - p.z / depth) * 1.2))

        if (px >= 0 && px <= width && py >= 0 && py <= height && size > 0.5) {
          ctx.beginPath()
          ctx.arc(px, py, Math.min(size, 4), 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = alpha
          ctx.fill()
        }
      })
      ctx.globalAlpha = 1.0

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  )
}
