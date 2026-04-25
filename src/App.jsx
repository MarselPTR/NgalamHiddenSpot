import React, { useMemo, useState, useEffect } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from './lib/supabaseClient'
import './App.css'

// Data & Constants
import { initialUsers, initialSpots } from './data/initialData'

// Components
import { SpotlightPanel } from './components/SpotlightPanel'
import { BackgroundDecor } from './components/BackgroundDecor'
import { AuthBackground } from './components/AuthEffects'
import { MerchantPendingScreen } from './components/MerchantPendingScreen'

// Pages
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { SpotDetailPage } from './pages/SpotDetailPage'
import { ContributePage } from './pages/ContributePage'
import { VerifyPage } from './pages/VerifyPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminPage } from './pages/AdminPage'

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

function App() {
  const [users, setUsers] = useState([])
  const [spots, setSpots] = useState([])
  const [reports, setReports] = useState([])
  const [verificationRequests, setVerificationRequests] = useState([])
  const [activeUserId, setActiveUserId] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

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
    name: '', area: 'Suhat', address: '', budget: 20000, wifiMbps: 50, sockets: 4, vibe: 'Modern',
    image: '', imageFile: null, lat: -7.9839, lng: 112.6214, menu: '', facilities: '', operationalHours: ''
  })

  const [verificationForm, setVerificationForm] = useState({ docType: 'KTM', docNumber: '', docFile: null })
  const [showMerchantPending, setShowMerchantPending] = useState(false)
  const [reviewForm, setReviewForm] = useState({ spotId: 1, rating: 5, comment: '' })
  const [reportForm, setReportForm] = useState({ spotId: 1, reason: '' })
  const [merchantEdit, setMerchantEdit] = useState({
    menu: '',
    facilities: '',
    operationalHours: '',
    address: '',
    wifiMbps: 50,
    sockets: 4,
    image: '',
    imageFile: null,
  })
  const [merchantVerifyForm, setMerchantVerifyForm] = useState({ spotId: '', proofLink: '', proofFile: null, message: '' })

  const fetchData = async () => {
    try {
      console.log('--- Memulai Sinkronisasi Database Supabase ---')

      // 1. Ambil Sesi Aktif
      const { data: { session: currentSession } } = await supabase.auth.getSession()

      // 2. Ambil Semua Profil
      const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*')
      if (profilesError) {
        console.error('Gagal mengambil tabel profiles:', profilesError.message)
      } else {
        setUsers(profiles || [])
      }

      // 3. Ambil Data Verifikasi Dulu
      const { data: verifData } = await supabase.from('verification_requests').select('*').order('created_at', { ascending: false })
      if (verifData) setVerificationRequests(verifData)

      // 4. AUTO-VERIFY SYNC (Hanya update status verifikasi, bukan buat profil baru)
      if (currentSession) {
        const userId = currentSession.user.id
        const myProfile = profiles?.find(p => p.id === userId)

        // AUTO-REPAIR: Jika ada request yang sudah APPROVED tapi profil masih FALSE
        const myApprovedRequest = verifData?.find(r => r.user_id === userId && r.status === 'approved')
        if (myApprovedRequest && myProfile && !myProfile.verified) {
          console.log('--- AUTO-REPAIR: Mendeteksi request Approved, mengupdate profil... ---')
          await supabase.from('profiles').update({ verified: true }).eq('id', userId)
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: true } : u))
        }
      }

      // 5. Ambil Data Lainnya (DIPETAKAN KE CAMELCASE DENGAN FALLBACK)
      const { data: rawSpots } = await supabase.from('spots').select('*, reviews(*)')
      if (rawSpots) {
        const mappedSpots = rawSpots.map(s => ({
          ...s,
          wifiMbps: s.wifi_mbps || 0,
          sockets: s.sockets || 0,
          budget: s.budget || 0,
          ownerId: s.owner_id,
          address: s.address || 'Alamat belum tersedia',
          operationalHours: s.operational_hours || 'Belum tersedia',
          facilities: s.facilities || 'Belum tersedia',
          menu: s.menu || 'Belum tersedia',
          reviews: (s.reviews || []).map(r => ({
            ...r,
            userName: r.user_name // Map snake_case to camelCase
          }))
        }))
        setSpots(mappedSpots)
      }

      const { data: rawReports } = await supabase
        .from('reports')
        .select('*, spots(name)')
        .order('created_at', { ascending: false })

      if (rawReports) {
        const mappedReports = rawReports.map(r => ({
          ...r,
          spot_name: r.spots?.name || 'Spot Tidak Dikenal'
        }))
        setReports(mappedReports)
      }

      console.log('--- Sinkronisasi Selesai ---')
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setActiveUserId(session?.user?.id || null)
      if (_event === 'SIGNED_IN' || _event === 'USER_UPDATED') fetchData()
    })

    fetchData()
    return () => subscription.unsubscribe()
  }, [])

  const currentUser = useMemo(() => {
    const fromTable = users.find((u) => u.id === activeUserId)
    if (fromTable) return fromTable

    if (session?.user && session.user.id === activeUserId) {
      return {
        id: session.user.id,
        name: session.user.user_metadata?.name || 'User',
        email: session.user.email,
        role: session.user.user_metadata?.role || 'student',
        verified: session.user.user_metadata?.verified || false
      }
    }
    return null
  }, [users, activeUserId, session])

  // AUTO-INITIALIZE MERCHANT SPOT
  useEffect(() => {
    if (currentUser && currentUser.role === 'merchant' && spots.length > 0) {
      const mySpot = spots.find(s => s.owner_id === currentUser.id)
      if (mySpot && !merchantEdit.spotId) {
        console.log('--- AUTO-LOCK: Mendeteksi Merchant, mengunci ke spot:', mySpot.name, '---')
        setMerchantEdit({
          spotId: mySpot.id,
          menu: mySpot.menu || '',
          facilities: mySpot.facilities || '',
          operationalHours: mySpot.operationalHours || '',
          wifiMbps: mySpot.wifiMbps || 0,
          sockets: mySpot.sockets || 0,
          image: mySpot.image || '',
          imageFile: null
        })
      }
    }
  }, [currentUser, spots, merchantEdit.spotId])
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
      (currentUser.role === 'student' && (currentUser.verified === true || currentUser.verified === 'true')))
  const canPostReview = currentUser && (currentUser.role === 'admin' || currentUser.verified === true || currentUser.verified === 'true')
  const canReport = currentUser && (currentUser.role === 'admin' || currentUser.verified === true || currentUser.verified === 'true')
  const canUseMerchantPanel = currentUser && ['merchant', 'admin'].includes(currentUser.role)
  const canUseAdminPanel = currentUser && currentUser.role === 'admin'

  const pendingSpots = spots.filter((spot) => spot.status === 'pending')
  const controlledMerchantSpots = spots.filter((spot) => {
    if (!currentUser) return false
    if (currentUser.role === 'admin') return true
    return spot.owner_id === currentUser.id
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

  const handleLogin = async (event) => {
    event.preventDefault()
    const cleanName = loginName.trim()
    const cleanPassword = loginPassword.trim()
    if (!cleanName || !cleanPassword) return

    setLoading(true)

    try {
      if (authMode === 'login') {
        // 1. Cari email di tabel profiles berdasarkan Nama atau Email
        let targetEmail = cleanName

        if (!cleanName.includes('@')) {
          const { data: profile, error: searchError } = await supabase
            .from('profiles')
            .select('email')
            .eq('name', cleanName)
            .single()

          if (profile) {
            targetEmail = profile.email
          } else {
            throw new Error('Username tidak ditemukan.')
          }
        }

        // 2. Log in with resolved email
        const { error, data } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: cleanPassword
        })

        if (error) throw error

        // Force refresh session and profiles
        const { data: { session: newSession } } = await supabase.auth.getSession()
        setSession(newSession)
        setActiveUserId(newSession?.user?.id || null)

        // Fetch profiles again to ensure the logged in user is there
        const { data: profiles } = await supabase.from('profiles').select('*')
        if (profiles) setUsers(profiles)

        window.alert('Login berhasil!')
      } else {
        // Register with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: registerEmail.trim(),
          password: cleanPassword,
          options: {
            data: {
              name: cleanName,
              role: loginRole,
              phone: registerPhone.trim(),
              nib: registerNIB.trim()
            }
          }
        })

        if (error) throw error

        if (data?.user) {
          // PAKSA SIMPAN KE TABEL PROFILES SEGERA DENGAN DATA LENGKAP
          const newProfile = {
            id: data.user.id,
            name: cleanName,
            email: registerEmail.trim(),
            phone: registerPhone.trim(),
            nib: registerNIB.trim(),
            role: loginRole,
            status: loginRole === 'merchant' ? 'pending' : 'active',
            verified: false,
            created_at: new Date().toISOString()
          }
          
          console.log('MENYIMPAN PROFIL MERCHANT KE DATABASE:', newProfile)
          const { error: insertError } = await supabase.from('profiles').insert([newProfile])
          
          if (insertError) {
            console.error('GAGAL SIMPAN PROFIL:', insertError.message)
          } else {
            console.log('PROFIL BERHASIL DISIMPAN!')
            setUsers(prev => [...prev, newProfile])
          }

          if (loginRole === 'merchant') {
            setShowMerchantPending(true)
          } else {
            window.alert('Registrasi berhasil! Silakan cek email Anda atau langsung login.')
          }
        }
      }
    } catch (err) {
      window.alert(`Gagal: ${err.message}`)
    } finally {
      setLoading(false)
      setLoginName('')
      setLoginPassword('')
      setRegisterEmail('')
      setRegisterPhone('')
      setRegisterNIB('')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setActiveUserId(null)
    setAuthMode('login')
  }

  // Helper: Upload file ke Supabase Storage
  const uploadFile = async (file, bucket = 'images') => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading file:', error.message)
      return null
    }
  }

  const handleSubmitSpot = async (event) => {
    event.preventDefault()
    console.log('--- Memulai Proses Pendaftaran Spot ---')

    if (!currentUser) {
      window.alert('Sesi login tidak ditemukan. Silakan login kembali.')
      return
    }

    if (!canSubmitSpot) {
      const msg = currentUser.role === 'student'
        ? 'Sebagai Student, Anda wajib melakukan verifikasi identitas (KTM) di menu Verify sebelum bisa mendaftarkan spot baru.'
        : 'Akun Anda belum memiliki izin untuk mendaftarkan spot baru.'
      window.alert(msg)
      return
    }

    setLoading(true)

    try {
      // 1. Upload foto jika ada file
      let imageUrl = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80'
      if (newSpot.imageFile) {
        console.log('Mengupload file foto...')
        const uploadedUrl = await uploadFile(newSpot.imageFile)
        if (uploadedUrl) imageUrl = uploadedUrl
      }

      // 2. Siapkan data untuk database (Snake Case)
      const spotData = {
        name: newSpot.name,
        area: newSpot.area,
        budget: Number(newSpot.budget),
        wifi_mbps: Number(newSpot.wifiMbps),
        sockets: Number(newSpot.sockets),
        vibe: newSpot.vibe,
        lat: Number(newSpot.lat),
        lng: Number(newSpot.lng),
        image: imageUrl,
        address: newSpot.address,
        owner_id: currentUser.id,
        status: currentUser.role === 'admin' ? 'approved' : 'pending',
        menu: newSpot.menu,
        facilities: newSpot.facilities,
        operational_hours: newSpot.operationalHours
      }

      console.log('Mengirim data ke database:', spotData)
      const { data, error } = await supabase.from('spots').insert([spotData]).select()

      if (error) throw error

      if (data) {
        // Map ke CamelCase untuk state lokal
        const newSpotMapped = data.map(s => ({
          ...s,
          wifiMbps: s.wifi_mbps,
          ownerId: s.owner_id,
          operationalHours: s.operational_hours,
          address: s.address
        }))
        setSpots((prev) => [...newSpotMapped, ...prev])
        setNewSpot({
          name: '', area: 'Suhat', address: '', budget: 20000, wifiMbps: 50, sockets: 4,
          vibe: 'Modern', lat: -7.9839, lng: 112.6214, image: '', imageFile: null,
          menu: '', facilities: '', operationalHours: ''
        })
        window.alert('Berhasil! Spot Anda telah terkirim dan sedang menunggu review Admin.')
      }
    } catch (err) {
      console.error('Error saat daftar spot:', err.message)
      window.alert(`Gagal: ${err.message}`)
    } finally {
      setLoading(false)
      console.log('--- Selesai Proses Pendaftaran Spot ---')
    }
  }

  const handleSubmitVerification = async (event) => {
    event.preventDefault()
    if (!currentUser) return

    setLoading(true)

    let docUrl = ''
    if (verificationForm.docFile) {
      const uploaded = await uploadFile(verificationForm.docFile)
      if (uploaded) docUrl = uploaded
    }

    const verifData = {
      user_id: currentUser.id,
      user_name: currentUser.name,
      type: 'identity',
      doc_type: verificationForm.docType,
      doc_number: verificationForm.docNumber,
      proof_url: docUrl,
      status: 'pending'
    }

    const { data, error } = await supabase.from('verification_requests').insert([verifData]).select()

    if (error) {
      console.error('DETAIL ERROR SUPABASE:', error)
      window.alert(`Gagal mengirim verifikasi: ${error.message}`)
    } else if (data) {
      setVerificationRequests((prev) => [...data, ...prev])
      setVerificationForm({ docType: 'KTM', docNumber: '', docFile: null })
      window.alert('Request verifikasi KTM telah dikirim!')
    }
    setLoading(false)
  }

  const handleSubmitMerchantVerification = async (event) => {
    event.preventDefault()
    if (!currentUser) return

    setLoading(true)
    
    // 1. Upload file bukti jika ada
    let docUrl = ''
    if (merchantVerifyForm.proofFile) {
      console.log('Mengupload bukti kepemilikan merchant...')
      const uploaded = await uploadFile(merchantVerifyForm.proofFile)
      if (uploaded) docUrl = uploaded
    } else {
      // Fallback ke link jika file tidak dipilih (opsional)
      docUrl = merchantVerifyForm.proofLink
    }

    if (!docUrl) {
      window.alert('Mohon lampirkan bukti kepemilikan bisnis (Foto NIB/Izin).')
      setLoading(false)
      return
    }

    const targetSpot = approvedSpots.find(s => s.id === Number(merchantVerifyForm.spotId))
    const verifData = {
      user_id: currentUser.id,
      user_name: currentUser.name,
      type: 'merchant_claim',
      spot_id: Number(merchantVerifyForm.spotId),
      spot_name: targetSpot?.name || 'Unknown',
      proof_url: docUrl,
      status: 'pending'
    }

    console.log('Mengirim klaim merchant ke database...', verifData)
    const { data, error } = await supabase.from('verification_requests').insert([verifData]).select()
    
    if (error) {
      console.error('ERROR KLAIM MERCHANT:', error)
      window.alert(`Gagal mengirim klaim: ${error.message}`)
    } else if (data) {
      setVerificationRequests((prev) => [...data, ...prev])
      setMerchantVerifyForm({ spotId: '', proofLink: '', proofFile: null, message: '' })
      window.alert('Request verifikasi kepemilikan merchant telah dikirim! Mohon tunggu review Admin.')
    }
    setLoading(false)
  }

  const handleSubmitReview = async (event) => {
    event.preventDefault()
    console.log('--- Memulai Proses Pengiriman Review ---')

    if (!currentUser) {
      window.alert('Anda harus login untuk memberikan ulasan.')
      return
    }

    if (!canPostReview) {
      window.alert('Akun Anda belum terverifikasi sebagai Student. Silakan upload KTM di menu Verify.')
      return
    }

    setLoading(true)
    try {
      const reviewData = {
        spot_id: Number(reviewForm.spotId),
        user_id: currentUser.id,
        user_name: currentUser.name || 'Anonymous',
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      }

      console.log('Data review yang dikirim:', reviewData)

      const { data, error } = await supabase.from('reviews').insert([reviewData]).select()

      if (error) {
        console.error('Supabase Review Error:', error)
        throw error
      }

      if (data) {
        console.log('Review berhasil disimpan:', data)
        const newReview = {
          ...data[0],
          userName: data[0].user_name // Pastikan mapping nama benar untuk UI
        }

        // Update lokal agar langsung muncul
        setSpots(prev => prev.map(s => s.id === reviewData.spot_id ? {
          ...s,
          reviews: [...(s.reviews || []), newReview]
        } : s))

        setReviewForm({ spotId: reviewData.spot_id, rating: 5, comment: '' })
        window.alert('Terima kasih! Ulasan Anda telah dipublikasikan.')
      }
    } catch (err) {
      console.error('Error review:', err.message)
      window.alert(`Gagal mengirim review: ${err.message}`)
    } finally {
      setLoading(false)
      console.log('--- Selesai Proses Pengiriman Review ---')
    }
  }

  const handleSubmitReport = async (event) => {
    event.preventDefault()
    if (!currentUser || !canReport) return

    setLoading(true)
    const targetSpotId = Number(reportForm.spotId)
    if (!targetSpotId) {
      window.alert('Mohon pilih spot terlebih dahulu.')
      setLoading(false)
      return
    }

    try {
      const reportData = {
        spot_id: targetSpotId,
        reporter_id: currentUser.id, // Menggunakan reporter_id kembali
        reason: reportForm.reason,
        status: 'open' // MENGGUNAKAN 'open' AGAR MUNCUL DI ADMIN
      }

      console.log('Mengirim laporan ke database...', reportData)

      const { data, error } = await supabase.from('reports').insert([reportData]).select()

      if (error) {
        console.error('Supabase Report Error:', error)
        throw error
      }

      if (data) {
        console.log('Laporan berhasil disimpan:', data)
        setReports((prev) => [...data, ...prev])
        setReportForm((prev) => ({ ...prev, reason: '' }))
        window.alert('Terima kasih! Laporan Anda telah terkirim ke Admin.')
      }
    } catch (err) {
      console.error('Error report:', err.message)
      window.alert(`Gagal mengirim laporan: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleMerchantUpdate = async (event) => {
    event.preventDefault()
    if (!currentUser) return

    setLoading(true)
    const targetId = Number(merchantEdit.spotId)
    console.log(`Mencoba update spot ID: ${targetId} sebagai Merchant`)

    try {
      let imageUrl = merchantEdit.image
      if (merchantEdit.imageFile) {
        console.log('Merchant sedang mengganti foto spot...')
        const uploaded = await uploadFile(merchantEdit.imageFile)
        if (uploaded) imageUrl = uploaded
      }

      const { error } = await supabase.from('spots').update({
        menu: merchantEdit.menu,
        facilities: merchantEdit.facilities,
        operational_hours: merchantEdit.operationalHours,
        address: merchantEdit.address,
        wifi_mbps: Number(merchantEdit.wifiMbps),
        sockets: Number(merchantEdit.sockets),
        image: imageUrl
      }).eq('id', targetId)

      if (error) throw error

      setSpots((prev) =>
        prev.map((spot) =>
          spot.id === targetId
            ? {
              ...spot,
              menu: merchantEdit.menu,
              facilities: merchantEdit.facilities,
              operationalHours: merchantEdit.operationalHours,
              address: merchantEdit.address,
              wifiMbps: Number(merchantEdit.wifiMbps),
              sockets: Number(merchantEdit.sockets),
              image: imageUrl
            }
            : spot
        )
      )
      window.alert(currentUser.role === 'admin' ? 'Spot berhasil diperbarui oleh Admin!' : 'Data bisnis Anda berhasil diperbarui!')
    } catch (err) {
      console.error('Gagal update merchant:', err.message)
      window.alert(`Gagal update: ${err.message}`)
    }
    setLoading(false)
  }

  const approveVerification = async (requestId, userId) => {
    setLoading(true)
    const request = verificationRequests.find(r => r.id === requestId)

    // 1. Update Request Status
    await supabase.from('verification_requests').update({ status: 'approved' }).eq('id', requestId)

    // 2. Update User Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ verified: true, role: request?.type === 'merchant_claim' ? 'merchant' : 'student' })
      .eq('id', userId)

    if (profileError) {
      console.error('Gagal update profil user:', profileError.message)
      window.alert('Gagal mengupdate profil user di database. Cek izin RLS Anda.')
      setLoading(false)
      return
    }

    // 3. Update Spot Owner if claim
    if (request?.type === 'merchant_claim' && request.spot_id) {
      await supabase.from('spots').update({ owner_id: userId }).eq('id', request.spot_id)
    }

    // Update Local State Segera agar tidak perlu refresh
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: true, role: request?.type === 'merchant_claim' ? 'merchant' : 'student' } : u))
    setVerificationRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r))

    // Refresh Data
    const { data: profiles } = await supabase.from('profiles').select('*')
    if (profiles) setUsers(profiles)
    const { data: verifs } = await supabase.from('verification_requests').select('*')
    if (verifs) setVerificationRequests(verifs)

    setLoading(false)
  }

  const rejectVerification = async (requestId) => {
    setLoading(true)
    await supabase.from('verification_requests').update({ status: 'rejected' }).eq('id', requestId)
    setVerificationRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r))
    setLoading(false)
  }

  const approveSpot = async (spotId) => {
    setLoading(true)
    console.log(`Mencoba menyetujui spot ID: ${spotId}`)

    const { error } = await supabase
      .from('spots')
      .update({ status: 'approved' })
      .eq('id', spotId)

    if (error) {
      console.error('Gagal approve spot:', error.message)
      window.alert(`Gagal menyimpan ke database: ${error.message}. Pastikan RLS Policy UPDATE sudah aktif.`)
    } else {
      setSpots(prev => prev.map(s => s.id === spotId ? { ...s, status: 'approved' } : s))
      window.alert('Spot berhasil disetujui!')
    }
    setLoading(false)
  }

  const rejectSpot = async (spotId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus/menolak spot ini?')) return
    setLoading(true)

    const { error } = await supabase
      .from('spots')
      .delete()
      .eq('id', spotId)

    if (error) {
      console.error('Gagal hapus spot:', error.message)
      window.alert(`Gagal menghapus dari database: ${error.message}`)
    } else {
      setSpots(prev => prev.filter(s => s.id !== spotId))
      window.alert('Spot telah dihapus.')
    }
    setLoading(false)
  }

  const resolveReport = async (reportId) => {
    setLoading(true)
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r))
    setLoading(false)
  }

  const updateUser = async (userId, updates) => {
    setLoading(true)
    try {
      console.log('Mengupdate profil di database...', updates)
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)

      if (error) throw error

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
      )
      console.log('Profil berhasil diperbarui!')
    } catch (err) {
      console.error('Gagal update profil:', err.message)
      window.alert(`Gagal memperbarui profil: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const approveMerchantAccount = async (userId) => {
    setLoading(true)
    await supabase.from('profiles').update({ status: 'active' }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u))
    setLoading(false)
  }

  const rejectMerchantAccount = async (userId) => {
    setLoading(true)
    await supabase.from('profiles').delete().eq('id', userId)
    setUsers(prev => prev.filter(u => u.id !== userId))
    setLoading(false)
  }

  const removeReview = async (spotId, reviewId) => {
    await new Promise(r => setTimeout(r, 400))
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === spotId
          ? { ...spot, reviews: spot.reviews.filter((review) => review.id !== reviewId) }
          : spot,
      ),
    )
  }

  // Render Logic
  // 1. Loading state (saat pertama kali buka aplikasi)
  if (loading && !session) {
    return <div className="global-loader"><span>Menginisialisasi Ngalam Hidden Spot...</span></div>
  }

  // 2. Auth Gate (saat tidak ada sesi login sama sekali)
  if (!session) {
    return (
      <section className="auth-gate">
        <AuthBackground mode={authMode} />
        <AnimatePresence mode="wait">
          {showMerchantPending ? (
            <MerchantPendingScreen key="merchant-pending" onBack={() => { setShowMerchantPending(false); setAuthMode('login'); }} />
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
                    <label>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Username / Email
                    </label>
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
                      <div className="register-extras">
                        <div className="input-group">
                          <label>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="yourname@gmail.com"
                            value={registerEmail}
                            onChange={(event) => setRegisterEmail(event.target.value)}
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            Nomor Telepon
                          </label>
                          <input
                            type="tel"
                            placeholder="0812xxxx"
                            value={registerPhone}
                            onChange={(event) => setRegisterPhone(event.target.value)}
                            required
                          />
                        </div>
                        <div className="input-group">
                          <label>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                            Pilih Peran
                          </label>
                          <select value={loginRole} onChange={(event) => setLoginRole(event.target.value)}>
                            <option value="student">Malang Student</option>
                            <option value="merchant">Merchant / Owner</option>
                            <option value="general">General User</option>
                          </select>
                        </div>

                        {loginRole === 'merchant' && (
                          <>
                            <div className="input-group">
                              <label>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M7 8h10"></path><path d="M7 12h10"></path><path d="M7 16h10"></path></svg>
                                Nomor NIB (Nomor Induk Berusaha)
                              </label>
                              <input
                                type="text"
                                placeholder="Masukkan 13 digit NIB..."
                                value={registerNIB}
                                onChange={(event) => setRegisterNIB(event.target.value)}
                                required
                              />
                            </div>
                            <div className="merchant-requirement-info">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                              <p>Akun Merchant memerlukan verifikasi kepemilikan bisnis. Anda wajib melampirkan bukti fisik (Foto NIB/Izin) setelah akun disetujui Admin.</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </AnimatePresence>

                  <div className="input-group">
                    <label>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: '#0c8a60' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Password
                    </label>
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

  // 3. User ditemukan tapi Profil belum ter-load (Session OK, tapi Profile Table belum sync)
  if (!currentUser) {
    return (
      <div className="global-loader">
        <span>Sinkronisasi Profil...</span>
        <p style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.7 }}>Menghubungkan sesi ke database</p>
      </div>
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
      merchantVerifyForm,
      setMerchantVerifyForm,
      selectedReviewSpotId: Number(reviewForm.spotId),
      selectedReportSpotId: Number(reportForm.spotId),
      selectedMerchantSpotId: Number(merchantEdit.spotId),
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
      refreshData: fetchData,
      handleSelectMerchantSpot: (spotId) => {
        const spot = spots.find(s => s.id === Number(spotId))
        if (spot) {
          setMerchantEdit({
            spotId: spot.id,
            menu: spot.menu || '',
            facilities: spot.facilities || '',
            operationalHours: spot.operationalHours || '',
            address: spot.address || '',
            wifiMbps: spot.wifiMbps || 0,
            sockets: spot.sockets || 0,
            image: spot.image || '',
            imageFile: null
          })
        }
      }
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

export default App
