import React, { useMemo, useState, useEffect, useRef } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import './App.css'

const markerSvg = `
<svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 46 18 46C18 46 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="#0c8a60"/>
  <g transform="translate(9, 7) scale(0.75)" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
    <line x1="6" y1="2" x2="6" y2="4"></line>
    <line x1="10" y1="2" x2="10" y2="4"></line>
    <line x1="14" y1="2" x2="14" y2="4"></line>
  </g>
</svg>
`

const aestheticMarkerIcon = new L.divIcon({
  className: 'custom-aesthetic-marker',
  html: `<div class="marker-svg-wrap">${markerSvg}</div><div class="marker-shadow-pulse"></div>`,
  iconSize: [36, 46],
  iconAnchor: [18, 46]
})

const initialUsers = [
  { id: 1, name: 'Admin NHS', email: 'admin@nhs.com', phone: '081234567890', role: 'admin', verified: true, password: 'admin123' },
  { id: 2, name: 'Marsel', email: 'marsel@student.ub.ac.id', phone: '081298765432', role: 'student', verified: true, password: 'marsel123' },
  {
    id: 3,
    name: 'Merchant Mie Gacoan',
    email: 'gacoan@merchant.com',
    phone: '081211112222',
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
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')

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

    const existing = users.find(
      (user) =>
        user.name.toLowerCase() === cleanName.toLowerCase() ||
        (user.email && user.email.toLowerCase() === cleanName.toLowerCase())
    )

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
      setRegisterEmail('')
      setRegisterPhone('')
      return
    }

    if (existing) {
      window.alert('Nama akun atau email sudah terdaftar. Silakan login.')
      return
    }

    const newUser = {
      id: Date.now(),
      name: cleanName,
      email: registerEmail.trim(),
      phone: registerPhone.trim(),
      role: loginRole,
      verified: loginRole === 'merchant',
      password: cleanPassword,
    }
    setUsers((prev) => [...prev, newUser])
    setActiveUserId(newUser.id)
    setLoginName('')
    setLoginPassword('')
    setRegisterEmail('')
    setRegisterPhone('')
  }

  const handleLogout = () => {
    setActiveUserId(null)
    setAuthMode('login')
    setLoginName('')
    setLoginPassword('')
    setRegisterEmail('')
    setRegisterPhone('')
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
        <header className="brand-header">
          <div className="logo">
            <img src="/logo.png" alt="Ngalam Hidden Spot Logo" className="logo-img" />
            <span className="logo-text">Ngalam Hidden Spot</span>
          </div>
        </header>
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
              placeholder={authMode === 'login' ? "Username atau Email" : "Username"}
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
              required
            />
            {authMode === 'register' && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Nomor Telepon"
                  value={registerPhone}
                  onChange={(event) => setRegisterPhone(event.target.value)}
                  required
                />
              </>
            )}
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
        <header className="ag-main-header">
          <div className="brand-wrap">
            <img src="/logo.png" alt="NHS Logo" className="brand-mark-img" />
            <div className="brand-text-wrap">
              <p className="brand-title">Ngalam Hidden Spot</p>
              <p className="brand-subtitle">Student-Verified Local Discovery</p>
            </div>
          </div>
          
          <nav className="ag-nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/contribute">Contribute</NavLink>
            <NavLink to="/verify">Verify</NavLink>
            {canUseAdminPanel ? <NavLink to="/admin">Admin</NavLink> : null}
          </nav>
          
          <div className="ag-user-actions">
            <span className="ag-user-chip">{currentUser.name} <span className="chip-role">({currentUser.role})</span></span>
            <button type="button" className="ag-btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className="page-content">
          <BackgroundDecor />
          <AnimatedRoutes appState={appState} />
        </main>

        <footer className="footer-note">
          <p className="copyright-text">
            &copy; 2026 <span className="brand-highlight">Ngalam Hidden Spot</span>. All Rights Reserved.
          </p>
          <p className="tagline">Exclusive Local Discovery for Malang Raya</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

function BackgroundDecor() {
  return (
    <div className="bg-decor-wrap" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="floating-shape" style={{ width: '600px', height: '600px', background: 'rgba(187, 247, 208, 0.4)', top: '-10%', left: '-10%' }}></div>
      <div className="floating-shape" style={{ width: '500px', height: '500px', background: 'rgba(186, 230, 253, 0.4)', bottom: '10%', right: '-5%', animationDelay: '-3s' }}></div>
      <div className="floating-shape" style={{ width: '400px', height: '400px', background: 'rgba(254, 243, 199, 0.3)', top: '30%', right: '20%', animationDelay: '-7s' }}></div>
    </div>
  )
}

