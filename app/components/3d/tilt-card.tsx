'use client'

import React, { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/app/utils/cn'

interface TiltCard3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  maxTilt?: number // degrees
  scale?: number
  perspective?: number
  enableGlare?: boolean
  glareMaxOpacity?: number
  floatingLayers?: boolean
}

export default function TiltCard3D({
  children,
  className = '',
  innerClassName = '',
  maxTilt = 10,
  scale = 1.02,
  perspective = 1000,
  enableGlare = true,
  glareMaxOpacity = 0.25,
  floatingLayers = true,
  ...props
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse coordinates from -0.5 to 0.5 relative to card
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Springs for smooth physics
  const springConfig = { damping: 20, stiffness: 220, mass: 0.6 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  // Tilt rotation
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt])

  // Scale on hover
  const springScale = useSpring(isHovered ? scale : 1, springConfig)

  // Glare position
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%'])
  const glareOpacity = useSpring(isHovered ? glareMaxOpacity : 0, springConfig)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top

      const normalizedX = clientX / rect.width - 0.5
      const normalizedY = clientY / rect.height - 0.5

      x.set(normalizedX)
      y.set(normalizedY)
    },
    [x, y]
  )

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('relative', className)}
      style={{ perspective: `${perspective}px` }}
      {...props}
    >
      <motion.div
        className={cn('relative w-full h-full transition-shadow duration-300', innerClassName)}
        style={{
          rotateX,
          rotateY,
          scale: springScale,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Dynamic 3D Glare Reflection */}
        {enableGlare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-30"
            style={{ opacity: glareOpacity }}
          >
            <motion.div
              className="absolute -inset-full w-[300%] h-[300%]"
              style={{
                left: glareX,
                top: glareY,
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle 350px at center, rgba(255, 255, 255, 0.4) 0%, rgba(249, 115, 22, 0.15) 35%, transparent 70%)',
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
