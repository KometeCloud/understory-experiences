'use client'

import Image from 'next/image'
import { useState } from 'react'
import { BookingModal } from './BookingModal'
import type { ExperienceWithPrice } from '@/lib/understory'

const STATE_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
  ARCHIVED: 'bg-amber-100 text-amber-700',
  DRAFT: 'bg-blue-100 text-blue-700',
}

type Media = { type: string; url: string; mime_type: string }

export function ExperienceCard({ exp }: { exp: ExperienceWithPrice }) {
  const [bookingOpen, setBookingOpen] = useState(false)

  const media = exp.media as Media[] | undefined
  const coverUrl = media?.find((m) => m.type === 'IMAGE')?.url
  const name = exp.name as string
  const description = exp.description as string | undefined
  const state = exp.state

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
        {coverUrl ? (
          <div className="relative w-full aspect-video">
            <Image
              src={coverUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
            Nessuna foto
          </div>
        )}

        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold text-gray-900 leading-snug text-lg">{name}</h2>
            <span
              className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${STATE_COLORS[state] ?? 'bg-gray-100 text-gray-500'}`}
            >
              {state}
            </span>
          </div>

          {description && (
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          )}

          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
            {exp.priceFrom ? (
              <p className="text-sm font-semibold text-gray-900">
                Da {exp.priceFrom} <span className="text-xs font-normal text-gray-500">/ persona</span>
              </p>
            ) : (
              <span />
            )}
            <button
              onClick={() => setBookingOpen(true)}
              className="text-sm font-medium bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Prenota
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        exp={exp}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  )
}
