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

export function AdminPage({ state }) {
  const { users, pendingSpots, verificationRequests, reports, actions } = state
  const pendingMerchantAccounts = users ? users.filter(u => u.status === 'pending_approval') : []

  return (
    <motion.section
      className="adm-v2-container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <header className="adm-v2-header">
        <div className="adm-v2-title-section">
          <h1>Admin Board</h1>
          <p>Global moderation hub for <strong>Ngalam Hidden Spot</strong>.</p>
        </div>
        <div className="adm-v2-stats-row">
          <div className="adm-v2-stat-pill">
            <span className="val">{users.length}</span>
            <span className="lab">Users</span>
          </div>
          <div className="adm-v2-stat-pill">
            <span className="val">{pendingSpots.length + pendingMerchantAccounts.length + verificationRequests.filter(r => r.status === 'pending').length}</span>
            <span className="lab">Total Tasks</span>
          </div>
        </div>
      </header>

      <motion.div className="adm-v2-grid" variants={staggerContainer} initial="initial" animate="animate">
        {/* 1. MERCHANT APPROVALS */}
        <SpotlightPanel as={motion.article} variants={staggerItem} className="adm-v2-card">
          <div className="adm-v2-card-head">
            <div className="adm-v2-card-title">
              <div className="adm-v2-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
              </div>
              <h3>Persetujuan Merchant</h3>
            </div>
            <span className="adm-v2-badge">{pendingMerchantAccounts.length} Pending</span>
          </div>
          <div className="adm-v2-content">
            {pendingMerchantAccounts.length > 0 ? (
              <ul className="adm-v2-list">
                {pendingMerchantAccounts.map((user) => (
                  <li key={user.id} className="adm-v2-item">
                    <div className="adm-v2-info">
                      <strong>{user.name}</strong>
                      <span className="sub">{user.email}</span>
                      {user.nib && <div className="adm-v2-nib-pill">NIB: <span>{user.nib}</span></div>}
                    </div>
                    <div className="adm-v2-actions">
                      <button className="adm-v2-btn reject" onClick={() => actions.rejectMerchantAccount(user.id)}>Tolak</button>
                      <button className="adm-v2-btn approve" onClick={() => actions.approveMerchantAccount(user.id)}>Setujui</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="adm-v2-empty">
                <div className="adm-v2-empty-icon">☕</div>
                <p>Semua pendaftaran sudah diproses.</p>
              </div>
            )}
          </div>
        </SpotlightPanel>

        {/* 2. PENDING SPOTS */}
        <SpotlightPanel as={motion.article} variants={staggerItem} className="adm-v2-card">
          <div className="adm-v2-card-head">
            <div className="adm-v2-card-title">
              <div className="adm-v2-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3>Moderasi Spot</h3>
            </div>
            <span className="adm-v2-badge">{pendingSpots.length} New</span>
          </div>
          <div className="adm-v2-content">
            {pendingSpots.length > 0 ? (
              <ul className="adm-v2-list">
                {pendingSpots.map((spot) => (
                  <li key={spot.id} className="adm-v2-item">
                    <div className="adm-v2-info">
                      <strong>{spot.name}</strong>
                      <span className="sub">{spot.area} • {spot.vibe}</span>
                    </div>
                    <div className="adm-v2-actions">
                      <button className="adm-v2-btn reject" onClick={() => actions.rejectSpot(spot.id)}>Reject</button>
                      <button className="adm-v2-btn approve" onClick={() => actions.approveSpot(spot.id)}>Approve</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="adm-v2-empty">
                <div className="adm-v2-empty-icon">📍</div>
                <p>Tidak ada spot yang menunggu review.</p>
              </div>
            )}
          </div>
        </SpotlightPanel>

        {/* 3. USER VERIFICATION (IDENTITY & CLAIMS) */}
        <SpotlightPanel as={motion.article} variants={staggerItem} className="adm-v2-card">
          <div className="adm-v2-card-head">
            <div className="adm-v2-card-title">
              <div className="adm-v2-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h3>Verifikasi Identitas</h3>
            </div>
            <span className="adm-v2-badge">{verificationRequests.filter(r => r.status === 'pending').length} Req</span>
          </div>
          <div className="adm-v2-content">
            {verificationRequests.some(r => r.status === 'pending') ? (
              <ul className="adm-v2-list">
                {verificationRequests.filter(r => r.status === 'pending').map((request) => (
                  <li key={request.id} className="adm-v2-item">
                    <div className="adm-v2-info">
                      <strong>{request.user_name} <span className={`adm-v2-request-type ${request.type}`}>{request.type === 'merchant_claim' ? 'Claim' : 'ID'}</span></strong>
                      {request.type === 'merchant_claim' ? (
                        <span className="sub">Klaim: {request.spot_name}</span>
                      ) : (
                        <span className="sub">{request.doc_type}: {request.doc_number}</span>
                      )}
                      {request.proof_url && (
                        <a href={request.proof_url} target="_blank" rel="noopener noreferrer" className="adm-v2-proof-link">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                          Lihat Bukti
                        </a>
                      )}
                    </div>
                    <div className="adm-v2-actions">
                      <button className="adm-v2-btn reject" onClick={() => actions.rejectVerification(request.id)}>Reject</button>
                      <button className="adm-v2-btn approve" onClick={() => actions.approveVerification(request.id, request.user_id)}>Verify</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="adm-v2-empty">
                <div className="adm-v2-empty-icon">🆔</div>
                <p>Antrean verifikasi kosong.</p>
              </div>
            )}
          </div>
        </SpotlightPanel>

        {/* 4. DATA REPORTS */}
        <SpotlightPanel as={motion.article} variants={staggerItem} className="adm-v2-card">
          <div className="adm-v2-card-head">
            <div className="adm-v2-card-title">
              <div className="adm-v2-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h3>Laporan User</h3>
            </div>
            <span className="adm-v2-badge">{reports.filter(r => r.status === 'open').length} Issue</span>
          </div>
          <div className="adm-v2-content">
            {reports.some(r => r.status === 'open') ? (
              <ul className="adm-v2-list">
                {reports.filter(r => r.status === 'open').map((report) => (
                  <li key={report.id} className="adm-v2-item">
                    <div className="adm-v2-info">
                      <strong>{report.spot_name || 'Spot Terlapor'}</strong>
                      <span className="sub">{report.reason}</span>
                    </div>
                    <div className="adm-v2-actions">
                      <button className="adm-v2-btn approve" onClick={() => actions.resolveReport(report.id)}>Resolve</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="adm-v2-empty">
                <div className="adm-v2-empty-icon">🛡️</div>
                <p>Sistem dalam kondisi aman & akurat.</p>
              </div>
            )}
          </div>
        </SpotlightPanel>
      </motion.div>
    </motion.section>
  )
}
