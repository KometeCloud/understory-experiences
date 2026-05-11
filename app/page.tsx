import { fetchExperiences, type Experience } from '@/lib/understory'

export const revalidate = 60

const STATE_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-500',
  ARCHIVED: 'bg-amber-100 text-amber-700',
  DRAFT: 'bg-blue-100 text-blue-700',
}

function ExperienceCard({ exp }: { exp: Experience }) {
  const name = (exp.name ?? exp.title ?? exp.id) as string
  const description = exp.description as string | undefined
  const state = exp.state

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-gray-900 leading-snug">{name}</h2>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${STATE_COLORS[state] ?? 'bg-gray-100 text-gray-500'}`}
        >
          {state}
        </span>
      </div>

      {description && (
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      )}

      <p className="text-xs text-gray-400 font-mono mt-auto pt-2 border-t border-gray-100">
        {exp.id}
      </p>
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
