import React from 'react'
import { motion } from 'framer-motion'
import { SpotlightPanel } from '../components/SpotlightPanel'
import { LocationPickerMap } from './ExplorePage'
import { SearchableSelect } from '../components/SearchableSelect'

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.99, transition: { duration: 0.3, ease: "easeIn" } }
}

export function ContributePage({ state }) {
  const { currentUser, approvedSpots, controlledMerchantSpots, forms, actions, permissions } = state
  const {
    newSpot,
    setNewSpot,
    reviewForm,
    setReviewForm,
    reportForm,
    setReportForm,
    merchantEdit,
    setMerchantEdit,
    selectedReviewSpotId,
    selectedReportSpotId,
    selectedMerchantSpotId,
  } = forms

  React.useEffect(() => {
    if (actions.refreshData) actions.refreshData()
  }, [])

  const currentMerchantSpot = controlledMerchantSpots.find((s) => s.id === selectedMerchantSpotId)
  const showMerchantPanel = currentUser?.role === 'merchant' || currentUser?.role === 'admin'

  return (
    <motion.section className="workflow-block" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <header className="page-header">
        <h1>Contribute Workflow</h1>
        <p>Bantu komunitas dengan menambahkan spot baru atau memberikan review jujur.</p>
      </header>
      <div className="workflow-grid">
        <SpotlightPanel as="form" onSubmit={actions.handleSubmitSpot} className="form-panel main-form">
          <div className="form-header">
            <h3>Tambah Spot Baru</h3>
            <p>Admin akan melakukan verifikasi data sebelum spot dipublikasikan.</p>
          </div>
          <div className="form-field">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Nama Tempat
            </label>
            <input
              type="text"
              placeholder="Contoh: Sore Brawijaya"
              value={newSpot.name}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
          <div className="form-group-grid">
            <div className="form-field">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Wilayah
              </label>
              <SearchableSelect
                value={newSpot.area}
                onChange={(val) => setNewSpot((prev) => ({ ...prev, area: val }))}
                placeholder="Cari kecamatan atau wilayah di Malang..."
              />
            </div>
            <div className="form-field">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Alamat Lengkap
              </label>
              <textarea
                placeholder="Sebutkan jalan, nomor, atau patokan lokasinya..."
                value={newSpot.address}
                onChange={(event) => setNewSpot((prev) => ({ ...prev, address: event.target.value }))}
                style={{ minHeight: '80px' }}
                required
              />
            </div>
            <div className="form-field">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                Budget (Rp)
              </label>
              <input
                type="number"
                value={newSpot.budget}
                onChange={(event) => setNewSpot((prev) => ({ ...prev, budget: event.target.value }))}
                required
              />
            </div>
          </div>
          <div className="form-group-grid">
            <div className="form-field">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                WiFi (Mbps)
              </label>
              <input
                type="number"
                value={newSpot.wifiMbps}
                onChange={(event) => setNewSpot((prev) => ({ ...prev, wifiMbps: event.target.value }))}
                required
              />
            </div>
            <div className="form-field">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
                Colokan (Titik)
              </label>
              <input
                type="number"
                value={newSpot.sockets}
                onChange={(event) => setNewSpot((prev) => ({ ...prev, sockets: event.target.value }))}
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              Suasana / Vibe
            </label>
            <input
              type="text"
              placeholder="Contoh: WFC Friendly, Minimalist"
              value={newSpot.vibe}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, vibe: event.target.value }))}
              required
            />
          </div>
          
          <div className="form-field">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><circle cx="12" cy="12" r="12"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Jam Operasional
            </label>
            <input
              type="text"
              placeholder="Contoh: 08:00 - 22:00"
              value={newSpot.operationalHours}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, operationalHours: event.target.value }))}
            />
          </div>

          <div className="form-field">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Fasilitas (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              placeholder="Contoh: Musholla, Parkir Luas, Outdoor Area"
              value={newSpot.facilities}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, facilities: event.target.value }))}
            />
          </div>

          <div className="form-field">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
              Rekomendasi Menu
            </label>
            <textarea
              placeholder="Contoh: Kopi Susu Gula Aren, Mie Goreng Spesial..."
              value={newSpot.menu}
              style={{ minHeight: '80px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, menu: event.target.value }))}
            ></textarea>
          </div>
          <div className="form-field">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>
              Lokasi (Pilih di Peta)
            </label>
            <LocationPickerMap
              lat={newSpot.lat}
              lng={newSpot.lng}
              onChange={(lat, lng) => setNewSpot((prev) => ({ ...prev, lat, lng }))}
            />
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
              <span>Lat: {newSpot.lat.toFixed(4)}</span>
              <span>Lng: {newSpot.lng.toFixed(4)}</span>
            </div>
          </div>
          <div className="form-field">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              Foto Spot (Upload File)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setNewSpot((prev) => ({ ...prev, imageFile: event.target.files[0] }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary submit-spot-btn">
            Daftarkan Spot
          </button>
        </SpotlightPanel>
      </div>

      <div className="workflow-section-divider">
        <div className="divider-line"></div>
        <span className="divider-text">Manajemen Bisnis</span>
      </div>

      <div className="workflow-grid-single">
        {showMerchantPanel && (
          <SpotlightPanel as="form" onSubmit={actions.handleMerchantUpdate} className="form-panel merchant-panel-full">
            <div className="panel-badge">Merchant Tools</div>
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', color: '#0c8a60' }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Merchant Update Spot
            </h3>
            <p className="form-subtitle">Kelola informasi operasional, menu, dan fasilitas bisnis Anda secara real-time.</p>
            
            <div className="form-field">
              <label>Pilih Bisnis Anda</label>
              <select
                value={forms.merchantEdit.spotId}
                onChange={(e) => actions.handleSelectMerchantSpot(e.target.value)}
                disabled={currentUser.role === 'merchant'}
                required
              >
                <option value="">-- Pilih Bisnis Anda --</option>
                {controlledMerchantSpots.map((spot) => (
                  <option key={spot.id} value={spot.id}>
                    {spot.name} {spot.status === 'pending' ? '(Draft)' : ''}
                  </option>
                ))}
              </select>
              {currentUser.role === 'merchant' && (
                <p className="input-hint" style={{ fontSize: '12px', marginTop: '4px', color: '#0c8a60', opacity: 0.8 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Akses dikunci otomatis ke bisnis terverifikasi Anda.
                </p>
              )}
            </div>

            <div className="form-field">
              <label>Update Jam Operasional</label>
              <input
                type="text"
                placeholder="Contoh: 08:00 - 22:00"
                value={merchantEdit.operationalHours}
                onChange={(event) => setMerchantEdit((prev) => ({ ...prev, operationalHours: event.target.value }))}
              />
            </div>

            <div className="form-group-grid-row">
              <div className="form-field">
                <label>Update WiFi (Mbps)</label>
                <input
                  type="number"
                  value={merchantEdit.wifiMbps}
                  onChange={(e) => setMerchantEdit({ ...merchantEdit, wifiMbps: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Update Colokan (Titik)</label>
                <input
                  type="number"
                  value={merchantEdit.sockets}
                  onChange={(e) => setMerchantEdit({ ...merchantEdit, sockets: e.target.value })}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Ganti Foto Spot</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMerchantEdit({ ...merchantEdit, imageFile: e.target.files[0] })}
                />
                <p className="form-help-text">Unggah foto terbaru untuk menarik lebih banyak pengunjung.</p>
              </div>
            </div>

            <div className="form-field">
              <label>Update Fasilitas Utama</label>
              <input
                type="text"
                placeholder="Contoh: WiFi Kencang, Musholla, Parkir Luas"
                value={merchantEdit.facilities}
                onChange={(event) => setMerchantEdit((prev) => ({ ...prev, facilities: event.target.value }))}
              />
            </div>

            <div className="form-field">
              <label>Update Rekomendasi Menu</label>
              <textarea
                rows="4"
                placeholder="Sebutkan menu andalan Anda di sini..."
                value={merchantEdit.menu}
                onChange={(event) => setMerchantEdit((prev) => ({ ...prev, menu: event.target.value }))}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              Simpan Perubahan Data Bisnis
            </button>
          </SpotlightPanel>
        )}
      </div>

      <div className="feature-strip" style={{ marginTop: '48px' }}>
        <article>
          <h3>Verified Data</h3>
          <p>Setiap spot melewati proses moderasi manual oleh tim Admin.</p>
        </article>
        <article>
          <h3>Student First</h3>
          <p>Fokus pada kebutuhan nugas: WiFi kencang dan banyak colokan.</p>
        </article>
        <article>
          <h3>Community Driven</h3>
          <p>Ribuan mahasiswa Malang saling berbagi spot tersembunyi.</p>
        </article>
      </div>
    </motion.section>
  )
}
