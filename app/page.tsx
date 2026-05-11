import Image from 'next/image'
import { fetchExperiences, type Experience } from '@/lib/understory'

export const revalidate = 60

const STATE_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
  ARCHIVED: 'bg-amber-100 text-amber-700',
  DRAFT: 'bg-blue-100 text-blue-700',
}

type Media = { type: string; url: string; mime_type: string }

function ExperienceCard({ exp }: { exp: Experience }) {
  const media = exp.media as Media[] | undefined
  const coverUrl = media?.find((m) => m.type === 'IMAGE')?.url
  const state = exp.state
  const name = exp.name as string
  const description = exp.description as string | undefined

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {coverUrl ? (
        <div className="relative w-full aspect-video">
          <Image
            src={coverUrl}
            alt={exp.name as string}
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
          <h2 className="font-semibold text-gray-900 leading-snug text-lg">
            {name}
          </h2>
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
          <p className="text-xs text-gray-400 font-mono">{exp.id}</p>
          {process.env.NEXT_PUBLIC_BOOKING_BASE_URL && (
            <a
              href={`${process.env.NEXT_PUBLIC_BOOKING_BASE_URL}/${exp.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Prenota
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function Page() {
  let experiences: Experience[] = []
  let error: string | null = null

  try {
    const data = await fetchExperiences()
    experiences = data.items ?? []
  } catch (err) {
    error = err instanceof Error ? err.message : 'Errore sconosciuto'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Esperienze</h1>
          <p className="text-sm text-gray-500 mt-1">
            Understory · {error ? '–' : `${experiences.length} risultati`}
          </p>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700 font-medium">Errore nel caricamento</p>
            <p className="text-red-500 text-sm mt-1 font-mono">{error}</p>
          </div>
        ) : experiences.length === 0 ? (
          <p className="text-gray-400 text-center py-20">
            Nessuna esperienza trovata
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
