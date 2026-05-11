'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
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

  const name = exp.name as string
  const description = exp.description as string | undefined
  const images = (exp.media as Media[] | undefined)?.filter((m) => m.type === 'IMAGE') ?? []

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
        {/* Photo gallery — horizontal scroll */}
        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto p-3 shrink-0 snap-x snap-mandatory">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative shrink-0 w-72 aspect-video rounded-xl overflow-hidden snap-start"
              >
                <Image
                  src={img.url}
                  alt={`${name} – foto ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="288px"
                />
              </div>
            ))}
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
