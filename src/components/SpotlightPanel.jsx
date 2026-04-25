import React from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'

export function SpotlightPanel({ children, className = "", as = "div", ...props }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = React.useState(false)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const Component = as

  return (
    <Component 
      className={`panel ${className}`} 
      onMouseMove={handleMouseMove} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <motion.div
        className="spotlight-glow"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(12, 138, 96, 0.12), transparent 80%)`,
        }}
      />
      <div className="spotlight-content">
        {children}
      </div>
    </Component>
  )
}
