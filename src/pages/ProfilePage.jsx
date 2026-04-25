import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Navigate } from 'react-router-dom'
import { SpotlightPanel } from '../components/SpotlightPanel'

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.99, transition: { duration: 0.3, ease: "easeIn" } }
}

export function ProfilePage({ state }) {
  const { currentUser, spots = [], verificationRequests = [], reports = [], pendingSpots = [] } = state
  const navigate = useNavigate()
  const [showPhotoInput, setShowPhotoInput] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(currentUser?.profilePic || '')
  const [showSecurity, setShowSecurity] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  if (!currentUser) return <Navigate to="/" replace />

  const userSpots = spots.filter(s => s.owner_id === currentUser.id)
  const userReviews = spots.reduce((acc, spot) => {
    const reviews = (spot.reviews || []).filter(r => r.user_id === currentUser.id)
    return [...acc, ...reviews]
  }, [])

  // MENCARI BISNIS YANG DIKELOLA (Gunakan userSpots sebagai sumber utama)
  const managedSpot = userSpots.length > 0 ? userSpots[0] : null
  const managedSpotRating = managedSpot && managedSpot.reviews && managedSpot.reviews.length > 0
    ? (managedSpot.reviews.reduce((a, b) => a + b.rating, 0) / managedSpot.reviews.length).toFixed(1)
    : 'N/A'
  const pendingMerchantClaim = verificationRequests.find(r => r.user_id === currentUser.id && r.type === 'merchant_claim' && r.status === 'pending')

  const handleUpdatePhoto = (e) => {
    e.preventDefault()
    state.actions.updateUser(currentUser.id, { profilePic: photoUrl })
    setShowPhotoInput(false)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      state.actions.notify('Password minimal 6 karakter.', 'error')
      return
    }
    state.actions.updateUser(currentUser.id, { password: newPassword })
    setNewPassword('')
    setShowSecurity(false)
    state.actions.notify('Password berhasil diubah!', 'success')
  }

  return (
    <motion.div className="pv2-container" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="pv2-header-card">
        <div className="pv2-header-content">
          <div className="pv2-header-left">
            <h1>Account Profile</h1>
            <p>Welcome back, <strong>{currentUser.name}</strong>. Manage your data and preferences.</p>
          </div>
          <div className="pv2-header-stats">
            <div className="pv2-h-stat">
              <span className="pv2-stat-num">{userReviews.length}</span>
              <span className="pv2-stat-label">REVIEWS</span>
            </div>
            <div className="pv2-h-stat">
              <span className="pv2-stat-num">{userSpots.length}</span>
              <span className="pv2-stat-label">SPOTS</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pv2-main-grid">
        <aside className="pv2-sidebar">
          <SpotlightPanel className="pv2-card pv2-id-card">
            <div className="pv2-avatar-section">
              <div className="pv2-avatar-circle">
                {currentUser.profilePic ? (
                  <img src={currentUser.profilePic} alt="Avatar" />
                ) : (
                  <span>{currentUser.name.charAt(0).toUpperCase()}</span>
                )}
                <button className="pv2-photo-btn" onClick={() => setShowPhotoInput(!showPhotoInput)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </button>
              </div>
              <h2 className="pv2-user-name">{currentUser.name}</h2>
              <div className="pv2-badge-row">
                <span className={`pv2-role-badge pv2-role-${currentUser.role}`}>{currentUser.role.toUpperCase()}</span>
                {currentUser.verified && <span className="pv2-verified-check">✓</span>}
              </div>
            </div>

            <AnimatePresence>
              {showPhotoInput && (
                <motion.form 
                  className="pv2-photo-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleUpdatePhoto}
                >
                  <input 
                    type="url" 
                    placeholder="Photo URL..." 
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    required 
                  />
                  <div className="pv2-form-btns">
                    <button type="button" className="pv2-btn-cancel" onClick={() => setShowPhotoInput(false)}>Cancel</button>
                    <button type="submit" className="pv2-btn-save">Save</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="pv2-nav-menu">
              <button className={`pv2-nav-item ${!showSecurity ? 'active' : ''}`} onClick={() => setShowSecurity(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Dashboard
              </button>
              <button className={`pv2-nav-item ${showSecurity ? 'active' : ''}`} onClick={() => setShowSecurity(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Security
              </button>
              <hr />
              <button className="pv2-nav-item logout" onClick={() => state.actions.handleLogout()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </button>
            </div>
          </SpotlightPanel>
        </aside>

        <main className="pv2-content">
          <AnimatePresence mode="wait">
            {showSecurity ? (
              <motion.div key="sec" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <SpotlightPanel className="pv2-card pv2-main-panel">
                  <div className="pv2-panel-head">
                    <h3>Account Security</h3>
                    <p>Update your credentials and contact information.</p>
                  </div>
                  <form className="pv2-sec-form" onSubmit={handleChangePassword}>
                    <div className="pv2-input-group">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="pv2-btn-primary">Update Password</button>
                  </form>

                  <hr className="pv2-divider" />

                  <div className="pv2-panel-head">
                    <h3>Contact Information</h3>
                    <p>Manage how others can contact you.</p>
                  </div>
                  <form className="pv2-sec-form" onSubmit={(e) => {
                    e.preventDefault()
                    state.actions.updateUser(currentUser.id, { phone: e.target.phone.value })
                    state.actions.notify('Nomor telepon diperbarui!', 'success')
                  }}>
                    <div className="pv2-input-group">
                      <label>Phone Number</label>
                      <input 
                        name="phone"
                        type="tel" 
                        defaultValue={currentUser.phone || ''}
                        placeholder="0812xxxx"
                        required
                      />
                    </div>
                    <button type="submit" className="pv2-btn-primary">Update Phone Number</button>
                  </form>

                  {currentUser.role === 'merchant' && (
                    <form className="pv2-sec-form" style={{ marginTop: '20px' }} onSubmit={(e) => {
                      e.preventDefault()
                      state.actions.updateUser(currentUser.id, { nib: e.target.nib.value })
                      state.actions.notify('Nomor NIB berhasil diperbarui!', 'success')
                    }}>
                      <div className="pv2-input-group">
                        <label>Nomor NIB (Induk Berusaha)</label>
                        <input 
                          name="nib"
                          type="text" 
                          defaultValue={currentUser.nib || ''}
                          placeholder="Masukkan 13 digit NIB..."
                          required
                        />
                      </div>
                      <button type="submit" className="pv2-btn-primary">Update NIB</button>
                    </form>
                  )}
                </SpotlightPanel>
              </motion.div>
            ) : (
              <motion.div key="dash" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                {currentUser.role === 'admin' && (
                  <SpotlightPanel className="pv2-card pv2-main-panel">
                    <div className="pv2-panel-head">
                      <h3>Administration Hub</h3>
                      <p>Global system metrics and moderation tools.</p>
                    </div>
                    <div className="pv2-metrics-row">
                      <div className="pv2-metric-item" onClick={() => navigate('/admin')}>
                        <div className="pv2-m-icon orange">!</div>
                        <div className="pv2-m-info">
                          <span className="pv2-m-val">{pendingSpots.length}</span>
                          <span className="pv2-m-lab">Pending Spots</span>
                        </div>
                      </div>
                      <div className="pv2-metric-item" onClick={() => navigate('/admin')}>
                        <div className="pv2-m-icon blue">✓</div>
                        <div className="pv2-m-info">
                          <span className="pv2-m-val">{verificationRequests.filter(r => r.status === 'pending').length}</span>
                          <span className="pv2-m-lab">Verify Requests</span>
                        </div>
                      </div>
                    </div>
                    <button className="pv2-btn-outline full" onClick={() => navigate('/admin')}>Go to Admin Board</button>
                  </SpotlightPanel>
                )}

                {currentUser.role === 'merchant' && (
                  <SpotlightPanel className="pv2-card pv2-main-panel">
                    <div className="pv2-panel-head">
                      <h3>Business Overview</h3>
                      <p>Performance and data of your managed business.</p>
                    </div>
                    
                    {pendingMerchantClaim && (
                      <div className="pv2-status-banner warning">
                        <div className="pv2-sb-icon">⏳</div>
                        <div className="pv2-sb-content">
                          <strong>Request Kepemilikan Sedang Diproses</strong>
                          <p>Klaim Anda untuk spot <strong>{pendingMerchantClaim.spot_name || 'Spot'}</strong> sedang ditinjau oleh admin.</p>
                        </div>
                      </div>
                    )}

                    <div className="pv2-merchant-meta-v2">
                      <div className="pv2-m-meta-item">
                        <span className="pv2-m-meta-label">NIB Number</span>
                        <span className="pv2-m-meta-value">{currentUser.nib || 'N/A'}</span>
                      </div>
                      <div className="pv2-m-meta-item">
                        <span className="pv2-m-meta-label">Phone Contact</span>
                        <span className="pv2-m-meta-value">{currentUser.phone || 'Belum diatur'}</span>
                      </div>
                      <div className="pv2-m-meta-item">
                        <span className="pv2-m-meta-label">Registered Email</span>
                        <span className="pv2-m-meta-value">{currentUser.email}</span>
                      </div>
                    </div>

                    {managedSpot ? (
                      <div className="pv2-managed-spot">
                        <div className="pv2-ms-card">
                          <img src={managedSpot.image} alt={managedSpot.name} />
                          <div className="pv2-ms-info">
                            <h4>{managedSpot.name}</h4>
                            <div className="pv2-ms-rating">★ {managedSpotRating}</div>
                            <button className="pv2-ms-btn" onClick={() => navigate(`/spot/${managedSpot.id}`)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                              View Business Page
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="pv2-no-spot">
                        <p>Anda belum memiliki spot yang terverifikasi.</p>
                        <button className="pv2-btn-primary" onClick={() => navigate('/verify')}>Klaim Kepemilikan Spot</button>
                      </div>
                    )}
                  </SpotlightPanel>
                )}

                <SpotlightPanel className="pv2-card pv2-main-panel activity-panel-v2">
                  <div className="pv2-panel-head">
                    <h3>Your Activity Hub</h3>
                    <p>Track your contributions and interactions across the platform.</p>
                  </div>
                  
                  <div className="pv2-activity-grid">
                    <div className="pv2-activity-card">
                      <div className="pv2-act-visual emerald">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      </div>
                      <div className="pv2-act-info">
                        <span className="count">{userReviews.length}</span>
                        <span className="label">Ulasan Terpublikasi</span>
                        <p>Kontribusi Anda membantu pengguna lain menemukan tempat terbaik.</p>
                      </div>
                    </div>

                    <div className="pv2-activity-card">
                      <div className="pv2-act-visual blue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div className="pv2-act-info">
                        <span className="count">{userSpots.length}</span>
                        <span className="label">Spot Kontribusi</span>
                        <p>Terima kasih telah berbagi permata tersembunyi di Malang.</p>
                      </div>
                    </div>

                    <div className="pv2-activity-card">
                      <div className="pv2-act-visual orange">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      </div>
                      <div className="pv2-act-info">
                        <span className="count">{reports.filter(r => r.reporter_id === currentUser.id).length}</span>
                        <span className="label">Laporan Perubahan</span>
                        <p>Bantuan Anda menjaga akurasi data tetap terjaga.</p>
                      </div>
                    </div>
                  </div>
                </SpotlightPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  )
}
