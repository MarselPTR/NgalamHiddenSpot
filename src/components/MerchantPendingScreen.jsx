import React from 'react'
import { motion } from 'framer-motion'

export const MerchantPendingScreen = ({ onBack }) => {
  return (
    <motion.div 
      className="merchant-pending-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="pending-content-card">
        <motion.div 
          className="pending-icon-wrap"
          initial={{ scale: 0.5, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="hologram-circle"></div>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
        </motion.div>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Pendaftaran Berhasil!
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Akun Merchant Anda telah kami terima. Tim Admin akan melakukan verifikasi berkas dan identitas Anda dalam waktu:
        </motion.p>
        
        <motion.div 
          className="countdown-box"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <span className="time-val">2 x 24</span>
          <span className="time-unit">JAM KERJA</span>
        </motion.div>
        
        <motion.p 
          className="pending-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Kami akan menghubungi Anda melalui email atau nomor telepon yang terdaftar jika proses verifikasi selesai.
        </motion.p>
        
        <motion.button 
          className="btn-back-auth"
          onClick={onBack}
          whileHover={{ x: -5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Kembali ke Login
        </motion.button>
      </div>
    </motion.div>
  )
}
