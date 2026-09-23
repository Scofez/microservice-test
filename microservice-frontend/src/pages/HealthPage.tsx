import { useQueries } from '@tanstack/react-query'
import type { JSX } from 'react'

import { callService, services, type ServiceResponse } from '../api/services.ts'
import StopServiceButton from '../components/StopServiceButton.tsx'

const POLL_INTERVAL_MS = 3000

function isHealthy({ status, body }: ServiceResponse): boolean {
  return (
    status === 200 &&
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    body.status === 'ok'
  )
}

export default function HealthPage(): JSX.Element {
  const results = useQueries({
    queries: services.map((service) => ({
      queryKey: ['health', service.name],
      queryFn: () => callService(service.name, '/health'),
      refetchInterval: POLL_INTERVAL_MS,
      retry: false,
    })),
  })

  return (
    <>
      <h1>Service health</h1>
      <p className="muted">Each service is checked every {POLL_INTERVAL_MS / 1000} seconds.</p>

      <div className="health-grid">
        {services.map((service, index) => {
          const { data, error, isPending, dataUpdatedAt, errorUpdatedAt } = results[index]
          const isUp = data !== undefined && !error && isHealthy(data)
          const state = isPending ? 'checking' : isUp ? 'up' : 'down'
          const checkedAt = Math.max(dataUpdatedAt, errorUpdatedAt)

          return (
            <article key={service.name} className={`health-card ${state}`}>
              <h2>{service.label}</h2>
              <p className="muted">localhost:{service.port}</p>
              <p className="health-state">{state.toUpperCase()}</p>
              {error && <p className="muted">{error.message}</p>}
              {checkedAt > 0 && (
                <p className="muted">Last check: {new Date(checkedAt).toLocaleTimeString()}</p>
              )}
              <StopServiceButton service={service} isUp={isUp} />
            </article>
          )
        })}
      </div>
    </>
  )
}
