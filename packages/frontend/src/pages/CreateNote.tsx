import { useQueryClient } from '@tanstack/react-query'
import { FileText, Trash2 } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import NoteForm from '../components/nota/NoteForm'
import NotePreview from '../components/nota/NotePreview'
import EmptyState from '../components/ui/EmptyState'
import { useCreateNote, useNextNoteNumber } from '../hooks/useNotes'
import { useProfile } from '../hooks/useProfile'
import type { NoteItem } from '../types'

const UNIT_LABELS: Record<string, string> = {
  pcs: 'Pcs',
  buah: 'Buah',
  lusin: 'Lusin',
  kodi: 'Kodi',
  pack: 'Pack',
  dus: 'Dus',
  kg: 'Kg',
  gram: 'Gram',
  ons: 'Ons',
  liter: 'Liter',
  ml: 'ml',
  meter: 'Meter',
  cm: 'cm',
  lembar: 'Lembar',
  set: 'Set',
  pasang: 'Pasang',
  orang: 'Orang',
  unit: 'Unit',
  rim: 'Rim',
  batang: 'Batang',
}

export default function CreateNote() {
  const { data: profile } = useProfile()
  const createNote = useCreateNote()
  const { data: nextNumber } = useNextNoteNumber()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [items, setItems] = useState<NoteItem[]>([])
  const [useCustomTotal, setUseCustomTotal] = useState(false)
  const [customTotal, setCustomTotal] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const savedRef = useRef<string | null>(null)

  const grandTotal = useMemo(() => {
    if (useCustomTotal) return Number(customTotal) || 0
    return items.reduce((sum, item) => sum + item.total, 0)
  }, [items, useCustomTotal, customTotal])

  const buildPayload = useCallback(
    () => ({
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      items,
      grandTotal,
    }),
    [customerName, customerPhone, items, grandTotal],
  )

  const handleAddItem = useCallback((item: NoteItem) => {
    setItems((prev) => [...prev, item])
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleBeforeExport = useCallback(async () => {
    if (savedRef.current) return
    if (!items.length) {
      toast.error('Belum ada item untuk disimpan')
      throw new Error('Belum ada item untuk disimpan')
    }
    const result = await createNote.mutateAsync(buildPayload())
    savedRef.current = result.id
    queryClient.invalidateQueries({ queryKey: ['notes', 'next-number'] })
  }, [items, buildPayload, createNote, queryClient])

  const handleExported = useCallback(() => {
    const id = savedRef.current
    if (id) navigate(`/preview/${id}`)
  }, [navigate])

  const handleSaveToHistory = useCallback(async () => {
    if (!items.length) {
      toast.error('Belum ada item untuk disimpan')
      return
    }
    try {
      const result = await createNote.mutateAsync(buildPayload())
      savedRef.current = null
      setItems([])
      setCustomerName('')
      setCustomerPhone('')
      queryClient.invalidateQueries({ queryKey: ['notes', 'next-number'] })
      toast.success('Nota tersimpan di riwayat', {
        action: {
          label: 'Lihat',
          onClick: () => navigate(`/preview/${result.id}`),
        },
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan nota')
    }
  }, [items, buildPayload, createNote, queryClient, navigate])

  return (
    <>
      <Helmet>
        <title>Buat Nota - Nota Pintar</title>
        <meta
          name="description"
          content="Buat nota/invoice baru. Tambah item, hitung otomatis, download PDF/JPG."
        />
      </Helmet>

      <div className="space-y-6 animate-fade-in">
        <h1 className="text-xl font-heading font-bold text-neutral">
          <FileText className="w-5 h-5 inline mr-2" />
          Buat Nota Baru
        </h1>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4 sm:p-6 space-y-4">
            <h3 className="card-title text-sm font-heading">Informasi Nota</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="form-control w-full">
                <span className="label-text text-sm font-medium mb-1.5">No. Nota</span>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={nextNumber?.noteNumber || ''}
                  readOnly
                  placeholder="Menghitung..."
                />
                <span className="label-text-alt text-base-content/50 text-xs mt-1">
                  Nomor nota dibuat otomatis
                </span>
              </label>

              <label className="form-control w-full">
                <span className="label-text text-sm font-medium mb-1.5">
                  Kepada Yth (Nama Pelanggan)
                </span>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama pelanggan"
                />
              </label>
            </div>

            <label className="form-control w-full sm:w-1/2">
              <span className="label-text text-sm font-medium mb-1.5">
                No. HP Pelanggan (opsional)
              </span>
              <input
                type="tel"
                inputMode="tel"
                className="input input-bordered w-full"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0812-3456-7890"
              />
            </label>
          </div>
        </div>

        <NoteForm
          onAddItem={handleAddItem}
          customTotal={customTotal}
          onCustomTotalChange={setCustomTotal}
          useCustomTotal={useCustomTotal}
          onUseCustomTotalChange={setUseCustomTotal}
        />

        {items.length > 0 && (
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4 sm:p-6">
              <h3 className="card-title text-sm font-heading mb-3">Daftar Item</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra text-xs">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nama</th>
                      <th className="text-center">Jumlah</th>
                      <th className="text-right">Harga</th>
                      <th className="text-right">Total</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={`${item.name}-${i}`}>
                        <td className="text-base-content/50">{i + 1}</td>
                        <td>{item.name}</td>
                        <td className="text-center">
                          {item.quantity} {UNIT_LABELS[item.unit] || item.unit}
                        </td>
                        <td className="text-right">{item.price.toLocaleString('id-ID')}</td>
                        <td className="text-right font-medium">
                          {item.total.toLocaleString('id-ID')}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(i)}
                            className="btn btn-ghost btn-xs text-error h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-300">
                <span className="font-heading font-semibold text-sm">Grand Total</span>
                <span className="text-xl font-heading font-bold text-primary tabular-nums">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        )}

        {items.length > 0 ? (
          <NotePreview
            items={items}
            grandTotal={grandTotal}
            profile={profile}
            noteNumber={nextNumber?.noteNumber || ''}
            date={new Date().toISOString()}
            customerName={customerName.trim() || undefined}
            customerPhone={customerPhone.trim() || undefined}
            onBeforeExport={handleBeforeExport}
            onExported={handleExported}
          />
        ) : (
          <EmptyState
            title="Belum ada item"
            description="Tambahkan barang atau jasa yang ingin dimasukkan ke dalam nota"
          />
        )}

        {items.length > 0 && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSaveToHistory}
              className="btn btn-outline w-full no-print h-11 font-medium transition-all duration-200"
            >
              {createNote.isPending ? <span className="loading loading-spinner" /> : null}
              {createNote.isPending ? 'Menyimpan...' : 'Simpan ke Riwayat'}
            </button>
            <p className="text-xs text-base-content/50 text-center">
              Klik Download PDF/JPG akan otomatis menyimpan nota ke riwayat
            </p>
          </div>
        )}
      </div>
    </>
  )
}