function ParticleCanvas() {
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    let width = canvas.width = canvas.offsetWidth
    let height = canvas.height = canvas.offsetHeight

    const particles = []
    const colors = ['rgba(12, 138, 96, 0.6)', 'rgba(16, 185, 129, 0.4)', 'rgba(2, 132, 199, 0.5)', 'rgba(56, 189, 248, 0.3)', 'rgba(30, 41, 59, 0.2)']
    
    for (let i = 0; i < 250; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * Math.max(width, height) * 0.8,
        speed: (Math.random() * 0.001) + 0.0005,
        length: Math.random() * 12 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        offset: Math.random() * 100
      })
    }

    let mouseX = width / 2
    let mouseY = height / 2
    let targetMouseX = width / 2
    let targetMouseY = height / 2

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      targetMouseX = e.clientX - rect.left
      targetMouseY = e.clientY - rect.top
    }
    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      particles.forEach((p) => {
        p.angle += p.speed
        
        // Parallax / mouse reaction
        const dx = (mouseX - width/2) * (p.radius / width) * 0.3
        const dy = (mouseY - height/2) * (p.radius / height) * 0.3
        
        const cx = width / 2 + dx
        const cy = height / 2 + dy
        
        const x = cx + Math.cos(p.angle) * p.radius
        const y = cy + Math.sin(p.angle) * p.radius
        
        const x2 = cx + Math.cos(p.angle - 0.01) * (p.radius - p.length)
        const y2 = cy + Math.sin(p.angle - 0.01) * (p.radius - p.length)
        
        ctx.beginPath()
        ctx.moveTo(x2, y2)
        ctx.lineTo(x, y)
        ctx.strokeStyle = p.color
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.stroke()
      })

      animationFrameId = requestAnimationFrame(render)
    }
    render()

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="ag-canvas" />
}

