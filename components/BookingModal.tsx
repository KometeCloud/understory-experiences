'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { Experience } from '@/lib/understory'

type Media = { type: string; url: string }

export function BookingModal({
  exp,
  open,
  onClose,
}: {
  exp: Experience
  open: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState(0)

  const name = exp.name as string
  const description = exp.description as string | undefined
  const images = (exp.media as Media[] | undefined)?.filter((m) => m.type === 'IMAGE') ?? []

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      setCurrent(0)
      dialog.showModal()
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).UNDERSTORY?.initialize?.()
      }, 0)
    } else if (dialog.open) {
      dialog.close()
    }
  }, [open])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose()
  }

  function prev() {
    setCurrent((i) => (i === 0 ? images.length - 1 : i - 1))
  }

  function next() {
    setCurrent((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-2xl rounded-2xl p-0 shadow-2xl open:flex open:flex-col max-h-[90vh]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
        <span className="font-semibold text-gray-900">Prenota</span>
        <button
          onClick={onClose}
          aria-label="Chiudi"
          className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition-colors"
        >
          ×
        </button>
      </div>

      <div className="overflow-y-auto flex flex-col">
        {/* Full-width carousel */}
        {images.length > 0 && (
          <div className="relative w-full aspect-video shrink-0 bg-black">
            <Image
              src={images[current].url}
              alt={`${name} – foto ${current + 1}`}
              fill
              className="object-cover"
              sizes="672px"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Foto precedente"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  aria-label="Foto successiva"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
                >
                  ›
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      aria-label={`Vai a foto ${i + 1}`}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Title + full description */}
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          {description && (
            <p className="text-sm text-gray-600 mt-2 whitespace-pre-line leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Booking widget */}
        <div className="p-4">
          {open && (
            <div
              className="understory-booking-widget"
              data-company-id={process.env.NEXT_PUBLIC_UNDERSTORY_COMPANY_ID}
              data-storefront-id={process.env.NEXT_PUBLIC_UNDERSTORY_STOREFRONT_ID}
              data-experience-id={exp.id}
              data-language="it"
            />
          )}
        </div>
      </div>
    </dialog>
  )
}
