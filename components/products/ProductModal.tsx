"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { TouchEvent } from "react"
import { ArrowLeft, ArrowRight, MapPin, Search } from "lucide-react"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { formatLocation } from "@/lib/utils"

type ProductModalProps = {
  product: Product | null
  products: Product[]
  onClose: () => void
  onProductSelect: (product: Product) => void
}

export default function ProductModal({
  product,
  products,
  onClose,
  onProductSelect,
}: ProductModalProps) {
  const [search, setSearch] = useState("")
  const touchStartX = useRef<number | null>(null)

  const sortByLocation = (items: Product[]) =>
    [...items].sort((a, b) => {
      if (a.box_no !== b.box_no) return a.box_no - b.box_no
      if (a.row_no !== b.row_no) return a.row_no - b.row_no
      return a.slot_no - b.slot_no
    })

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    const base = term
      ? products.filter((item) => item.name.toLowerCase().includes(term))
      : products
    return sortByLocation(base)
  }, [products, search])

  const currentIndex = product
    ? filteredProducts.findIndex((item) => item.id === product.id)
    : -1

  const goToIndex = (index: number) => {
    if (!filteredProducts.length) return
    if (index < 0) index = filteredProducts.length - 1
    if (index >= filteredProducts.length) index = 0
    onProductSelect(filteredProducts[index])
  }

  const goNext = () => {
    if (!filteredProducts.length) return
    if (currentIndex === -1) {
      goToIndex(0)
      return
    }
    goToIndex((currentIndex + 1) % filteredProducts.length)
  }

  const goPrev = () => {
    if (!filteredProducts.length) return
    if (currentIndex === -1) {
      goToIndex(filteredProducts.length - 1)
      return
    }
    goToIndex((currentIndex - 1 + filteredProducts.length) % filteredProducts.length)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) < 40) return
    if (delta > 0) {
      goPrev()
    } else {
      goNext()
    }
    touchStartX.current = null
  }

  useEffect(() => {
    if (product) {
      document.body.classList.add("modal-open")
      return () => {
        document.body.classList.remove("modal-open")
      }
    }

    document.body.classList.remove("modal-open")
    return () => {}
  }, [product])

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/70 via-primary-900/50 to-black/90" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl space-y-4 overflow-hidden rounded-[32px] border border-white/20 bg-gradient-to-br from-white/95 via-slate-50 to-slate-100 p-6 shadow-[0_40px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl lg:p-8">
        <div className="absolute -top-20 left-0 h-40 w-40 animate-pulse-slow rounded-full bg-gradient-to-br from-primary-500/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 right-6 h-28 w-28 animate-pulse-slower rounded-full bg-gradient-to-br from-secondary-400/40 to-transparent blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-600">
                รายละเอียดสินค้า
              </p>
              <h2 className="text-2xl font-bold text-primary-900 sm:text-3xl">
                {product.name}
              </h2>
            </div>
            <button
              type="button"
              className="rounded-full border border-primary-200 bg-white/70 px-3 py-1 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <div className="relative h-48 w-full overflow-hidden rounded-[24px] border border-white/60 bg-gradient-to-br from-primary-50 via-white to-white shadow-[inset_0_0_40px_rgba(59,130,246,0.2)]">
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-700">
                <MapPin className="h-4 w-4" />
                <span>
                  {formatLocation(product.box_no, product.row_no, product.slot_no)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex items-center gap-1 rounded-full border border-transparent bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-1 text-sm font-semibold text-primary-700 shadow-sm transition hover:opacity-90"
                >
                  <ArrowLeft className="h-4 w-4" />
                  ก่อนหน้า
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-1 rounded-full border border-transparent bg-gradient-to-r from-primary-100 to-primary-50 px-4 py-1 text-sm font-semibold text-primary-700 shadow-sm transition hover:opacity-90"
                >
                  ถัดไป
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
                Search within modal
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Filter products..."
                  className="w-full rounded-full border border-primary-200 bg-white/90 px-10 py-2 text-sm text-primary-900 shadow-lg transition focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredProducts.slice(0, 8).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onProductSelect(item)}
                    className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${item.id === product.id
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-primary-100 bg-white/70 text-primary-600"
                      }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