function AnimatedRoutes({ appState }) {
  const location = useLocation()
  const canUseAdminPanel = appState.permissions.canUseAdminPanel

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage state={appState} />} />
        <Route path="/explore" element={<ExplorePage state={appState} />} />
        <Route path="/contribute" element={<ContributePage state={appState} />} />
        <Route path="/verify" element={<VerifyPage state={appState} />} />
        <Route
          path="/admin"
          element={canUseAdminPanel ? <AdminPage state={appState} /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

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

function SpotlightPanel({ children, className = "", as = "div", ...props }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const Component = as

  return (
    <Component className={`panel ${className}`} onMouseMove={handleMouseMove} {...props}>
      <motion.div
        className="spotlight-glow"
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

function HomePage({ state }) {
  const navigate = useNavigate()

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="ag-hero-container">
      <ParticleCanvas />
      
      <div className="ag-hero-content">
        <div className="ag-mini-badge">
          <img src="/logo.png" alt="Logo" className="ag-badge-icon" />
          <span>Ngalam Hidden Spot</span>
        </div>
        
        <h1 className="ag-title">
          Experience liftoff with the next-gen<br/>
          spot discovery platform
        </h1>
        
        <p className="ag-subtitle">
          Temukan kafe tersembunyi, ruang kerja estetik, dan spot WFC terbaik di Malang Raya.<br/>
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

function ExplorePage({ state }) {
  const { filteredSpots, filters, permissions, actions } = state
  const { maxBudget, setMaxBudget, minWifi, setMinWifi, minSockets, setMinSockets } = filters

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
              max="25000"
              step="1000"
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
            filteredSpots.map((spot) => (
              <motion.article className="spot-card" key={spot.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
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
            <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={aestheticMarkerIcon}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1} className="aesthetic-map-tooltip">
                <div className="tooltip-content">
                  <div className="tooltip-image" style={{ backgroundImage: `url(${spot.image})` }}></div>
                  <div className="tooltip-details">
                    <h4>{spot.name}</h4>
                    <p className="tooltip-price">Rp {spot.budget.toLocaleString('id-ID')}</p>
                    <div className="tooltip-specs">
                      <span className="spec-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                        {spot.wifiMbps} Mbps
                      </span>
                      <span className="spec-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path></svg>
                        {spot.sockets} titik
                      </span>
                    </div>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </motion.div>
  )
}

function LocationPickerMap({ lat, lng, onChange }) {
  const position = [lat || -7.9666, lng || 112.6326]

  function LocationMarker() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng)
      },
    })
    return <Marker position={position} icon={aestheticMarkerIcon} />
  }

  return (
    <div style={{ position: 'relative', height: '250px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid #b8cad3', marginBottom: '8px', zIndex: 1 }}>
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
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

  const currentMerchantSpot = controlledMerchantSpots.find((s) => s.id === selectedMerchantSpotId)

  return (
    <motion.section className="workflow-block" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <header className="page-header">
        <h1>Contribute Workflow</h1>
        <p>Bantu komunitas dengan menambahkan spot baru atau memberikan review jujur.</p>
      </header>
      <div className="workflow-grid">
        <SpotlightPanel as="form" onSubmit={actions.handleSubmitSpot} className="form-panel main-form">
          <div className="form-header">
            <h3>Tambah Hidden Spot</h3>
            <p className="form-subtitle">Student wajib verified. Merchant dan Admin bisa submit langsung.</p>
          </div>
          
          <div className="main-form-layout">
            <div className="main-form-fields">
              <div className="form-group-grid">
                <div className="form-field">
                  <label>Nama Spot</label>
                  <input type="text" placeholder="Contoh: Teras Tlogomas" value={newSpot.name} onChange={(e) => setNewSpot(p => ({...p, name: e.target.value}))} required />
                </div>
                <div className="form-field">
                  <label>Area</label>
                  <input type="text" placeholder="Contoh: Lowokwaru" value={newSpot.area} onChange={(e) => setNewSpot(p => ({...p, area: e.target.value}))} required />
                </div>
              </div>

              <div className="form-group-grid triple">
                <div className="form-field">
                  <label>Budget (Rp)</label>
                  <input type="number" placeholder="10000" value={newSpot.budget} onChange={(e) => setNewSpot(p => ({...p, budget: e.target.value}))} />
                </div>
                <div className="form-field">
                  <label>WiFi (Mbps)</label>
                  <input type="number" placeholder="20" value={newSpot.wifiMbps} onChange={(e) => setNewSpot(p => ({...p, wifiMbps: e.target.value}))} />
                </div>
                <div className="form-field">
                  <label>Colokan</label>
                  <input type="number" placeholder="4" value={newSpot.sockets} onChange={(e) => setNewSpot(p => ({...p, sockets: e.target.value}))} />
                </div>
              </div>

              <div className="form-group-grid">
                <div className="form-field">
                  <label>Vibe Utama</label>
                  <input type="text" placeholder="Contoh: WFC Friendly" value={newSpot.vibe} onChange={(e) => setNewSpot(p => ({...p, vibe: e.target.value}))} />
                </div>
                <div className="form-field">
                  <label>Link Gambar</label>
                  <input type="text" placeholder="URL gambar spot" value={newSpot.image} onChange={(e) => setNewSpot(p => ({...p, image: e.target.value}))} />
                </div>
              </div>

              <div className="form-field">
                <label>Rekomendasi Menu</label>
                <input type="text" placeholder="Contoh: Kopi Susu, Kentang" value={newSpot.menu} onChange={(e) => setNewSpot(p => ({...p, menu: e.target.value}))} />
              </div>
              
              <div className="form-group-grid">
                <div className="form-field">
                  <label>Fasilitas Tambahan</label>
                  <input type="text" placeholder="Contoh: AC, Smoking Area" value={newSpot.facilities} onChange={(e) => setNewSpot(p => ({...p, facilities: e.target.value}))} />
                </div>
                <div className="form-field">
                  <label>Jam Operasional</label>
                  <input type="text" placeholder="Contoh: 09:00 - 22:00" value={newSpot.operationalHours} onChange={(e) => setNewSpot(p => ({...p, operationalHours: e.target.value}))} />
                </div>
              </div>
            </div>

            <div className="main-form-map">
              <div className="location-picker-group">
                <div className="form-field" style={{marginBottom: '8px'}}>
                  <label>Titik Lokasi (Klik Peta)</label>
                  <LocationPickerMap lat={Number(newSpot.lat)} lng={Number(newSpot.lng)} onChange={(lat, lng) => setNewSpot(p => ({...p, lat: lat.toFixed(6), lng: lng.toFixed(6)}))} />
                </div>
                <div className="form-group-grid">
                  <div className="form-field">
                    <label>Latitude</label>
                    <input type="number" step="0.000001" value={newSpot.lat} onChange={(e) => setNewSpot(p => ({...p, lat: e.target.value}))} />
                  </div>
                  <div className="form-field">
                    <label>Longitude</label>
                    <input type="number" step="0.000001" value={newSpot.lng} onChange={(e) => setNewSpot(p => ({...p, lng: e.target.value}))} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary submit-spot-btn" disabled={!permissions.canSubmitSpot}>
            Submit Hidden Spot
          </button>
        </SpotlightPanel>

        <SpotlightPanel as="form" onSubmit={actions.handleSubmitReview} className="form-panel">
          <h3>Post Verified Review</h3>
          <p className="form-subtitle">Hanya akun verified atau admin.</p>
          <div className="form-field">
            <label>Pilih Spot</label>
            <select
              value={selectedReviewSpotId ?? ''}
              onChange={(event) => setReviewForm((prev) => ({ ...prev, spotId: Number(event.target.value) }))}
              disabled={approvedSpots.length === 0}
            >
              {approvedSpots.map((spot) => (
                <option key={spot.id} value={spot.id}>{spot.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Rating (1-5)</label>
            <select
              value={reviewForm.rating}
              onChange={(event) => setReviewForm((prev) => ({ ...prev, rating: Number(event.target.value) }))}
            >
              <option value="5">5 Bintang (Sangat Bagus)</option>
              <option value="4">4 Bintang (Bagus)</option>
              <option value="3">3 Bintang (Cukup)</option>
              <option value="2">2 Bintang (Kurang)</option>
              <option value="1">1 Bintang (Buruk)</option>
            </select>
          </div>
          <div className="form-field">
            <label>Ulasan Anda</label>
            <textarea
              rows="3"
              placeholder="Ceritakan pengalaman Anda di sini..."
              value={reviewForm.comment}
              onChange={(event) => setReviewForm((prev) => ({ ...prev, comment: event.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary submit-spot-btn" disabled={!permissions.canPostReview}>
            Kirim Review
          </button>
        </SpotlightPanel>

        <SpotlightPanel as="form" onSubmit={actions.handleSubmitReport} className="form-panel">
          <h3>Laporkan Data Usang</h3>
          <p className="form-subtitle">Bantu kami menjaga akurasi informasi.</p>
          <div className="form-field">
            <label>Pilih Spot</label>
            <select
              value={selectedReportSpotId ?? ''}
              onChange={(event) => setReportForm((prev) => ({ ...prev, spotId: Number(event.target.value) }))}
              disabled={approvedSpots.length === 0}
            >
              {approvedSpots.map((spot) => (
                <option key={spot.id} value={spot.id}>{spot.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Alasan Laporan</label>
            <textarea
              rows="3"
              placeholder="Contoh: Jam buka berubah, tempat tutup permanen"
              value={reportForm.reason}
              onChange={(event) => setReportForm((prev) => ({ ...prev, reason: event.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary submit-spot-btn" disabled={!permissions.canReport}>
            Kirim Laporan
          </button>
        </SpotlightPanel>

        <SpotlightPanel as="form" onSubmit={actions.handleMerchantUpdate} className="form-panel">
          <h3>Merchant Update Spot</h3>
          <p className="form-subtitle">Merchant hanya bisa edit spot miliknya.</p>
          <div className="form-field">
            <label>Pilih Spot Anda</label>
            <select
              value={selectedMerchantSpotId ?? ''}
              onChange={(event) => {
                const spotId = Number(event.target.value)
                const spotData = controlledMerchantSpots.find((s) => s.id === spotId)
                if (spotData) {
                  setMerchantEdit({
                    spotId,
                    menu: spotData.menu || '',
                    facilities: spotData.facilities || '',
                    operationalHours: spotData.operationalHours || '',
                  })
                } else {
                  setMerchantEdit((prev) => ({ ...prev, spotId }))
                }
              }}
              disabled={controlledMerchantSpots.length === 0}
            >
              {controlledMerchantSpots.map((spot) => (
                <option key={spot.id} value={spot.id}>{spot.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Update Menu</label>
            <input
              type="text"
              placeholder={currentMerchantSpot?.menu || "Menu terbaru"}
              value={merchantEdit.menu}
              onChange={(event) => setMerchantEdit((prev) => ({ ...prev, menu: event.target.value }))}
            />
          </div>
          <div className="form-group-grid">
            <div className="form-field">
              <label>Update Fasilitas</label>
              <input
                type="text"
                placeholder={currentMerchantSpot?.facilities || "Fasilitas terbaru"}
                value={merchantEdit.facilities}
                onChange={(event) => setMerchantEdit((prev) => ({ ...prev, facilities: event.target.value }))}
              />
            </div>
            <div className="form-field">
              <label>Update Jam</label>
              <input
                type="text"
                placeholder={currentMerchantSpot?.operationalHours || "Jam operasional terbaru"}
                value={merchantEdit.operationalHours}
                onChange={(event) => setMerchantEdit((prev) => ({ ...prev, operationalHours: event.target.value }))}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary submit-spot-btn"
            disabled={!permissions.canUseMerchantPanel || controlledMerchantSpots.length === 0}
          >
            Simpan Update
          </button>
        </SpotlightPanel>
      </div>
    </motion.section>
  )
}

function VerifyPage({ state }) {
  const { currentUser, verificationRequests, forms, actions } = state
  const { verificationForm, setVerificationForm } = forms
  const myRequests = verificationRequests.filter(
    (request) => currentUser && request.userId === currentUser.id,
  )

  return (
    <motion.section className="verification-flow" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <header className="page-header">
        <h1>Verifikasi Identitas</h1>
        <p>Dapatkan badge verified untuk menjamin integritas data komunitas.</p>
      </header>

      <motion.div className="verify-steps" variants={staggerContainer} initial="initial" animate="animate">
        <motion.div className="verify-step-card" variants={staggerItem}>
          <div className="step-number">1</div>
          <div className="step-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <h3>Pilih Dokumen</h3>
          <p>KTM, KTP, SIM, atau Kartu Pelajar sebagai bukti identitas Anda.</p>
        </motion.div>
        <motion.div className="verify-step-card" variants={staggerItem}>
          <div className="step-number">2</div>
          <div className="step-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </div>
          <h3>Submit Form</h3>
          <p>Masukkan nomor dokumen lalu kirim request verifikasi ke sistem.</p>
        </motion.div>
        <motion.div className="verify-step-card" variants={staggerItem}>
          <div className="step-number">3</div>
          <div className="step-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3>Menunggu Admin</h3>
          <p>Admin akan me-review dan approve atau reject verifikasi Anda.</p>
        </motion.div>
      </motion.div>

      <div className="verify-form-grid">
        <SpotlightPanel as="form" onSubmit={actions.handleSubmitVerification} className="verify-panel verify-submit-panel">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Kirim Verifikasi
          </h3>
          <p className="form-subtitle">Lengkapi data berikut untuk memulai proses verifikasi akun Anda.</p>
          <div className="verify-form-row">
            <div className="form-field">
              <label>Tipe Dokumen</label>
              <select
                value={verificationForm.docType}
                onChange={(event) =>
                  setVerificationForm((prev) => ({ ...prev, docType: event.target.value }))
                }
              >
                <option value="KTM">KTM (Kartu Tanda Mahasiswa)</option>
                <option value="KTP">KTP (Kartu Tanda Penduduk)</option>
                <option value="SIM">SIM (Surat Izin Mengemudi)</option>
                <option value="Kartu Pelajar">Kartu Pelajar</option>
              </select>
            </div>
            <div className="form-field">
              <label>Nomor Dokumen</label>
              <input
                type="text"
                placeholder="Masukkan nomor dokumen Anda"
                value={verificationForm.docNumber}
                onChange={(event) =>
                  setVerificationForm((prev) => ({ ...prev, docNumber: event.target.value }))
                }
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary submit-spot-btn" disabled={!currentUser}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            Kirim Verifikasi
          </button>
        </SpotlightPanel>

        <SpotlightPanel as="article" className="verify-history">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Riwayat Request
          </h3>
          {myRequests.length > 0 ? (
            <div className="verify-history-list">
              {myRequests.map((request) => (
                <div key={request.id} className="verify-history-item">
                  <div className="verify-history-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  </div>
                  <div className="verify-history-info">
                    <strong>{request.docType}</strong>
                    <span>{request.docNumber}</span>
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

function AdminPage({ state }) {
  const { pendingSpots, verificationRequests, reports, actions } = state

  return (
    <motion.section className="usecase-board" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <header className="page-header">
        <h1>Admin Moderation</h1>
        <p>Panel kendali pusat untuk verifikasi spot, user, dan laporan data.</p>
      </header>
      <motion.div className="admin-grid" variants={staggerContainer} initial="initial" animate="animate">
        <SpotlightPanel as={motion.article} variants={staggerItem}>
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
        </SpotlightPanel>

        <SpotlightPanel as={motion.article} variants={staggerItem}>
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
        </SpotlightPanel>

        <SpotlightPanel as={motion.article} variants={staggerItem}>
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
        </SpotlightPanel>
      </motion.div>
    </motion.section>
  )
}

export default App
