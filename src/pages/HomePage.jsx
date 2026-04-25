import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ParticleCanvas } from '../components/BackgroundDecor'

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.99, transition: { duration: 0.3, ease: "easeIn" } }
}

export function HomePage() {
  const navigate = useNavigate()

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="ag-hero-container">
      <div className="ag-hero-content">
        <motion.div
          className="brand-hero-identity"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="brand-hero-logo-wrap"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/logo.png" alt="Logo" className="brand-hero-logo" />
            <div className="logo-glow-effect"></div>
          </motion.div>
          <div className="brand-hero-text">
            <span className="brand-hero-title">Ngalam Hidden Spot</span>
            <div className="brand-hero-divider"></div>
            <span className="brand-hero-tag">PREMIUM DISCOVERY</span>
          </div>
        </motion.div>

        <h1 className="ag-title">
          Experience liftoff with the next-gen<br />
          spot discovery platform
        </h1>

        <p className="ag-subtitle">
          Temukan kafe tersembunyi, ruang kerja estetik, dan spot WFC terbaik di Malang Raya.<br />
          Diverifikasi oleh mahasiswa, untuk mahasiswa.
        </p>

        <div className="ag-actions">
          <button className="ag-btn ag-btn-dark" onClick={() => navigate('/explore')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
            Explore Maps
          </button>
          <button className="ag-btn ag-btn-light" onClick={() => navigate('/contribute')}>
            Contribute Spot
          </button>
        </div>
      </div>
    </motion.div>
  )
}
