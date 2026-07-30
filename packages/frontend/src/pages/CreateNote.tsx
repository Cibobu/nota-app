import { useCallback, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'sonner'
import NoteForm from '../components/nota/NoteForm'
import NotePreview from '../components/nota/NotePreview'
import EmptyState from '../components/ui/EmptyState'
import { useCreateNote } from '../hooks/useNotes'
import { useProfile } from '../hooks/useProfile'
import type { NoteItem } from '../types'

export default function CreateNote() {
  const { data: profile } = useProfile()
  const createNote = useCreateNote()

  const [items, setItems] = useState<NoteItem[]>([])
  const [useCustomTotal, setUseCustomTotal] = useState(false)
  const [customTotal, setCustomTotal] = useState('')
  const [noteNumber, setNoteNumber] = useState(`NOTA-${String(Date.now()).slice(-6)}`)
  const [customerName, setCustomerName] = useState('')

  const grandTotal = useMemo(() => {
    if (useCustomTotal) return Number(customTotal) || 0
    return items.reduce((sum, item) => sum + item.total, 0)
  }, [items, useCustomTotal, customTotal])

  const handleAddItem = useCallback((item: NoteItem) => {
    setItems((prev) => [...prev, item])
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSave = useCallback(async () => {
    if (!items.length) {
      toast.error('Belum ada item untuk disimpan')
      return
    }
    try {
      await createNote.mutateAsync({
        noteNumber: noteNumber.trim() || undefined,
        customerName: customerName.trim() || undefined,
        items,
        grandTotal,
      })
      toast.success('Nota berhasil disimpan!')
      setItems([])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan nota')
    }
  }, [items, grandTotal, noteNumber, customerName, createNote])

  return (
    <>
      <Helmet>
        <title>Buat Nota - Nota Pintar</title>
        <meta
          name="description"
          content="Buat nota/invoice baru. Tambah item, hitung otomatis, download PDF/JPG."
        />
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-xl font-heading font-bold text-neutral">Buat Nota Baru</h1>

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-4 sm:p-6 space-y-4">
            <h3 className="card-title text-sm font-heading">Informasi Nota</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="form-control w-full">
                <span className="label-text">No. Nota</span>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={noteNumber}
                  onChange={(e) => setNoteNumber(e.target.value)}
                  placeholder="NOTA-XXXX"
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text">Kepada Yth (Nama Pelanggan)</span>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama pelanggan"
                />
              </label>
            </div>
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
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4 sm:p-6">
              <h3 className="card-title text-sm font-heading mb-2">Daftar Item</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra text-xs">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nama</th>
                      <th className="text-center">Qty</th>
                      <th className="text-right">Harga</th>
                      <th className="text-right">Total</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={`${item.name}-${i}`}>
                        <td>{i + 1}</td>
                        <td>{item.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">{item.price.toLocaleString('id-ID')}</td>
                        <td className="text-right font-medium">
                          {item.total.toLocaleString('id-ID')}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(i)}
                            className="btn btn-ghost btn-xs text-error"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-base-200">
                <span className="font-heading font-bold text-sm">Grand Total</span>
                <span className="text-xl font-heading font-bold text-primary">
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
            noteNumber={noteNumber}
            customerName={customerName.trim() || undefined}
          />
        ) : (
          <EmptyState
            title="Belum ada item"
            description="Tambahkan barang atau jasa yang ingin dimasukkan ke dalam nota"
          />
        )}

        {items.length > 0 && (
          <button type="button" onClick={handleSave} className="btn btn-outline w-full no-print">
            {createNote.isPending ? <span className="loading loading-spinner" /> : null}
            {createNote.isPending ? 'Menyimpan...' : 'Simpan ke Riwayat'}
          </button>
        )}
      </div>
    </>
  )
}
