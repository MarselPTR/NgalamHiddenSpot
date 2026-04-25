import React from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { SpotlightPanel } from '../components/SpotlightPanel'
import { aestheticMarkerIcon } from '../data/initialData'

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.99, transition: { duration: 0.3, ease: "easeIn" } }
}

const staggerContainer = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const staggerItem = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
}

export function SpotDetailPage({ state }) {
  const { id } = useParams()
  const [isReviewModalOpen, setReviewModalOpen] = React.useState(false)
  const { approvedSpots } = state
  const spot = approvedSpots.find((s) => String(s.id) === id)
  const navigate = useNavigate()
  
  // Sinkronisasi spotId formulir review saat halaman dibuka
  React.useEffect(() => {
    if (spot && state.forms.setReviewForm) {
      state.forms.setReviewForm(prev => ({ ...prev, spotId: spot.id }))
    }
  }, [spot])

  const avgRating = spot && spot.reviews.length > 0
    ? (spot.reviews.reduce((a, r) => a + r.rating, 0) / spot.reviews.length).toFixed(1)
    : null

  if (!spot) {
    return (
      <motion.div className="spot-detail-container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Link to="/explore" className="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Kembali ke Explore
        </Link>
        <div className="empty-state"><h2>Spot tidak ditemukan</h2><p>Maaf, spot yang Anda cari tidak tersedia.</p></div>
      </motion.div>
    )
  }

  return (
    <motion.div className="spot-detail-container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <Link to="/explore" className="btn-back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Kembali ke Explore
      </Link>

      <motion.div className="spot-detail-hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <img src={spot.image} alt={spot.name} className="detail-hero-img" />
        <div className="detail-hero-overlay">
          <h1>{spot.name}</h1>
          <span className="detail-vibe-pill">{spot.vibe}</span>
          <p className="detail-hero-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {spot.area}, Malang
          </p>
          {spot.address && (
            <p className="detail-hero-address">
              {spot.address}
            </p>
          )}
          {avgRating && <div className="detail-hero-rating"><span className="hero-star">★</span> {avgRating} <span className="hero-review-count">({spot.reviews.length} review)</span></div>}
        </div>
      </motion.div>

      <div className="spot-detail-grid">
        <div className="detail-main-col">
          <motion.div className="detail-quick-stats" initial="initial" animate="animate" variants={staggerContainer}>
            {[
              { label: 'Budget', value: `Rp ${spot.budget.toLocaleString('id-ID')}`, cls: 'budget-icon', icon: <><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></> },
              { label: 'WiFi', value: `${spot.wifiMbps} Mbps`, cls: 'wifi-icon', icon: <><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></> },
              { label: 'Colokan', value: `${spot.sockets} Titik`, cls: 'socket-icon', icon: <><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></> },
              { label: 'Jam Buka', value: spot.operationalHours, cls: 'time-icon', icon: <><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></> },
            ].map((s, i) => (
              <motion.div className="detail-stat-card" key={i} variants={staggerItem}>
                <div className={`detail-stat-icon ${s.cls}`}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg></div>
                <div className="detail-stat-text"><span className="detail-stat-label">{s.label}</span><span className="detail-stat-value">{s.value}</span></div>
              </motion.div>
            ))}
          </motion.div>

          <SpotlightPanel className="detail-section-panel">
            <h3 className="detail-section-title"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>Fasilitas Tersedia</h3>
            <div className="facilities-list">{spot.facilities.split(',').map((f, i) => <span key={i} className="facility-chip">{f.trim()}</span>)}</div>
          </SpotlightPanel>

          <SpotlightPanel className="detail-section-panel">
            <h3 className="detail-section-title"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"></path><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path><line x1="6" y1="2" x2="6" y2="4"></line><line x1="10" y1="2" x2="10" y2="4"></line><line x1="14" y1="2" x2="14" y2="4"></line></svg>Rekomendasi Menu</h3>
            <div className="menu-recommendation"><h4>🍽️ Wajib Coba!</h4><p>{spot.menu}</p></div>
          </SpotlightPanel>

          <div className="detail-reviews-section">
            <h3 className="detail-section-title"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>User Reviews ({spot.reviews.length})</h3>
            <div className="detail-reviews-list">
              {spot.reviews.length > 0 ? spot.reviews.map((r) => (
                <motion.div key={r.id} className="detail-review-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                  <div className="review-avatar">{r.userName?.charAt(0).toUpperCase() || '?'}</div>
                  <div className="review-body">
                    <div className="review-header"><span className="review-user">{r.userName}</span><span className="review-rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span></div>
                    <p className="review-text">{r.comment}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="review-empty-state">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b0c4ce" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <p>Belum ada review. Jadilah yang pertama!</p>
                </div>
              )}
            </div>

            {/* TOMBOL MENGAMBANG UNTUK REVIEW */}
            {state.permissions.canPostReview && (
              <motion.button 
                className="fab-review-trigger"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setReviewModalOpen(true)}
                title="Tulis Review"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>Tulis Review</span>
              </motion.button>
            )}

            {/* MODAL REVIEW MENGAMBANG */}
            {isReviewModalOpen && (
              <div className="modal-overlay" onClick={() => setReviewModalOpen(false)}>
                <motion.div 
                  className="modern-review-modal" 
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="modal-close" onClick={() => setReviewModalOpen(false)}>&times;</button>
                  
                  <form onSubmit={(e) => {
                    state.actions.handleSubmitReview(e)
                    setReviewModalOpen(false)
                  }}>
                    <div className="modal-header">
                      <h3>Bagaimana Pengalaman Anda?</h3>
                      <p>Berikan rating dan ulasan singkat untuk spot ini.</p>
                    </div>

                    <div className="review-field">
                      <label>Rating Tempat</label>
                      <div className="rating-select-wrapper">
                        <select 
                          value={state.forms.reviewForm.rating} 
                          onChange={(e) => state.forms.setReviewForm(prev => ({ ...prev, rating: Number(e.target.value), spotId: spot.id }))}
                        >
                          <option value="5">★★★★★ (Sempurna)</option>
                          <option value="4">★★★★☆ (Bagus)</option>
                          <option value="3">★★★☆☆ (Cukup)</option>
                          <option value="2">★★☆☆☆ (Kurang)</option>
                          <option value="1">★☆☆☆☆ (Buruk)</option>
                        </select>
                      </div>
                    </div>

                    <div className="review-field">
                      <label>Ulasan Anda</label>
                      <textarea 
                        placeholder="Tulis pendapat jujur Anda di sini..."
                        value={state.forms.reviewForm.comment}
                        onChange={(e) => state.forms.setReviewForm(prev => ({ ...prev, comment: e.target.value, spotId: spot.id }))}
                        required
                      />
                    </div>

                    <button type="submit" className="submit-review-btn">
                      <span>Kirim Review</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {!state.permissions.canPostReview && (
              <div className="review-locked-info">
                <p>Verifikasi akun Student untuk memberikan ulasan.</p>
              </div>
            )}
          </div>
        </div>

        <div className="detail-side-col">
          <div className="detail-sidebar-sticky">
            <SpotlightPanel className="detail-map-panel" style={{ padding: 0 }}>
              <MapContainer center={[spot.lat, spot.lng]} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution='&copy; OpenStreetMap &copy; CARTO' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <Marker position={[spot.lat, spot.lng]} icon={aestheticMarkerIcon}><Popup>{spot.name}</Popup></Marker>
              </MapContainer>
            </SpotlightPanel>
            <SpotlightPanel className="detail-action-panel">
              <div className="action-panel-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0c8a60' }}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg></div>
              <h3>Lapor Perubahan?</h3>
              <p>Data tidak sesuai? Bantu kami memperbarui informasi spot ini.</p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                state.actions.handleSubmitReport(e);
              }} className="sidebar-report-form">
                <textarea 
                  placeholder="Ceritakan apa yang berubah..."
                  value={state.forms.reportForm.reason}
                  onChange={(e) => state.forms.setReportForm(prev => ({ ...prev, reason: e.target.value, spotId: spot.id }))}
                  required
                />
                <button type="submit" className="btn-report-submit" disabled={!state.permissions.canReport}>
                  Kirim Laporan
                </button>
              </form>
            </SpotlightPanel>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
