import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const themes = {
  '/': {
    primary: 'rgba(187, 247, 208, 0.4)',
    secondary: 'rgba(186, 230, 253, 0.4)',
    accent: 'rgba(254, 243, 199, 0.3)',
    particles: ['rgba(12, 138, 96, 0.5)', 'rgba(16, 185, 129, 0.4)', 'rgba(2, 132, 199, 0.4)', 'rgba(56, 189, 248, 0.3)']
  },
  '/explore': {
    primary: 'rgba(186, 230, 253, 0.5)',
    secondary: 'rgba(224, 242, 254, 0.4)',
    accent: 'rgba(238, 242, 255, 0.3)',
    particles: ['rgba(2, 132, 199, 0.5)', 'rgba(14, 165, 233, 0.4)', 'rgba(99, 102, 241, 0.4)', 'rgba(129, 140, 248, 0.3)']
  },
  '/contribute': {
    primary: 'rgba(254, 215, 170, 0.4)',
    secondary: 'rgba(254, 243, 199, 0.4)',
    accent: 'rgba(255, 237, 213, 0.3)',
    particles: ['rgba(234, 88, 12, 0.5)', 'rgba(245, 158, 11, 0.4)', 'rgba(249, 115, 22, 0.4)', 'rgba(251, 191, 36, 0.3)']
  },
  '/verify': {
    primary: 'rgba(204, 251, 241, 0.4)',
    secondary: 'rgba(199, 210, 254, 0.3)',
    accent: 'rgba(224, 231, 255, 0.3)',
    particles: ['rgba(13, 148, 136, 0.5)', 'rgba(79, 70, 229, 0.4)', 'rgba(67, 56, 202, 0.4)', 'rgba(45, 212, 191, 0.3)']
  },
  '/profile': {
    primary: 'rgba(243, 232, 255, 0.4)',
    secondary: 'rgba(250, 232, 255, 0.3)',
    accent: 'rgba(241, 245, 249, 0.3)',
    particles: ['rgba(147, 51, 234, 0.5)', 'rgba(192, 38, 211, 0.4)', 'rgba(124, 58, 237, 0.4)', 'rgba(168, 85, 247, 0.3)']
  },
  '/admin': {
    primary: 'rgba(254, 226, 226, 0.4)',
    secondary: 'rgba(255, 237, 213, 0.3)',
    accent: 'rgba(248, 250, 252, 0.2)',
    particles: ['rgba(220, 38, 38, 0.5)', 'rgba(185, 28, 28, 0.4)', 'rgba(153, 27, 27, 0.4)', 'rgba(239, 68, 68, 0.3)']
  }
}

export function BackgroundDecor() {
  const location = useLocation()

  const currentTheme = useMemo(() => {
    const path = location.pathname
    if (path.startsWith('/spot/')) return themes['/explore']
    return themes[path] || themes['/']
  }, [location.pathname])

  return (
    <div className="bg-decor-wrap" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      <motion.div
        className="floating-shape"
        animate={{ background: currentTheme.primary }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ width: '70vw', height: '70vw', top: '-15%', left: '-10%' }}
      />
      <motion.div
        className="floating-shape"
        animate={{ background: currentTheme.secondary }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        style={{ width: '60vw', height: '60vw', bottom: '10%', right: '-10%', animationDelay: '-3s' }}
      />
      <motion.div
        className="floating-shape"
        animate={{ background: currentTheme.accent }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
        style={{ width: '50vw', height: '50vw', top: '25%', right: '15%', animationDelay: '-7s' }}
      />
      <ParticleCanvas colors={currentTheme.particles} />
    </div>
  )
}

export function ParticleCanvas({ colors }) {
  const canvasRef = React.useRef(null)
  const particlesRef = React.useRef([])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    let width = canvas.width = canvas.offsetWidth
    let height = canvas.height = canvas.offsetHeight

    // Initialize particles if not already done
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        particlesRef.current.push({
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * Math.max(width, height) * 0.9,
          speed: (Math.random() * 0.0008) + 0.0004,
          length: Math.random() * 15 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.2
        })
      }
    }

    let mouseX = width / 2
    let mouseY = height / 2
    let targetMouseX = width / 2
    let targetMouseY = height / 2

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX
      targetMouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      particlesRef.current.forEach((p, idx) => {
        p.angle += p.speed

        // Smoothly transition colors
        const targetColor = colors[idx % colors.length]
        if (p.color !== targetColor) {
          p.color = targetColor // Direct swap for now, canvas renders are frequent
        }

        const dx = (mouseX - width / 2) * (p.radius / width) * 0.25
        const dy = (mouseY - height / 2) * (p.radius / height) * 0.25

        const cx = width / 2 + dx
        const cy = height / 2 + dy

        const x = cx + Math.cos(p.angle) * p.radius
        const y = cy + Math.sin(p.angle) * p.radius

        const x2 = cx + Math.cos(p.angle - 0.015) * (p.radius - p.length)
        const y2 = cy + Math.sin(p.angle - 0.015) * (p.radius - p.length)

        ctx.beginPath()
        ctx.moveTo(x2, y2)
        ctx.lineTo(x, y)
        ctx.strokeStyle = p.color
        ctx.lineWidth = 1.8
        ctx.lineCap = 'round'
        ctx.stroke()
      })

      animationFrameId = requestAnimationFrame(render)
    }
    render()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [colors])

  return <canvas ref={canvasRef} className="ag-canvas" style={{ opacity: 0.8 }} />
}
