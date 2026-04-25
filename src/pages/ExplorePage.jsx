import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { aestheticMarkerIcon } from '../data/initialData'

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.99, transition: { duration: 0.3, ease: "easeIn" } }
}

export function LocationMarker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return <Marker position={position} icon={aestheticMarkerIcon} />
}

export function LocationPickerMap({ lat, lng, onChange }) {
  const position = [lat || -7.9666, lng || 112.6326]

  return (
    <div style={{ position: 'relative', height: '250px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid #b8cad3', marginBottom: '8px', zIndex: 1 }}>
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker position={position} onChange={onChange} />
      </MapContainer>
    </div>
  )
}

export function ExplorePage({ state }) {
  const { filteredSpots, filters } = state
  const { maxBudget, setMaxBudget, minWifi, setMinWifi, minSockets, setMinSockets } = filters
  const navigate = useNavigate()

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <header className="page-header">
        <h1>Explore Hidden Spots</h1>
        <p>Temukan spot berdasarkan kebutuhan WFC dan budget mahasiswa.</p>
      </header>

      <section className="explore-block">
        <div className="filter-controls">
          <label className="filter-pill">
            <div className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              <span>Budget maks</span>
            </div>
            <div className="filter-value">Rp {maxBudget.toLocaleString('id-ID')}</div>
            <input
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={maxBudget}
              onChange={(event) => setMaxBudget(Number(event.target.value))}
            />
          </label>

          <label className="filter-pill">
            <div className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
              <span>Min WiFi</span>
            </div>
            <div className="filter-value">{minWifi} Mbps</div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={minWifi}
              onChange={(event) => setMinWifi(Number(event.target.value))}
            />
          </label>

          <label className="filter-pill">
            <div className="filter-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
              <span>Min Colokan</span>
            </div>
            <div className="filter-value">{minSockets} titik</div>
            <input
              type="range"
              min="2"
              max="24"
              step="1"
              value={minSockets}
              onChange={(event) => setMinSockets(Number(event.target.value))}
            />
          </label>
        </div>

        <motion.div className="spot-grid" layout>
          <AnimatePresence mode="popLayout">
            {filteredSpots.length > 0 ? (
              filteredSpots.map((spot, index) => (
                <motion.article className="spot-card" key={spot.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -20 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24, delay: index * 0.05 }}
                  onClick={() => navigate(`/spot/${spot.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="spot-card-image-wrap">
                    <img className="spot-image" src={spot.image} alt={spot.name} />
                    <div className="spot-card-overlay">
                      <span className="overlay-cta">Lihat Detail →</span>
                    </div>
                    <span className="pill-float">{spot.vibe}</span>
                  </div>
                  <div className="spot-card-body">
                    <h3>{spot.name}</h3>
                    <p className="spot-card-area">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {spot.area}, Malang
                    </p>
                    <div className="spot-card-stats">
                      <div className="stat-chip">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        Rp {spot.budget.toLocaleString('id-ID')}
                      </div>
                      <div className="stat-chip">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                        {spot.wifiMbps} Mbps
                      </div>
                      <div className="stat-chip">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
                        {spot.sockets} titik
                      </div>
                    </div>
                    <div className="spot-card-footer">
                      <span className="review-badge">★ {spot.reviews.length > 0 ? (spot.reviews.reduce((a, r) => a + r.rating, 0) / spot.reviews.length).toFixed(1) : '—'}</span>
                      <span className="review-count">{spot.reviews.length} review</span>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.article className="empty-state" key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <h3>Tidak ada spot sesuai filter</h3>
                <p>Kurangi syarat filter untuk melihat rekomendasi lain.</p>
              </motion.article>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="map-block">
        <header className="page-header" style={{ marginTop: '60px' }}>
          <h1>Live Maps</h1>
          <p>Setiap spot approved langsung tampil sebagai marker di peta.</p>
        </header>
        <MapContainer center={[-7.9666, 112.6326]} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {filteredSpots.map((spot) => (
            <Marker 
              key={spot.id} 
              position={[spot.lat, spot.lng]} 
              icon={aestheticMarkerIcon}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup();
                },
              }}
            >
              <Popup className="aesthetic-map-popup" maxWidth={280} minWidth={240} closeButton={false}>
                <div className="tooltip-content">
                  <div className="tooltip-image" style={{ backgroundImage: `url(${spot.image})` }}></div>
                  <div className="tooltip-details">
                    <h4>{spot.name}</h4>
                    <p className="tooltip-price">Rp {spot.budget.toLocaleString('id-ID')}</p>
                    <Link to={`/spot/${spot.id}`} className="tooltip-link-btn">Lihat Detail</Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </motion.div>
  )
}
