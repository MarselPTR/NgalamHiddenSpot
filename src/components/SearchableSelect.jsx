import React, { useState, useRef, useEffect } from 'react'

const MALANG_LOCATIONS = [
  // KOTA MALANG
  { value: 'Lowokwaru', label: 'Lowokwaru', type: 'Kecamatan', city: 'Kota Malang' },
  { value: 'Klojen', label: 'Klojen', type: 'Kecamatan', city: 'Kota Malang' },
  { value: 'Blimbing', label: 'Blimbing', type: 'Kecamatan', city: 'Kota Malang' },
  { value: 'Sukun', label: 'Sukun', type: 'Kecamatan', city: 'Kota Malang' },
  { value: 'Kedungkandang', label: 'Kedungkandang', type: 'Kecamatan', city: 'Kota Malang' },
  { value: 'Sumbersari', label: 'Sumbersari', type: 'Area Mahasiswa', city: 'Kota Malang' },
  { value: 'Dinoyo', label: 'Dinoyo', type: 'Area Mahasiswa', city: 'Kota Malang' },
  { value: 'Suhat', label: 'Sukarno Hatta', type: 'Pusat Kuliner', city: 'Kota Malang' },
  { value: 'Ijen', label: 'Ijen Boulevard', type: 'Pusat Kota', city: 'Kota Malang' },
  { value: 'Sawojajar', label: 'Sawojajar', type: 'Pemukiman', city: 'Kota Malang' },
  
  // KABUPATEN MALANG (33 Kecamatan Lengkap)
  { value: 'Ampelgading', label: 'Ampelgading', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Bantur', label: 'Bantur', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Bululawang', label: 'Bululawang', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Dampit', label: 'Dampit', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Dau', label: 'Dau', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Donomulyo', label: 'Donomulyo', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Gedangan', label: 'Gedangan', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Gondanglegi', label: 'Gondanglegi', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Jabung', label: 'Jabung', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Kalipare', label: 'Kalipare', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Karangploso', label: 'Karangploso', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Kasembon', label: 'Kasembon', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Kepanjen', label: 'Kepanjen', type: 'Pusat Pemerintahan', city: 'Kab. Malang' },
  { value: 'Kromengan', label: 'Kromengan', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Lawang', label: 'Lawang', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Ngajum', label: 'Ngajum', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Ngantang', label: 'Ngantang', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Pagak', label: 'Pagak', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Pagelaran', label: 'Pagelaran', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Pakis', label: 'Pakis', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Pakisaji', label: 'Pakisaji', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Poncokusumo', label: 'Poncokusumo', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Pujon', label: 'Pujon', type: 'Kawasan Wisata', city: 'Kab. Malang' },
  { value: 'Singosari', label: 'Singosari', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Sumbermanjing Wetan', label: 'Sumbermanjing Wetan', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Sumberpucung', label: 'Sumberpucung', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Tajinan', label: 'Tajinan', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Tirtoyudo', label: 'Tirtoyudo', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Tumpang', label: 'Tumpang', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Turen', label: 'Turen', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Wagir', label: 'Wagir', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Wajak', label: 'Wajak', type: 'Kecamatan', city: 'Kab. Malang' },
  { value: 'Wonosari', label: 'Wonosari', type: 'Kecamatan', city: 'Kab. Malang' },
  
  // KOTA BATU
  { value: 'Batu', label: 'Batu City', type: 'Kota Wisata', city: 'Kota Batu' },
  { value: 'Bumiaji', label: 'Bumiaji', type: 'Kecamatan', city: 'Kota Batu' },
  { value: 'Junrejo', label: 'Junrejo', type: 'Kecamatan', city: 'Kota Batu' }
]

export function SearchableSelect({ value, onChange, placeholder = "Ketik wilayah..." }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const wrapperRef = useRef(null)

  // Sync searchTerm dengan value awal jika ada
  useEffect(() => {
    if (value) {
      const selected = MALANG_LOCATIONS.find(loc => loc.value === value)
      if (selected) setSearchTerm(selected.label)
    }
  }, [value])

  const filteredLocations = MALANG_LOCATIONS.filter(loc => 
    loc.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (loc) => {
    setSearchTerm(loc.label)
    onChange(loc.value)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  return (
    <div className="smart-picker" ref={wrapperRef}>
      <div className="picker-input-wrapper">
        <span className="picker-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </span>
        <input
          type="text"
          className="smart-picker-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="picker-dropdown">
          <ul className="picker-list">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <li key={loc.value} className="picker-item" onClick={() => handleSelect(loc)}>
                  <span className="main-label">{loc.label}</span>
                  <span className="sub-label">{loc.city} • {loc.type}</span>
                </li>
              ))
            ) : (
              <div className="picker-no-results">
                Yah, wilayah "{searchTerm}" tidak ditemukan di Malang Raya.
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
