import { useState } from 'react'
import type { NoteItem } from '../../types'

interface NoteFormProps {
  onAddItem: (item: NoteItem) => void
  customTotal: string
  onCustomTotalChange: (val: string) => void
  useCustomTotal: boolean
  onUseCustomTotalChange: (val: boolean) => void
}

export default function NoteForm({
  onAddItem,
  customTotal,
  onCustomTotalChange,
  useCustomTotal,
  onUseCustomTotalChange,
}: NoteFormProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    if (!price && !useCustomTotal) return
    const qty = Number(quantity) || 1
    const p = Number(price) || 0
    onAddItem({
      name: name.trim(),
      quantity: qty,
      price: p,
      total: qty * p,
    })
    setName('')
    setQuantity(1)
    setPrice('')
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-4 sm:p-6">
        <h3 className="card-title text-sm font-heading mb-3">Tambah Item</h3>

        <div className="space-y-3">
          <label className="form-control w-full">
            <span className="label-text text-sm">Nama Barang / Jasa</span>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Contoh: Buku Tulis"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="form-control w-full">
              <span className="label-text text-sm">Jumlah</span>
              <input
                type="number"
                className="input input-bordered w-full"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text text-sm">Harga Satuan</span>
              <input
                type="number"
                className="input input-bordered w-full"
                min={0}
                placeholder="Rp"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </label>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={useCustomTotal}
                onChange={(e) => onUseCustomTotalChange(e.target.checked)}
              />
              Input total manual
            </label>

            {useCustomTotal && (
              <label className="form-control w-40">
                <span className="label-text text-xs">Total Manual</span>
                <input
                  type="number"
                  className="input input-bordered input-sm w-full"
                  placeholder="Rp"
                  value={customTotal}
                  onChange={(e) => onCustomTotalChange(e.target.value)}
                />
              </label>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-outline btn-primary w-full"
            disabled={!name.trim() || (!price && !useCustomTotal)}
          >
            + Tambah Item
          </button>
        </div>
      </div>
    </div>
  )
}
