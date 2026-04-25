import React from 'react'
import { motion } from 'framer-motion'
import { SpotlightPanel } from '../components/SpotlightPanel'

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

export function VerifyPage({ state }) {
  const { currentUser, approvedSpots, verificationRequests, forms, actions } = state
  
  // Safety check: Pastikan forms sudah ada sebelum destructuring
  if (!forms) return <div className="loading-screen">Memuat formulir...</div>
  
  const { verificationForm, setVerificationForm, merchantVerifyForm, setMerchantVerifyForm } = forms
  
  // Safety check tambahan untuk menghindari crash
  if (!merchantVerifyForm || !verificationForm) return <div className="loading-screen">Menyiapkan data verifikasi...</div>

  const myRequests = (verificationRequests || []).filter(
    (request) => currentUser && request.user_id === currentUser.id,
  )

  return (
    <motion.section className="verification-flow" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <header className="page-header">
        <h1>Pusat Verifikasi Akun</h1>
        <p>Verifikasi identitas mahasiswa atau klaim kepemilikan bisnis Anda.</p>
      </header>

      <motion.div className="verify-steps" variants={staggerContainer} initial="initial" animate="animate">
        <motion.div className="verify-step-card" variants={staggerItem}>
          <div className="step-number">1</div>
          <div className="step-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <h3>Lengkapi Profil</h3>
          <p>Pastikan nama dan nomor kontak Anda sudah sesuai di pengaturan.</p>
        </motion.div>
        <motion.div className="verify-step-card" variants={staggerItem}>
          <div className="step-number">2</div>
          <div className="step-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </div>
          <h3>Kirim Bukti</h3>
          <p>Upload KTM atau link dokumen pendukung bisnis Anda (NIB/Izin).</p>
        </motion.div>
        <motion.div className="verify-step-card" variants={staggerItem}>
          <div className="step-number">3</div>
          <div className="step-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3>Audit Admin</h3>
          <p>Tunggu maksimal 1x24 jam untuk proses review oleh tim kami.</p>
        </motion.div>
      </motion.div>

      <div className="verify-form-grid">
        <div className="verify-forms-col">
          <SpotlightPanel as="form" onSubmit={actions.handleSubmitVerification} className="verify-panel verify-submit-panel">
            <h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Verifikasi Mahasiswa
            </h3>
            <p className="form-subtitle">Dapatkan akses untuk submit spot dan review (KTM/Identitas).</p>
            <div className="verify-form-row">
              <div className="form-field">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  Tipe Dokumen
                </label>
                <select
                  value={verificationForm.docType}
                  onChange={(event) =>
                    setVerificationForm((prev) => ({ ...prev, docType: event.target.value }))
                  }
                >
                  <option value="KTM">KTM (Kartu Tanda Mahasiswa)</option>
                  <option value="KTP">KTP (Kartu Tanda Penduduk)</option>
                  <option value="SIM">SIM (Surat Izin Mengemudi)</option>
                </select>
              </div>
              <div className="form-field">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M7 8h10"></path><path d="M7 12h10"></path><path d="M7 16h10"></path></svg>
                  Nomor Dokumen
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nomor dokumen"
                  value={verificationForm.docNumber}
                  onChange={(event) =>
                    setVerificationForm((prev) => ({ ...prev, docNumber: event.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="form-field">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Foto Dokumen (Upload File)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setVerificationForm((prev) => ({ ...prev, docFile: event.target.files[0] }))
                }
                required
              />
            </div>
            <button type="submit" className="btn btn-primary submit-spot-btn" disabled={!currentUser}>
              Kirim Request Identitas
            </button>
          </SpotlightPanel>

          {(currentUser?.role === 'merchant' || currentUser?.role === 'admin') && (
            <SpotlightPanel as="form" onSubmit={actions.handleSubmitMerchantVerification} className="verify-panel verify-submit-panel merchant-verify-panel">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Verifikasi Merchant
              </h3>
              <p className="form-subtitle">Klaim kepemilikan spot untuk mengelola info operasional & menu.</p>
              <div className="form-field">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Pilih Spot Anda
                </label>
                <select
                  value={merchantVerifyForm.spotId}
                  onChange={(event) =>
                    setMerchantVerifyForm((prev) => ({ ...prev, spotId: event.target.value }))
                  }
                  required
                >
                  <option value="">-- Pilih Spot --</option>
                  {approvedSpots.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Foto Bukti Kepemilikan (NIB / Izin Usaha)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setMerchantVerifyForm((prev) => ({ ...prev, proofFile: event.target.files[0] }))
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Pesan Tambahan
                </label>
                <textarea
                  rows="2"
                  placeholder="Saya adalah manager operasional di sini..."
                  value={merchantVerifyForm.message}
                  onChange={(event) =>
                    setMerchantVerifyForm((prev) => ({ ...prev, message: event.target.value }))
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary submit-spot-btn" style={{ background: 'linear-gradient(135deg, #0f172a, #334155)' }} disabled={!currentUser}>
                Kirim Klaim Merchant
              </button>
            </SpotlightPanel>
          )}
        </div>

        <SpotlightPanel as="article" className="verify-history">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Status Request
          </h3>
          {myRequests.length > 0 ? (
            <div className="verify-history-list">
              {myRequests.map((request) => (
                <div key={request.id} className="verify-history-item">
                  <div className="verify-history-icon">
                    {request.type === 'merchant_claim' ? '🏢' : '👤'}
                  </div>
                  <div className="verify-history-info">
                    <strong>{request.type === 'merchant_claim' ? `Klaim: ${request.spot_name}` : request.doc_type}</strong>
                    <span>{request.type === 'merchant_claim' ? 'Menunggu review dokumen' : request.doc_number}</span>
                  </div>
                  <span className={`verify-status verify-status-${request.status}`}>{request.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="verify-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              <p>Belum ada request verifikasi.</p>
            </div>
          )}
        </SpotlightPanel>
      </div>
    </motion.section>
  )
}
