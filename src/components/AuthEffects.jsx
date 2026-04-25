import React, { useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'

export const AuthOrb = ({ index, x, y }) => {
  const tx = useTransform(x, (val) => val * (0.05 + index * 0.02))
  const ty = useTransform(y, (val) => val * (0.05 + index * 0.02))

  return (
    <motion.div
      className="orb"
      animate={{
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{
        duration: 10 + index * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        left: `${5 + index * 12}%`,
        top: `${10 + (index % 4) * 20}%`,
        background: index % 2 === 0
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.6), rgba(12, 138, 96, 0.4))'
          : 'linear-gradient(135deg, rgba(14, 165, 233, 0.5), rgba(2, 132, 199, 0.3))',
        width: `${400 + index * 40}px`,
        height: `${400 + index * 40}px`,
        x: tx,
        y: ty,
      }}
    />
  )
}

const getDeterministicValue = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

export const AuthPixel = ({ index, x }) => {
  const randomLeft = getDeterministicValue(index + 1) * 100
  const randomDuration = 5 + getDeterministicValue(index + 11) * 5
  const randomDelay = getDeterministicValue(index + 21) * 5
  const randomWeight = 0.1 + getDeterministicValue(index + 31) * 0.2
  const randomSize = 4 + getDeterministicValue(index + 41) * 6

  const tx = useTransform(x, (val) => val * randomWeight)

  return (
    <motion.div
      className="pixel"
      initial={{ y: '110vh', opacity: 0 }}
      animate={{ y: '-20vh', opacity: [0, 1, 0] }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        delay: randomDelay,
        ease: "linear",
      }}
      style={{
        left: `${randomLeft}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        background: '#0c8a60',
        x: tx,
      }}
    />
  )
}

export const AuthBackground = ({ mode }) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="auth-background-canvas">
      <AnimatePresence mode="wait">
        {mode === 'login' ? (
          <motion.div
            key="login-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-layer login-layer"
          >
            {[...Array(8)].map((_, i) => (
              <AuthOrb key={i} index={i} x={x} y={y} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="register-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-layer register-layer"
          >
            {[...Array(30)].map((_, i) => (
              <AuthPixel key={i} index={i} x={x} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-noise"></div>
    </div>
  )
}
