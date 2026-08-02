import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { NoteItem } from '../../types'

const UNITS = [
  { value: 'pcs', label: 'Pcs' },
  { value: 'buah', label: 'Buah' },
  { value: 'lusin', label: 'Lusin' },
  { value: 'kodi', label: 'Kodi' },
  { value: 'pack', label: 'Pack' },
  { value: 'dus', label: 'Dus' },
  { value: 'kg', label: 'Kg' },
  { value: 'gram', label: 'Gram' },
  { value: 'ons', label: 'Ons' },
  { value: 'liter', label: 'Liter' },
  { value: 'ml', label: 'ml' },
  { value: 'meter', label: 'Meter' },
  { value: 'cm', label: 'cm' },
  { value: 'lembar', label: 'Lembar' },
  { value: 'set', label: 'Set' },
  { value: 'pasang', label: 'Pasang' },
  { value: 'orang', label: 'Orang' },
  { value: 'unit', label: 'Unit' },
  { value: 'rim', label: 'Rim' },
  { value: 'batang', label: 'Batang' },
]

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
  const [unit, setUnit] = useState('pcs')
  const [price, setPrice] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    if (!price && !useCustomTotal) return
    const qty = Number(quantity) || 1
    const p = Number(price) || 0
    onAddItem({
      name: name.trim(),
      quantity: qty,
      unit,
      price: p,
      total: qty * p,
    })
    setName('')
    setQuantity(1)
    setUnit('pcs')
    setPrice('')
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body p-4 sm:p-6">
        <h3 className="card-title text-sm font-heading mb-4">Tambah Item</h3>

        <div className="space-y-4">
          <label className="form-control w-full">
            <span className="label-text text-sm font-medium mb-1.5">Nama Barang / Jasa</span>
            <input
              type="text"
              className="input input-bordered w-full h-11"
              placeholder="Contoh: Buku Tulis"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="form-control w-full">
              <span className="label-text text-sm font-medium mb-1.5">Jumlah</span>
              <input
                type="number"
                className="input input-bordered w-full h-11"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text text-sm font-medium mb-1.5">Satuan</span>
              <select
                className="select select-bordered w-full h-11"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full">
              <span className="label-text text-sm font-medium mb-1.5">Harga Satuan</span>
              <input
                type="number"
                className="input input-bordered w-full h-11"
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
              <span className="font-medium">Input total manual</span>
            </label>

            {useCustomTotal && (
              <label className="form-control w-40">
                <span className="label-text text-xs font-medium mb-1">Total Manual</span>
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
            className="btn btn-outline btn-primary w-full h-11 font-medium transition-all duration-200"
            disabled={!name.trim() || (!price && !useCustomTotal)}
          >
            <Plus className="w-4 h-4" />
            Tambah Item
          </button>
        </div>
      </div>
    </div>
  )
}
