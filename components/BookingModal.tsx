'use client'

import { useEffect, useRef } from 'react'

export function BookingModal({
  experienceId,
  open,
  onClose,
}: {
  experienceId: string
  open: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
      // Let React flush the widget div into the DOM, then trigger re-scan
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

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-2xl rounded-2xl p-0 shadow-2xl open:flex open:flex-col"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <span className="font-semibold text-gray-900">Prenota</span>
        <button
          onClick={onClose}
          aria-label="Chiudi"
          className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition-colors"
        >
          ×
        </button>
      </div>

      <div className="p-4 overflow-auto">
        {open && (
          <div
            className="understory-booking-widget"
            data-company-id={process.env.NEXT_PUBLIC_UNDERSTORY_COMPANY_ID}
            data-storefront-id={process.env.NEXT_PUBLIC_UNDERSTORY_STOREFRONT_ID}
            data-experience-id={experienceId}
            data-language="it"
          />
        )}
      </div>
    </dialog>
  )
}
