import React, { useMemo, useState, useEffect } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from 'framer-motion'
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

const AuthOrb = ({ index, x, y }) => {
  const tx = useTransform(x, (val) => val * (0.05 + index * 0.02))
  const ty = useTransform(y, (val) => val * (0.05 + index * 0.02))

  return (
    <motion.div
      className="orb"
      animate={{
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{
        duration: 10 + index * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        left: `${5 + index * 12}%`,
        top: `${10 + (index % 4) * 20}%`,
        background: index % 2 === 0
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.6), rgba(12, 138, 96, 0.4))'
          : 'linear-gradient(135deg, rgba(14, 165, 233, 0.5), rgba(2, 132, 199, 0.3))',
        width: `${400 + index * 40}px`,
        height: `${400 + index * 40}px`,
        x: tx,
        y: ty,
      }}
    />
  )
}

const getDeterministicValue = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

const AuthPixel = ({ index, x }) => {
  const randomLeft = getDeterministicValue(index + 1) * 100
  const randomDuration = 5 + getDeterministicValue(index + 11) * 5
  const randomDelay = getDeterministicValue(index + 21) * 5
  const randomWeight = 0.1 + getDeterministicValue(index + 31) * 0.2
  const randomSize = 4 + getDeterministicValue(index + 41) * 6

  const tx = useTransform(x, (val) => val * randomWeight)

  return (
    <motion.div
      className="pixel"
      initial={{ y: '110vh', opacity: 0 }}
      animate={{ y: '-20vh', opacity: [0, 1, 0] }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        delay: randomDelay,
        ease: "linear",
      }}
      style={{
        left: `${randomLeft}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        background: '#0c8a60',
        x: tx,
      }}
    />
  )
}

const MerchantPendingScreen = ({ onBack }) => {
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

const AuthBackground = ({ mode }) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="auth-background-canvas">
      <AnimatePresence mode="wait">
        {mode === 'login' ? (
          <motion.div
            key="login-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-layer login-layer"
          >
            {[...Array(8)].map((_, i) => (
              <AuthOrb key={i} index={i} x={x} y={y} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="register-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-layer register-layer"
          >
            {[...Array(30)].map((_, i) => (
              <AuthPixel key={i} index={i} x={x} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-noise"></div>
    </div>
  )
}

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
  const [registerNIB, setRegisterNIB] = useState('')

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
  const [showMerchantPending, setShowMerchantPending] = useState(false)
  const [reviewForm, setReviewForm] = useState({ spotId: 1, rating: 5, comment: '' })
  const [reportForm, setReportForm] = useState({ spotId: 1, reason: '' })
  const [merchantEdit, setMerchantEdit] = useState({
    spotId: 1,
    menu: '',
    facilities: '',
    operationalHours: '',
  })
  const [merchantVerifyForm, setMerchantVerifyForm] = useState({ spotId: '', proofLink: '', message: '' })

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
      if (existing.status === 'pending_approval') {
        window.alert('Akun Merchant Anda sedang diverifikasi admin (Estimasi 2x24 jam).')
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
      nib: loginRole === 'merchant' ? registerNIB.trim() : null,
      role: loginRole,
      status: loginRole === 'merchant' ? 'pending_approval' : 'active',
      verified: false,
      password: cleanPassword,
    }
    setUsers((prev) => [...prev, newUser])

    if (loginRole === 'merchant') {
      setShowMerchantPending(true)
    } else {
      setActiveUserId(newUser.id)
    }

    setLoginName('')
    setLoginPassword('')
    setRegisterEmail('')
    setRegisterPhone('')
    setRegisterNIB('')
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
        type: 'identity',
        docType: verificationForm.docType,
        docNumber: verificationForm.docNumber,
        status: 'pending',
      },
    ])
    setVerificationForm({ docType: 'KTM', docNumber: '' })
  }

  const handleSubmitMerchantVerification = (event) => {
    event.preventDefault()
    if (!currentUser) return

    const targetSpot = approvedSpots.find(s => s.id === Number(merchantVerifyForm.spotId))

    setVerificationRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        type: 'merchant_claim',
        spotId: Number(merchantVerifyForm.spotId),
        spotName: targetSpot?.name || 'Unknown',
        proofLink: merchantVerifyForm.proofLink,
        message: merchantVerifyForm.message,
        status: 'pending',
      },
    ])
    setMerchantVerifyForm({ spotId: '', proofLink: '', message: '' })
    window.alert('Request verifikasi kepemilikan merchant telah dikirim!')
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
    const request = verificationRequests.find(r => r.id === requestId)
    
    setVerificationRequests((prev) =>
      prev.map((item) => (item.id === requestId ? { ...item, status: 'approved' } : item)),
    )
    
    setUsers((prev) => prev.map((user) => {
      if (user.id !== userId) return user
      
      if (request?.type === 'merchant_claim') {
        return { 
          ...user, 
          role: 'merchant', 
          verified: true, 
          ownedSpotId: request.spotId 
        }
      }
      return { ...user, verified: true }
    }))
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

  const updateUser = (userId, updates) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    )
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...updates }))
    }
  }

  const approveMerchantAccount = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'active' } : u))
    )
  }

  const rejectMerchantAccount = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
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
        <AuthBackground mode={authMode} />
        <AnimatePresence mode="wait">
          {showMerchantPending ? (
            <MerchantPendingScreen onBack={() => { setShowMerchantPending(false); setAuthMode('login'); }} />
          ) : (
            <motion.div
              key="auth-card-wrap"
              className="auth-card-wrap"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <SpotlightPanel className="auth-card">
                <header className="auth-header">
                  <div className="auth-brand">
                    <img src="/logo.png" alt="Logo" className="auth-logo" />
                    <div className="auth-brand-text">
                      <span className="auth-brand-title">Ngalam Hidden Spot</span>
                      <span className="auth-brand-tag">PREMIUM ACCESS</span>
                    </div>
                  </div>
                  <h1>{authMode === 'login' ? 'Selamat Datang Kembali' : 'Bergabung Sekarang'}</h1>
                  <p className="auth-subtitle">
                    {authMode === 'login'
                      ? 'Masuk untuk menjelajahi spot tersembunyi terbaik di Malang.'
                      : 'Daftar dan mulai berkontribusi untuk komunitas mahasiswa Malang.'}
                  </p>
                </header>

                <div className="auth-mode-toggle">
                  <button
                    type="button"
                    className={`auth-toggle-btn ${authMode === 'login' ? 'active' : ''}`}
                    onClick={() => setAuthMode('login')}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`auth-toggle-btn ${authMode === 'register' ? 'active' : ''}`}
                    onClick={() => setAuthMode('register')}
                  >
                    Register
                  </button>
                  <div
                    className="auth-toggle-slider"
                    style={{ transform: `translateX(${authMode === 'login' ? '0' : '100%'})` }}
                  ></div>
                </div>

                <form className="gate-form" onSubmit={handleLogin}>
                  <div className="input-group">
                    <label>Username / Email</label>
                    <input
                      type="text"
                      placeholder="name@student.ub.ac.id"
                      value={loginName}
                      onChange={(event) => setLoginName(event.target.value)}
                      required
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {authMode === 'register' && (
                      <motion.div
                        key="register-fields"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="register-extras"
                      >
                        <div className="input-group">
                          <label>Email</label>
                          <input
                            type="email"
                            placeholder="yourname@gmail.com"
                            value={registerEmail}
                            onChange={(event) => setRegisterEmail(event.target.value)}
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label>Nomor Telepon</label>
                          <input
                            type="tel"
                            placeholder="0812xxxx"
                            value={registerPhone}
                            onChange={(event) => setRegisterPhone(event.target.value)}
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label>Pilih Peran</label>
                          <select value={loginRole} onChange={(event) => setLoginRole(event.target.value)}>
                            <option value="student">Malang Student</option>
                            <option value="merchant">Merchant / Owner</option>
                            <option value="general">General User</option>
                          </select>
                        </div>
                        
                        {loginRole === 'merchant' && (
                          <>
                            <div className="input-group">
                              <label>Nomor NIB (Nomor Induk Berusaha)</label>
                              <input
                                type="text"
                                placeholder="Masukkan 13 digit NIB..."
                                value={registerNIB}
                                onChange={(event) => setRegisterNIB(event.target.value)}
                                required
                              />
                            </div>
                            <motion.div 
                              className="merchant-requirement-info"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                              <p>Akun Merchant memerlukan verifikasi kepemilikan bisnis. Anda wajib melampirkan bukti fisik (Foto NIB/Izin) setelah akun disetujui Admin.</p>
                            </motion.div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="input-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary auth-submit">
                    {authMode === 'login' ? (
                      <>
                        <span>Masuk ke Akun</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </>
                    ) : (
                      <>
                        <span>Buat Akun Baru</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-footer">
                  <p>Coba gunakan akun demo:</p>
                  <div className="demo-chips">
                    <button type="button" onClick={() => { setLoginName('Admin NHS'); setLoginPassword('admin123') }}>Admin</button>
                    <button type="button" onClick={() => { setLoginName('Marsel'); setLoginPassword('marsel123') }}>Student</button>
                    <button type="button" onClick={() => { setLoginName('Merchant Mie Gacoan'); setLoginPassword('merchant123') }}>Merchant</button>
                  </div>
                </div>
              </SpotlightPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    )
  }

  const appState = {
    currentUser,
    spots,
    approvedSpots,
    filteredSpots,
    reports,
    users,
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
      merchantVerifyForm,
      setMerchantVerifyForm,
    },
    permissions: { canSubmitSpot, canPostReview, canReport, canUseMerchantPanel, canUseAdminPanel },
    actions: {
      handleLogout,
      handleSubmitSpot,
      handleSubmitVerification,
      handleSubmitReview,
      handleSubmitReport,
      handleMerchantUpdate,
      handleSubmitMerchantVerification,
      approveVerification,
      rejectVerification,
      approveSpot,
      rejectSpot,
      resolveReport,
      removeReview,
      approveMerchantAccount,
      rejectMerchantAccount,
      updateUser,
    },
  }

  return (
    <BrowserRouter>
      <div className="page-shell">
        <header className="ag-main-header">
          <nav className="ag-nav-links">
            <NavLink to="/" end>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span>Home</span>
            </NavLink>
            <NavLink to="/explore">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Explore</span>
            </NavLink>
            <NavLink to="/contribute">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-8m0 0V4m0 8h8m-8 0H4"></path></svg>
              <span>Contribute</span>
            </NavLink>
            <NavLink to="/verify">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>Verify</span>
            </NavLink>
            <NavLink to="/profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Profile</span>
            </NavLink>
            {canUseAdminPanel ? (
              <NavLink to="/admin">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                <span>Admin</span>
              </NavLink>
            ) : null}
          </nav>

          <div className="ag-user-actions">
            {currentUser.profilePic && <img src={currentUser.profilePic} alt="Avatar" className="ag-nav-avatar" />}
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
        const dx = (mouseX - width / 2) * (p.radius / width) * 0.3
        const dy = (mouseY - height / 2) * (p.radius / height) * 0.3

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
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage state={appState} />} />
        <Route path="/spot/:id" element={<SpotDetailPage state={appState} />} />
        <Route path="/contribute" element={<ContributePage state={appState} />} />
        <Route path="/verify" element={<VerifyPage state={appState} />} />
        <Route path="/profile" element={<ProfilePage state={appState} />} />
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

function HomePage() {
  const navigate = useNavigate()

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="ag-hero-container">
      <ParticleCanvas />

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

function ExplorePage({ state }) {
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

function LocationMarker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return <Marker position={position} icon={aestheticMarkerIcon} />
}

function LocationPickerMap({ lat, lng, onChange }) {
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

function ContributePage({ state }) {
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
            <h3>Tambah Hidden Spot</h3>
            <p className="form-subtitle">Student wajib verified. Merchant dan Admin bisa submit langsung.</p>
          </div>

          <div className="main-form-layout">
            <div className="main-form-fields">
              <div className="form-group-grid">
                <div className="form-field">
                  <label>Nama Spot</label>
                  <input type="text" placeholder="Teras Tlogomas" value={newSpot.name} onChange={(e) => setNewSpot(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-field">
                  <label>Area</label>
                  <input type="text" placeholder="Lowokwaru" value={newSpot.area} onChange={(e) => setNewSpot(p => ({ ...p, area: e.target.value }))} required />
                </div>
              </div>

              <div className="form-group-grid triple">
                <div className="form-field">
                  <label>Budget (Rp)</label>
                  <input type="number" placeholder="10000" value={newSpot.budget} onChange={(e) => setNewSpot(p => ({ ...p, budget: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>WiFi (Mbps)</label>
                  <input type="number" placeholder="20" value={newSpot.wifiMbps} onChange={(e) => setNewSpot(p => ({ ...p, wifiMbps: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Colokan</label>
                  <input type="number" placeholder="4" value={newSpot.sockets} onChange={(e) => setNewSpot(p => ({ ...p, sockets: e.target.value }))} />
                </div>
              </div>

              <div className="form-group-grid">
                <div className="form-field">
                  <label>Vibe Utama</label>
                  <input type="text" placeholder="WFC Friendly" value={newSpot.vibe} onChange={(e) => setNewSpot(p => ({ ...p, vibe: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Link Gambar</label>
                  <input type="text" placeholder="URL gambar spot" value={newSpot.image} onChange={(e) => setNewSpot(p => ({ ...p, image: e.target.value }))} />
                </div>
              </div>

              <div className="form-field">
                <label>Rekomendasi Menu</label>
                <input type="text" placeholder="Kopi Susu, Kentang" value={newSpot.menu} onChange={(e) => setNewSpot(p => ({ ...p, menu: e.target.value }))} />
              </div>

              <div className="form-group-grid">
                <div className="form-field">
                  <label>Fasilitas Tambahan</label>
                  <input type="text" placeholder="AC, Smoking Area" value={newSpot.facilities} onChange={(e) => setNewSpot(p => ({ ...p, facilities: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label>Jam Operasional</label>
                  <input type="text" placeholder="09:00 - 22:00" value={newSpot.operationalHours} onChange={(e) => setNewSpot(p => ({ ...p, operationalHours: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="main-form-map">
              <div className="location-picker-group">
                <div className="form-field" style={{ marginBottom: '8px' }}>
                  <label>Titik Lokasi (Klik Peta)</label>
                  <LocationPickerMap lat={Number(newSpot.lat)} lng={Number(newSpot.lng)} onChange={(lat, lng) => setNewSpot(p => ({ ...p, lat: lat.toFixed(6), lng: lng.toFixed(6) }))} />
                </div>
                <div className="form-group-grid">
                  <div className="form-field">
                    <label>Latitude</label>
                    <input type="number" step="0.000001" value={newSpot.lat} onChange={(e) => setNewSpot(p => ({ ...p, lat: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label>Longitude</label>
                    <input type="number" step="0.000001" value={newSpot.lng} onChange={(e) => setNewSpot(p => ({ ...p, lng: e.target.value }))} />
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
              placeholder="Jam buka berubah, tempat tutup permanen"
              value={reportForm.reason}
              onChange={(event) => setReportForm((prev) => ({ ...prev, reason: event.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary submit-spot-btn" disabled={!permissions.canReport}>
            Kirim Laporan
          </button>
        </SpotlightPanel>

        {showMerchantPanel && (
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
        )}
      </div>
    </motion.section>
  )
}

function VerifyPage({ state }) {
  const { currentUser, approvedSpots, verificationRequests, forms, actions } = state
  const { verificationForm, setVerificationForm, merchantVerifyForm, setMerchantVerifyForm } = forms
  const myRequests = verificationRequests.filter(
    (request) => currentUser && request.userId === currentUser.id,
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
                </select>
              </div>
              <div className="form-field">
                <label>Nomor Dokumen</label>
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
                <label>Pilih Spot Anda</label>
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
                <label>Link Dokumen Bisnis (NIB / Izin Usaha)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  value={merchantVerifyForm.proofLink}
                  onChange={(event) =>
                    setMerchantVerifyForm((prev) => ({ ...prev, proofLink: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label>Pesan Tambahan (Opsional)</label>
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
                    <strong>{request.type === 'merchant_claim' ? `Klaim: ${request.spotName}` : request.docType}</strong>
                    <span>{request.type === 'merchant_claim' ? 'Menunggu review dokumen' : request.docNumber}</span>
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

function SpotDetailPage({ state }) {
  const { id } = useParams()
  const { approvedSpots } = state
  const spot = approvedSpots.find((s) => String(s.id) === id)
  const navigate = useNavigate()
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
                  <div className="review-avatar">{r.userName.charAt(0).toUpperCase()}</div>
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
              <div className="action-panel-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg></div>
              <h3>Lapor Perubahan?</h3>
              <p>Data tidak sesuai kondisi lapangan? Bantu komunitas dengan melaporkannya.</p>
              <button className="detail-report-btn" onClick={() => navigate('/contribute')}>Laporkan Data Usang</button>
            </SpotlightPanel>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProfilePage({ state }) {
  const { currentUser, spots = [], verificationRequests = [], reports = [], pendingSpots = [] } = state
  const navigate = useNavigate()
  const [showPhotoInput, setShowPhotoInput] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(currentUser?.profilePic || '')
  const [showSecurity, setShowSecurity] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  if (!currentUser) return <Navigate to="/" replace />

  const userSpots = spots.filter(s => s.ownerId === currentUser.id)
  const userReviews = spots.reduce((acc, spot) => {
    const reviews = (spot.reviews || []).filter(r => r.userName === currentUser.name)
    return [...acc, ...reviews]
  }, [])
  const managedSpot = currentUser.ownedSpotId ? spots.find(s => s.id === currentUser.ownedSpotId) : null
  const managedSpotRating = managedSpot && managedSpot.reviews && managedSpot.reviews.length > 0
    ? (managedSpot.reviews.reduce((a, b) => a + b.rating, 0) / managedSpot.reviews.length).toFixed(1)
    : 'N/A'
  const pendingMerchantClaim = verificationRequests.find(r => r.userId === currentUser.id && r.type === 'merchant_claim' && r.status === 'pending')
  const pendingIdentityVerify = verificationRequests.find(r => r.userId === currentUser.id && r.type === 'identity_verify' && r.status === 'pending')

  const handleUpdatePhoto = (e) => {
    e.preventDefault()
    state.actions.updateUser(currentUser.id, { profilePic: photoUrl })
    setShowPhotoInput(false)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      alert('Password minimal 6 karakter.')
      return
    }
    state.actions.updateUser(currentUser.id, { password: newPassword })
    setNewPassword('')
    setShowSecurity(false)
    alert('Password berhasil diubah!')
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
                    <p>Update your credentials to keep your account safe.</p>
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
                </SpotlightPanel>
              </motion.div>
            ) : (
              <motion.div key="dash" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                {/* ADMIN DASH */}
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

                {/* MERCHANT DASH */}
                {currentUser.role === 'merchant' && (
                  <SpotlightPanel className="pv2-card pv2-main-panel">
                    <div className="pv2-panel-head">
                      <h3>Business Overview</h3>
                      <p>Performance and data of your managed business.</p>
                    </div>
                    
                    {/* Status Request Kepemilikan (Merchant Claim) */}
                    {pendingMerchantClaim && (
                      <div className="pv2-status-banner warning">
                        <div className="pv2-sb-icon">⏳</div>
                        <div className="pv2-sb-content">
                          <strong>Request Kepemilikan Sedang Diproses</strong>
                          <p>Klaim Anda untuk spot <strong>{pendingMerchantClaim.spotName}</strong> sedang ditinjau oleh admin.</p>
                        </div>
                      </div>
                    )}

                    <div className="pv2-merchant-meta">
                      <span>NIB: <strong>{currentUser.nib || 'N/A'}</strong></span>
                      <span>Contact: <strong>{currentUser.phone}</strong></span>
                    </div>
                    {managedSpot ? (
                      <div className="pv2-managed-spot">
                        <img src={managedSpot.image} alt="Spot" />
                        <div className="pv2-ms-info">
                          <h4>{managedSpot.name}</h4>
                          <div className="pv2-ms-stats">
                            <span>★ {managedSpotRating}</span>
                            <span>{managedSpot.wifiMbps} Mbps</span>
                          </div>
                          <button className="pv2-btn-primary" onClick={() => navigate('/contribute')}>Update Info</button>
                        </div>
                      </div>
                    ) : (
                      <div className="pv2-empty-state">
                        {!pendingMerchantClaim && (
                          <>
                            <p>No business linked to your account yet.</p>
                            <button className="pv2-btn-outline" onClick={() => navigate('/verify')}>Claim Business</button>
                          </>
                        )}
                        {pendingMerchantClaim && <p>Tunggu verifikasi admin untuk mengelola spot Anda.</p>}
                      </div>
                    )}
                  </SpotlightPanel>
                )}

                {/* STUDENT DASH */}
                {currentUser.role === 'student' && (
                  <SpotlightPanel className="pv2-card pv2-main-panel">
                    <div className="pv2-panel-head">
                      <h3>Contribution Status</h3>
                      <p>Track your reviews and points within the community.</p>
                    </div>

                    {/* Status Request Verifikasi Identitas (Identity Verify) */}
                    {pendingIdentityVerify && (
                      <div className="pv2-status-banner warning">
                        <div className="pv2-sb-icon">⏳</div>
                        <div className="pv2-sb-content">
                          <strong>Verifikasi Identitas Diproses</strong>
                          <p>Dokumen <strong>{pendingIdentityVerify.docType}</strong> Anda sedang diperiksa oleh tim moderator.</p>
                        </div>
                      </div>
                    )}

                    <div className="pv2-student-stats">
                      <div className="pv2-s-bubble">
                        <span className="pv2-sb-num">{userReviews.length}</span>
                        <span className="pv2-sb-lab">Reviews</span>
                      </div>
                      <div className="pv2-s-bubble">
                        <span className="pv2-sb-num">{userSpots.length}</span>
                        <span className="pv2-sb-lab">Spots</span>
                      </div>
                    </div>
                    {!currentUser.verified && !pendingIdentityVerify && (
                      <div className="pv2-verify-banner">
                        <div className="pv2-vb-text">
                          <strong>Verify Your Account</strong>
                          <p>Upload your Student ID card to unlock all features.</p>
                        </div>
                        <button className="pv2-btn-primary" onClick={() => navigate('/verify')}>Verify Now</button>
                      </div>
                    )}
                  </SpotlightPanel>
                )}

                <SpotlightPanel className="pv2-card pv2-main-panel">
                  <div className="pv2-panel-head-row">
                    <h3>Recent Activity</h3>
                    <button className="pv2-text-link">View All</button>
                  </div>
                  <div className="pv2-activity-list">
                    {userReviews.length > 0 ? userReviews.slice(0, 3).map((r, i) => (
                      <div key={i} className="pv2-activity-row">
                        <div className="pv2-act-icon">★</div>
                        <div className="pv2-act-body">
                          <p>Rated <strong>{r.rating}★</strong> - {r.comment}</p>
                          <span>Just now</span>
                        </div>
                      </div>
                    )) : <p className="pv2-empty-txt">No activity found.</p>}
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


function AdminPage({ state }) {
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
                      <strong>{request.userName} <span className={`adm-v2-request-type ${request.type}`}>{request.type === 'merchant_claim' ? 'Claim' : 'ID'}</span></strong>
                      {request.type === 'merchant_claim' ? (
                        <span className="sub">Klaim: {request.spotName}</span>
                      ) : (
                        <span className="sub">{request.docType}: {request.docNumber}</span>
                      )}
                      {request.proofLink && (
                        <a href={request.proofLink} target="_blank" rel="noopener noreferrer" className="adm-v2-proof-link">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                          Lihat Bukti
                        </a>
                      )}
                    </div>
                    <div className="adm-v2-actions">
                      <button className="adm-v2-btn reject" onClick={() => actions.rejectVerification(request.id)}>Reject</button>
                      <button className="adm-v2-btn approve" onClick={() => actions.approveVerification(request.id, request.userId)}>Verify</button>
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
                      <strong>{report.spotName}</strong>
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


export default App
