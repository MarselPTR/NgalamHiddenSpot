import { useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import './App.css'

const initialUsers = [
  { id: 1, name: 'Admin NHS', role: 'admin', verified: true, password: 'admin123' },
  { id: 2, name: 'Marsel', role: 'student', verified: true, password: 'marsel123' },
  {
    id: 3,
    name: 'Merchant Mie Gacoan',
    role: 'merchant',
    verified: true,
    password: 'merchant123',
  },
]

const initialSpots = [
  {
    id: 1,
    name: 'Teras Tlogomas',
    area: 'Lowokwaru',
    budget: 12000,
    wifiMbps: 45,
    sockets: 14,
    vibe: 'WFC Friendly',
    status: 'approved',
    lat: -7.9445,
    lng: 112.6058,
    image:
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80',
    ownerId: 3,
    menu: 'Es Teh, Kopi Susu, Roti Bakar',
    facilities: 'WiFi Cepat, Smoking Area, Toilet',
    operationalHours: '10:00 - 23:00',
    reviews: [{ id: 1, userName: 'Marsel', rating: 5, comment: 'WiFi stabil banget buat nugas.' }],
  },
  {
    id: 2,
    name: 'Sore Brawijaya Corner',
    area: 'Sumbersari',
    budget: 18000,
    wifiMbps: 25,
    sockets: 8,
    vibe: 'Coffee & Study',
    status: 'approved',
    lat: -7.9537,
    lng: 112.6148,
    image:
      'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=80',
    ownerId: 3,
    menu: 'Americano, Croffle, Kentang',
    facilities: 'Indoor AC, WiFi, Parkir Motor',
    operationalHours: '09:00 - 22:00',
    reviews: [],
  },
  {
    id: 3,
    name: 'Kebun Kota Spot',
    area: 'Klojen',
    budget: 10000,
    wifiMbps: 30,
    sockets: 10,
    vibe: 'Outdoor Chill',
    status: 'approved',
    lat: -7.9813,
    lng: 112.6304,
    image:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80',
    ownerId: 3,
    menu: 'Mie, Nasi Goreng, Teh Tarik',
    facilities: 'Taman, Colokan Outdoor, Mushola',
    operationalHours: '08:00 - 21:00',
    reviews: [],
  },
  {
    id: 4,
    name: 'Suhu Malam Space',
    area: 'Dinoyo',
    budget: 14000,
    wifiMbps: 60,
    sockets: 20,
    vibe: 'Night Productive',
    status: 'approved',
    lat: -7.9368,
    lng: 112.6072,
    image:
      'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?auto=format&fit=crop&w=900&q=80',
    ownerId: 3,
    menu: 'Kopi Gula Aren, Chicken Pop, Nasi Ayam',
    facilities: '24 jam, WiFi, Ruang Diskusi',
    operationalHours: '16:00 - 02:00',
    reviews: [],
  },
]

function App() {
  const [users, setUsers] = useState(initialUsers)
  const [spots, setSpots] = useState(initialSpots)
  const [reports, setReports] = useState([])
  const [verificationRequests, setVerificationRequests] = useState([])
  const [activeUserId, setActiveUserId] = useState(null)

  const [authMode, setAuthMode] = useState('login')
  const [loginName, setLoginName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginRole, setLoginRole] = useState('student')

  const [maxBudget, setMaxBudget] = useState(15000)
  const [minWifi, setMinWifi] = useState(20)
  const [minSockets, setMinSockets] = useState(6)

  const [newSpot, setNewSpot] = useState({
    name: '',
    area: '',
    budget: 10000,
    wifiMbps: 20,
    sockets: 4,
    vibe: '',
    lat: -7.9666,
    lng: 112.6326,
    image: '',
    menu: '',
    facilities: '',
    operationalHours: '',
  })

  const [verificationForm, setVerificationForm] = useState({ docType: 'KTM', docNumber: '' })
  const [reviewForm, setReviewForm] = useState({ spotId: 1, rating: 5, comment: '' })
  const [reportForm, setReportForm] = useState({ spotId: 1, reason: '' })
  const [merchantEdit, setMerchantEdit] = useState({
    spotId: 1,
    menu: '',
    facilities: '',
    operationalHours: '',
  })

  const currentUser = users.find((user) => user.id === activeUserId) ?? null
  const approvedSpots = useMemo(() => spots.filter((spot) => spot.status === 'approved'), [spots])

  const filteredSpots = useMemo(
    () =>
      approvedSpots.filter(
        (spot) =>
          spot.budget <= maxBudget && spot.wifiMbps >= minWifi && spot.sockets >= minSockets,
      ),
    [approvedSpots, maxBudget, minWifi, minSockets],
  )

  const canSubmitSpot =
    currentUser &&
    (currentUser.role === 'admin' ||
      currentUser.role === 'merchant' ||
      (currentUser.role === 'student' && currentUser.verified === true))
  const canPostReview = currentUser && (currentUser.role === 'admin' || currentUser.verified)
  const canReport = currentUser && (currentUser.role === 'admin' || currentUser.verified)
  const canUseMerchantPanel = currentUser && ['merchant', 'admin'].includes(currentUser.role)
  const canUseAdminPanel = currentUser && currentUser.role === 'admin'

  const pendingSpots = spots.filter((spot) => spot.status === 'pending')
  const controlledMerchantSpots = spots.filter((spot) => {
    if (!currentUser) return false
    if (currentUser.role === 'admin') return true
    return spot.ownerId === currentUser.id
  })

  const selectedReviewSpotId = approvedSpots.some((spot) => spot.id === reviewForm.spotId)
    ? reviewForm.spotId
    : approvedSpots[0]?.id
  const selectedReportSpotId = approvedSpots.some((spot) => spot.id === reportForm.spotId)
    ? reportForm.spotId
    : approvedSpots[0]?.id
  const selectedMerchantSpotId = controlledMerchantSpots.some(
    (spot) => spot.id === merchantEdit.spotId,
  )
    ? merchantEdit.spotId
    : controlledMerchantSpots[0]?.id

  const handleLogin = (event) => {
    event.preventDefault()
    const cleanName = loginName.trim()
    const cleanPassword = loginPassword.trim()
    if (!cleanName || !cleanPassword) return

    const existing = users.find((user) => user.name.toLowerCase() === cleanName.toLowerCase())

    if (authMode === 'login') {
      if (!existing) {
        window.alert('Akun tidak ditemukan. Gunakan mode Register jika belum punya akun.')
        return
      }
      if (existing.password !== cleanPassword) {
        window.alert('Password salah.')
        return
      }
      setActiveUserId(existing.id)
      setLoginName('')
      setLoginPassword('')
      return
    }

    if (existing) {
      window.alert('Nama akun sudah terdaftar. Silakan login.')
      return
    }

    const newUser = {
      id: Date.now(),
      name: cleanName,
      role: loginRole,
      verified: loginRole === 'merchant',
      password: cleanPassword,
    }
    setUsers((prev) => [...prev, newUser])
    setActiveUserId(newUser.id)
    setLoginName('')
    setLoginPassword('')
  }

  const handleLogout = () => {
    setActiveUserId(null)
    setAuthMode('login')
    setLoginName('')
    setLoginPassword('')
  }

  const handleSubmitSpot = (event) => {
    event.preventDefault()
    if (!currentUser || !canSubmitSpot) {
      window.alert('Student wajib verifikasi identitas terlebih dulu sebelum submit spot.')
      return
    }

    const spot = {
      id: Date.now(),
      ...newSpot,
      budget: Number(newSpot.budget),
      wifiMbps: Number(newSpot.wifiMbps),
      sockets: Number(newSpot.sockets),
      lat: Number(newSpot.lat),
      lng: Number(newSpot.lng),
      image:
        newSpot.image ||
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
      ownerId: currentUser.id,
      status: currentUser.role === 'admin' ? 'approved' : 'pending',
      reviews: [],
    }

    setSpots((prev) => [...prev, spot])
    setNewSpot({
      name: '',
      area: '',
      budget: 10000,
      wifiMbps: 20,
      sockets: 4,
      vibe: '',
      lat: -7.9666,
      lng: 112.6326,
      image: '',
      menu: '',
      facilities: '',
      operationalHours: '',
    })
  }

  const handleSubmitVerification = (event) => {
    event.preventDefault()
    if (!currentUser) return

    setVerificationRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        docType: verificationForm.docType,
        docNumber: verificationForm.docNumber,
        status: 'pending',
      },
    ])
    setVerificationForm({ docType: 'KTM', docNumber: '' })
  }

  const handleSubmitReview = (event) => {
    event.preventDefault()
    if (!currentUser || !canPostReview) return

    setSpots((prev) =>
      prev.map((spot) => {
        if (spot.id !== Number(reviewForm.spotId)) return spot
        return {
          ...spot,
          reviews: [
            ...spot.reviews,
            {
              id: Date.now(),
              userName: currentUser.name,
              rating: Number(reviewForm.rating),
              comment: reviewForm.comment,
            },
          ],
        }
      }),
    )

    setReviewForm((prev) => ({ ...prev, comment: '' }))
  }

  const handleSubmitReport = (event) => {
    event.preventDefault()
    if (!currentUser || !canReport) return

    const targetSpot = spots.find((spot) => spot.id === Number(reportForm.spotId))
    if (!targetSpot) return

    setReports((prev) => [
      ...prev,
      {
        id: Date.now(),
        spotId: targetSpot.id,
        spotName: targetSpot.name,
        reporterName: currentUser.name,
        reason: reportForm.reason,
        status: 'open',
      },
    ])

    setReportForm((prev) => ({ ...prev, reason: '' }))
  }

  const handleMerchantUpdate = (event) => {
    event.preventDefault()
    const targetId = Number(merchantEdit.spotId)
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === targetId
          ? {
              ...spot,
              menu: merchantEdit.menu || spot.menu,
              facilities: merchantEdit.facilities || spot.facilities,
              operationalHours: merchantEdit.operationalHours || spot.operationalHours,
            }
          : spot,
      ),
    )
  }

  const approveVerification = (requestId, userId) => {
    setVerificationRequests((prev) =>
      prev.map((item) => (item.id === requestId ? { ...item, status: 'approved' } : item)),
    )
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, verified: true } : user)))
  }

  const rejectVerification = (requestId) => {
    setVerificationRequests((prev) =>
      prev.map((item) => (item.id === requestId ? { ...item, status: 'rejected' } : item)),
    )
  }

  const approveSpot = (spotId) => {
    setSpots((prev) =>
      prev.map((spot) => (spot.id === spotId ? { ...spot, status: 'approved' } : spot)),
    )
  }

  const rejectSpot = (spotId) => {
    setSpots((prev) => prev.filter((spot) => spot.id !== spotId))
  }

  const resolveReport = (reportId) => {
    setReports((prev) =>
      prev.map((item) => (item.id === reportId ? { ...item, status: 'resolved' } : item)),
    )
  }

  const removeReview = (spotId, reviewId) => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === spotId
          ? { ...spot, reviews: spot.reviews.filter((review) => review.id !== reviewId) }
          : spot,
      ),
    )
  }

  if (!currentUser) {
    return (
      <section className="auth-gate">
        <article className="auth-card">
          <p className="badge">Ngalam Hidden Spot</p>
          <h1>Masuk ke Dashboard</h1>
          <p className="lead">
            Login terlebih dulu untuk mengakses fitur explore, kontribusi, dan moderasi.
          </p>

          <div className="mode-switch">
            <button
              type="button"
              className={`chip ${authMode === 'login' ? 'chip-active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`chip ${authMode === 'register' ? 'chip-active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>

          <form className="gate-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Nama akun"
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              required
            />
            {authMode === 'register' ? (
              <select value={loginRole} onChange={(event) => setLoginRole(event.target.value)}>
                <option value="general">General User</option>
                <option value="student">Malang Student</option>
                <option value="merchant">Merchant</option>
              </select>
            ) : null}
            <button type="submit" className="btn btn-primary">
              {authMode === 'login' ? 'Masuk' : 'Daftar dan Masuk'}
            </button>
          </form>

          <div className="demo-credentials">
            <h3>Akun Demo</h3>
            <ul>
              <li>Admin NHS / admin123</li>
              <li>Marsel / marsel123</li>
              <li>Merchant Mie Gacoan / merchant123</li>
            </ul>
          </div>
        </article>
      </section>
    )
  }

  const appState = {
    currentUser,
    approvedSpots,
    filteredSpots,
    reports,
    verificationRequests,
    pendingSpots,
    controlledMerchantSpots,
    filters: { maxBudget, setMaxBudget, minWifi, setMinWifi, minSockets, setMinSockets },
    forms: {
      newSpot,
      setNewSpot,
      verificationForm,
      setVerificationForm,
      reviewForm,
      setReviewForm,
      reportForm,
      setReportForm,
      merchantEdit,
      setMerchantEdit,
      selectedReviewSpotId,
      selectedReportSpotId,
      selectedMerchantSpotId,
    },
    permissions: { canSubmitSpot, canPostReview, canReport, canUseMerchantPanel, canUseAdminPanel },
    actions: {
      handleLogout,
      handleSubmitSpot,
      handleSubmitVerification,
      handleSubmitReview,
      handleSubmitReport,
      handleMerchantUpdate,
      approveVerification,
      rejectVerification,
      approveSpot,
      rejectSpot,
      resolveReport,
      removeReview,
    },
  }

  return (
    <BrowserRouter>
      <div className="page-shell">
        <header className="topbar">
          <div className="brand-wrap">
            <div className="brand-mark">NHS</div>
            <div>
              <p className="brand-title">Ngalam Hidden Spot</p>
              <p className="brand-subtitle">Student-Verified Local Discovery</p>
            </div>
          </div>
          <div className="topbar-right">
            <p className="active-user-inline">
              {currentUser.name} ({currentUser.role})
            </p>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <header className="topbar nav-only">
          <nav className="topnav">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/contribute">Contribute</NavLink>
            <NavLink to="/verify">Verify</NavLink>
            {canUseAdminPanel ? <NavLink to="/admin">Admin</NavLink> : null}
          </nav>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage state={appState} />} />
            <Route path="/contribute" element={<ContributePage state={appState} />} />
            <Route path="/verify" element={<VerifyPage state={appState} />} />
            <Route
              path="/admin"
              element={canUseAdminPanel ? <AdminPage state={appState} /> : <Navigate to="/" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="footer-note">
          <p>DP7 Build Track • Multi-page Professional MVP</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

function HomePage() {
  return (
    <>
      <section className="hero-wrap">
        <div className="hero-copy">
          <p className="badge">Niche Product for Malang Raya</p>
          <h1>Platform rekomendasi hidden spot dengan kualitas data yang terjaga.</h1>
          <p className="lead">
            Website ini memisahkan alur eksplorasi, kontribusi komunitas, verifikasi identitas,
            dan panel admin agar operasional terasa profesional seperti produk production-ready.
          </p>
        </div>
        <aside className="hero-panel">
          <h2>Aspek Kualitas DP6</h2>
          <ul>
            <li>UI ringan dan responsif</li>
            <li>Integritas data lewat verified workflow</li>
            <li>Cakupan lokal fokus Malang Raya</li>
          </ul>
          <div className="mini-grid">
            <article>
              <p className="kpi">Explore</p>
              <span>Maps + filter mahasiswa</span>
            </article>
            <article>
              <p className="kpi">Contribute</p>
              <span>Spot, review, report, merchant update</span>
            </article>
            <article>
              <p className="kpi">Admin</p>
              <span>Moderasi spot, user, report</span>
            </article>
          </div>
        </aside>
      </section>

      <section className="feature-strip">
        <article>
          <h3>Explore Page</h3>
          <p>Spot cards, review ringkas, dan live maps marker.</p>
        </article>
        <article>
          <h3>Contribute Page</h3>
          <p>Semua form kontribusi dipisah agar alur user jelas.</p>
        </article>
        <article>
          <h3>Admin Page</h3>
          <p>Hanya tampil untuk role admin, termasuk guard URL.</p>
        </article>
      </section>
    </>
  )
}

function ExplorePage({ state }) {
  const { filteredSpots, filters, permissions, actions } = state
  const { maxBudget, setMaxBudget, minWifi, setMinWifi, minSockets, setMinSockets } = filters

  return (
    <>
      <section className="explore-block">
        <div className="explore-head">
          <h2>Explore Hidden Spots</h2>
          <p>Temukan spot berdasarkan kebutuhan WFC dan budget mahasiswa.</p>
        </div>

        <div className="filter-controls">
          <label>
            Budget maksimum: Rp {maxBudget.toLocaleString('id-ID')}
            <input
              type="range"
              min="10000"
              max="25000"
              step="1000"
              value={maxBudget}
              onChange={(event) => setMaxBudget(Number(event.target.value))}
            />
          </label>

          <label>
            Minimal WiFi: {minWifi} Mbps
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={minWifi}
              onChange={(event) => setMinWifi(Number(event.target.value))}
            />
          </label>

          <label>
            Minimal Colokan: {minSockets} titik
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

        <div className="spot-grid">
          {filteredSpots.length > 0 ? (
            filteredSpots.map((spot) => (
              <article className="spot-card" key={spot.id}>
                <img className="spot-image" src={spot.image} alt={spot.name} />
                <p className="pill">{spot.vibe}</p>
                <h3>{spot.name}</h3>
                <p>{spot.area}, Malang</p>
                <ul>
                  <li>Budget: Rp {spot.budget.toLocaleString('id-ID')}</li>
                  <li>WiFi: {spot.wifiMbps} Mbps</li>
                  <li>Colokan: {spot.sockets} titik</li>
                  <li>Jam: {spot.operationalHours}</li>
                </ul>

                <details>
                  <summary>Review ({spot.reviews.length})</summary>
                  {spot.reviews.length > 0 ? (
                    <ul className="review-list">
                      {spot.reviews.map((review) => (
                        <li key={review.id}>
                          <strong>{review.userName}</strong> ({review.rating}/5): {review.comment}
                          {permissions.canUseAdminPanel ? (
                            <button
                              type="button"
                              className="inline-btn"
                              onClick={() => actions.removeReview(spot.id, review.id)}
                            >
                              Hapus
                            </button>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Belum ada review.</p>
                  )}
                </details>
              </article>
            ))
          ) : (
            <article className="empty-state">
              <h3>Tidak ada spot sesuai filter</h3>
              <p>Kurangi syarat filter untuk melihat rekomendasi lain.</p>
            </article>
          )}
        </div>
      </section>

      <section className="map-block">
        <div className="explore-head">
          <h2>Live Maps</h2>
          <p>Setiap spot approved langsung tampil sebagai marker di peta.</p>
        </div>
        <MapContainer center={[-7.9666, 112.6326]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredSpots.map((spot) => (
            <Marker key={spot.id} position={[spot.lat, spot.lng]}>
              <Popup>
                <strong>{spot.name}</strong>
                <br />
                {spot.area} - Rp {spot.budget.toLocaleString('id-ID')}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </>
  )
}

function ContributePage({ state }) {
  const { approvedSpots, controlledMerchantSpots, forms, actions, permissions } = state
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

  return (
    <section className="workflow-block">
      <h2>Contribute Workflow</h2>
      <div className="workflow-grid">
        <form onSubmit={actions.handleSubmitSpot} className="panel">
          <h3>Tambah Hidden Spot</h3>
          <p>Student wajib verified. Merchant dan Admin bisa submit langsung.</p>
          <input
            type="text"
            placeholder="Nama spot"
            value={newSpot.name}
            onChange={(event) => setNewSpot((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Area"
            value={newSpot.area}
            onChange={(event) => setNewSpot((prev) => ({ ...prev, area: event.target.value }))}
            required
          />
          <div className="form-row-3">
            <input
              type="number"
              placeholder="Budget"
              value={newSpot.budget}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, budget: event.target.value }))}
            />
            <input
              type="number"
              placeholder="WiFi Mbps"
              value={newSpot.wifiMbps}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, wifiMbps: event.target.value }))}
            />
            <input
              type="number"
              placeholder="Colokan"
              value={newSpot.sockets}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, sockets: event.target.value }))}
            />
          </div>
          <input
            type="text"
            placeholder="Vibe"
            value={newSpot.vibe}
            onChange={(event) => setNewSpot((prev) => ({ ...prev, vibe: event.target.value }))}
          />
          <input
            type="text"
            placeholder="Link gambar spot"
            value={newSpot.image}
            onChange={(event) => setNewSpot((prev) => ({ ...prev, image: event.target.value }))}
          />
          <div className="form-row-2">
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude"
              value={newSpot.lat}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, lat: event.target.value }))}
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude"
              value={newSpot.lng}
              onChange={(event) => setNewSpot((prev) => ({ ...prev, lng: event.target.value }))}
            />
          </div>
          <input
            type="text"
            placeholder="Menu"
            value={newSpot.menu}
            onChange={(event) => setNewSpot((prev) => ({ ...prev, menu: event.target.value }))}
          />
          <input
            type="text"
            placeholder="Fasilitas"
            value={newSpot.facilities}
            onChange={(event) => setNewSpot((prev) => ({ ...prev, facilities: event.target.value }))}
          />
          <input
            type="text"
            placeholder="Jam operasional"
            value={newSpot.operationalHours}
            onChange={(event) =>
              setNewSpot((prev) => ({ ...prev, operationalHours: event.target.value }))
            }
          />
          <button type="submit" className="btn btn-primary" disabled={!permissions.canSubmitSpot}>
            Submit Spot
          </button>
        </form>

        <form onSubmit={actions.handleSubmitReview} className="panel">
          <h3>Post Verified Review</h3>
          <p>Hanya akun verified atau admin.</p>
          <select
            value={selectedReviewSpotId ?? ''}
            onChange={(event) =>
              setReviewForm((prev) => ({ ...prev, spotId: Number(event.target.value) }))
            }
            disabled={approvedSpots.length === 0}
          >
            {approvedSpots.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.name}
              </option>
            ))}
          </select>
          <select
            value={reviewForm.rating}
            onChange={(event) =>
              setReviewForm((prev) => ({ ...prev, rating: Number(event.target.value) }))
            }
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <textarea
            rows="3"
            placeholder="Tulis review"
            value={reviewForm.comment}
            onChange={(event) => setReviewForm((prev) => ({ ...prev, comment: event.target.value }))}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={!permissions.canPostReview}>
            Kirim Review
          </button>
        </form>

        <form onSubmit={actions.handleSubmitReport} className="panel">
          <h3>Report Outdated Information</h3>
          <p>Laporkan data usang untuk diproses admin.</p>
          <select
            value={selectedReportSpotId ?? ''}
            onChange={(event) =>
              setReportForm((prev) => ({ ...prev, spotId: Number(event.target.value) }))
            }
            disabled={approvedSpots.length === 0}
          >
            {approvedSpots.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.name}
              </option>
            ))}
          </select>
          <textarea
            rows="3"
            placeholder="Contoh: Jam buka berubah, tempat tutup permanen"
            value={reportForm.reason}
            onChange={(event) => setReportForm((prev) => ({ ...prev, reason: event.target.value }))}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={!permissions.canReport}>
            Kirim Laporan
          </button>
        </form>

        <form onSubmit={actions.handleMerchantUpdate} className="panel">
          <h3>Merchant Update Spot</h3>
          <p>Merchant hanya bisa edit spot miliknya.</p>
          <select
            value={selectedMerchantSpotId ?? ''}
            onChange={(event) =>
              setMerchantEdit((prev) => ({ ...prev, spotId: Number(event.target.value) }))
            }
            disabled={controlledMerchantSpots.length === 0}
          >
            {controlledMerchantSpots.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Menu terbaru"
            value={merchantEdit.menu}
            onChange={(event) => setMerchantEdit((prev) => ({ ...prev, menu: event.target.value }))}
          />
          <input
            type="text"
            placeholder="Fasilitas terbaru"
            value={merchantEdit.facilities}
            onChange={(event) =>
              setMerchantEdit((prev) => ({ ...prev, facilities: event.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Jam operasional"
            value={merchantEdit.operationalHours}
            onChange={(event) =>
              setMerchantEdit((prev) => ({ ...prev, operationalHours: event.target.value }))
            }
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!permissions.canUseMerchantPanel || controlledMerchantSpots.length === 0}
          >
            Simpan Update
          </button>
        </form>
      </div>
    </section>
  )
}

function VerifyPage({ state }) {
  const { currentUser, verificationRequests, forms, actions } = state
  const { verificationForm, setVerificationForm } = forms
  const myRequests = verificationRequests.filter(
    (request) => currentUser && request.userId === currentUser.id,
  )

  return (
    <section className="verification-flow">
      <h2>Verifikasi Identitas</h2>
      <div className="flow-grid">
        <article>
          <h3>1. Pilih Dokumen</h3>
          <p>KTM, KTP, SIM, atau Kartu Pelajar.</p>
        </article>
        <article>
          <h3>2. Submit Form</h3>
          <p>Masukkan nomor dokumen lalu kirim request verifikasi.</p>
        </article>
        <article>
          <h3>3. Menunggu Admin</h3>
          <p>Admin approve atau reject dari panel admin.</p>
        </article>
      </div>

      <form onSubmit={actions.handleSubmitVerification} className="panel verify-panel">
        <select
          value={verificationForm.docType}
          onChange={(event) =>
            setVerificationForm((prev) => ({ ...prev, docType: event.target.value }))
          }
        >
          <option value="KTM">KTM</option>
          <option value="KTP">KTP</option>
          <option value="SIM">SIM</option>
          <option value="Kartu Pelajar">Kartu Pelajar</option>
        </select>
        <input
          type="text"
          placeholder="Nomor dokumen"
          value={verificationForm.docNumber}
          onChange={(event) =>
            setVerificationForm((prev) => ({ ...prev, docNumber: event.target.value }))
          }
          required
        />
        <button type="submit" className="btn btn-primary" disabled={!currentUser}>
          Kirim Verifikasi
        </button>
      </form>

      <article className="panel verify-history">
        <h3>Riwayat Request Saya</h3>
        {myRequests.length > 0 ? (
          <ul>
            {myRequests.map((request) => (
              <li key={request.id}>
                {request.docType} - {request.docNumber} ({request.status})
              </li>
            ))}
          </ul>
        ) : (
          <p>Belum ada request verifikasi.</p>
        )}
      </article>
    </section>
  )
}

function AdminPage({ state }) {
  const { pendingSpots, verificationRequests, reports, actions } = state

  return (
    <section className="usecase-board">
      <h2>Admin Moderation Console</h2>
      <div className="admin-grid">
        <article>
          <h3>Pending Spot</h3>
          {pendingSpots.length > 0 ? (
            <ul>
              {pendingSpots.map((spot) => (
                <li key={spot.id}>
                  <span>{spot.name}</span>
                  <div>
                    <button type="button" className="inline-btn" onClick={() => actions.approveSpot(spot.id)}>
                      Approve
                    </button>
                    <button
                      type="button"
                      className="inline-btn danger"
                      onClick={() => actions.rejectSpot(spot.id)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada pending spot.</p>
          )}
        </article>

        <article>
          <h3>Verifikasi User</h3>
          {verificationRequests.length > 0 ? (
            <ul>
              {verificationRequests.map((request) => (
                <li key={request.id}>
                  <span>
                    {request.userName} - {request.docType} ({request.status})
                  </span>
                  {request.status === 'pending' ? (
                    <div>
                      <button
                        type="button"
                        className="inline-btn"
                        onClick={() => actions.approveVerification(request.id, request.userId)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="inline-btn danger"
                        onClick={() => actions.rejectVerification(request.id)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>Belum ada request verifikasi.</p>
          )}
        </article>

        <article>
          <h3>Laporan Data Usang</h3>
          {reports.length > 0 ? (
            <ul>
              {reports.map((report) => (
                <li key={report.id}>
                  <span>
                    {report.spotName}: {report.reason} ({report.status})
                  </span>
                  {report.status === 'open' ? (
                    <button
                      type="button"
                      className="inline-btn"
                      onClick={() => actions.resolveReport(report.id)}
                    >
                      Resolve
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>Belum ada laporan.</p>
          )}
        </article>
      </div>
    </section>
  )
}

export default App
