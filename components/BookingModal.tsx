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
  const coverUrl = (exp.media as Media[] | undefined)?.find((m) => m.type === 'IMAGE')?.url

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
        {/* Experience info */}
        {coverUrl && (
          <div className="relative w-full aspect-video shrink-0">
            <Image
              src={coverUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="672px"
            />
          </div>
        )}

        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
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
