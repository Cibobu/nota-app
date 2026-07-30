import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

export default function Profile() {
  const { user, profile, isNew, setProfile } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    displayName: '',
    address: '',
    phone: '',
    email: '',
    ownerName: '',
    instagram: '',
    whatsapp: '',
    website: '',
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [waSameAsPhone, setWaSameAsPhone] = useState(false)

  useEffect(() => {
    const init = {
      displayName: profile?.displayName || '',
      address: profile?.address || '',
      phone: profile?.phone || user?.phone || '',
      email: profile?.email || user?.email || '',
      ownerName: profile?.ownerName || '',
      instagram: profile?.instagram || '',
      whatsapp: profile?.whatsapp || '',
      website: profile?.website || '',
    }
    setForm(init)

    if (profile?.logoPath) {
      setLogoUrl(profile.logoPath)
    }

    if (profile?.whatsapp === (profile?.phone || user?.phone)) {
      setWaSameAsPhone(true)
    }
  }, [profile, user])

  const handleWaCheckbox = (checked: boolean) => {
    setWaSameAsPhone(checked)
    if (checked) {
      setForm((prev) => ({ ...prev, whatsapp: form.phone || user?.phone || '' }))
    }
  }

  const handleSave = async () => {
    if (!form.displayName.trim()) {
      toast.error('Nama pemilik/toko/brand wajib diisi')
      return
    }
    if (!form.address.trim()) {
      toast.error('Alamat wajib diisi')
      return
    }
    if (user?.email && !form.phone.trim()) {
      toast.error('No HP wajib diisi (kamu daftar menggunakan email)')
      return
    }
    if (user?.phone && !form.email.trim()) {
      toast.error('Email wajib diisi (kamu daftar menggunakan no HP)')
      return
    }

    setSaving(true)
    try {
      const result = await api.profile.update({
        displayName: form.displayName.trim(),
        address: form.address.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        ownerName: form.ownerName.trim() || null,
        instagram: form.instagram.trim().replace('@', '') || null,
        whatsapp: form.whatsapp.trim() || null,
        website: form.website.trim() || null,
      })
      setProfile(result)
      toast.success('Profil berhasil disimpan')
      if (isNew) navigate('/create')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran maksimal 2MB')
      return
    }

    setUploading(true)
    try {
      const result = await api.profile.uploadLogo(file)
      setLogoUrl(result.logoPath)
      toast.success('Logo berhasil diupload')
    } catch {
      toast.error('Gagal upload logo')
    } finally {
      setUploading(false)
    }
  }

  const initials = (form.displayName || 'N').slice(0, 2).toUpperCase()
  const logoFullUrl = logoUrl
    ? logoUrl.startsWith('http')
      ? logoUrl
      : `${import.meta.env.PROD ? import.meta.env.VITE_API_URL || '' : ''}${logoUrl}`
    : null

  const registeredViaEmail = !!user?.email
  const registeredViaPhone = !!user?.phone

  return (
    <>
      <Helmet>
        <title>Profil Bisnis - Nota Pintar</title>
      </Helmet>

      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-neutral">
            {isNew ? 'Lengkapi Profil Bisnis' : 'Profil Bisnis'}
          </h1>
          {isNew && <span className="badge badge-accent badge-sm">Langkah 1 dari 2</span>}
        </div>

        {isNew && (
          <div className="alert alert-info text-sm">
            Silakan isi data bisnis kamu terlebih dahulu sebelum membuat nota
          </div>
        )}

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <h3 className="card-title text-sm font-heading mb-3">Logo Bisnis</h3>
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-20 rounded-box bg-base-200 flex items-center justify-center overflow-hidden">
                  {logoFullUrl ? (
                    <img src={logoFullUrl} alt="Logo" className="object-contain w-full h-full" />
                  ) : (
                    <span className="text-2xl font-heading font-bold text-base-content/40">
                      {initials}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="file-input file-input-bordered file-input-sm w-full"
                  disabled={uploading}
                />
                <p className="text-xs text-base-content/40 mt-1">
                  Max 2MB. JPG, PNG, WebP. {!logoUrl ? 'Kosongi untuk logo otomatis' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5 space-y-4">
            <h3 className="card-title text-sm font-heading">Data Bisnis</h3>

            <label className="form-control w-full">
              <span className="label-text">
                Nama Pemilik / Toko / Brand <span className="text-error">*</span>
              </span>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Contoh: Toko Makmur Jaya"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text">
                Alamat <span className="text-error">*</span>
              </span>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={2}
                placeholder="Contoh: Jl. Merdeka No. 123, Jakarta"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="form-control w-full">
                <span className="label-text">
                  No. Handphone
                  {registeredViaEmail && <span className="text-error"> *</span>}
                </span>
                <input
                  type="text"
                  className={`input input-bordered w-full ${registeredViaEmail && !form.phone ? 'input-error' : ''}`}
                  placeholder="0812-3456-7890"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                {registeredViaEmail && !form.phone && (
                  <span className="label-text-alt text-error text-xs mt-1">
                    Wajib diisi (kamu daftar pakai email)
                  </span>
                )}
                {user?.phone && (
                  <span className="label-text-alt text-base-content/40 text-xs mt-1">
                    Terisi otomatis dari data pendaftaran
                  </span>
                )}
              </label>

              <label className="form-control w-full">
                <span className="label-text">
                  Email
                  {registeredViaPhone && <span className="text-error"> *</span>}
                </span>
                <input
                  type="email"
                  className={`input input-bordered w-full ${registeredViaPhone && !form.email ? 'input-error' : ''}`}
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {registeredViaPhone && !form.email && (
                  <span className="label-text-alt text-error text-xs mt-1">
                    Wajib diisi (kamu daftar pakai no HP)
                  </span>
                )}
                {user?.email && (
                  <span className="label-text-alt text-base-content/40 text-xs mt-1">
                    Terisi otomatis dari data pendaftaran
                  </span>
                )}
              </label>
            </div>

            <div className="divider text-xs text-base-content/40">
              Informasi Tambahan (opsional)
            </div>

            <label className="form-control w-full">
              <span className="label-text">Nama Pemilik (jika berbeda)</span>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Atas nama pemilik"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="form-control w-full">
                <span className="label-text">Instagram</span>
                <div className="join w-full">
                  <span className="join-item text-xs text-base-content/40 flex items-center px-2 bg-base-200">
                    @
                  </span>
                  <input
                    type="text"
                    className="input input-bordered w-full join-item"
                    placeholder="namabisnis"
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  />
                </div>
              </label>

              <label className="form-control w-full">
                <span className="label-text">WhatsApp</span>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="0812-3456-7890"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={waSameAsPhone}
                onChange={(e) => handleWaCheckbox(e.target.checked)}
              />
              WhatsApp sama dengan No. Handphone
            </label>

            <label className="form-control w-full">
              <span className="label-text">Website</span>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="https://"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="btn btn-primary w-full"
          disabled={saving}
        >
          {saving ? (
            <span className="loading loading-spinner" />
          ) : isNew ? (
            'Simpan & Lanjutkan'
          ) : (
            'Simpan Profil'
          )}
        </button>
      </div>
    </>
  )
}
