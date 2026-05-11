import { fetchExperiences, type ExperienceWithPrice } from '@/lib/understory'
import { ExperienceCard } from '@/components/ExperienceCard'

export const revalidate = 60

export default async function Page() {
  let experiences: ExperienceWithPrice[] = []
  let error: string | null = null

  try {
    experiences = await fetchExperiences()
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
          <p className="text-gray-400 text-center py-20">Nessuna esperienza trovata</p>
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
