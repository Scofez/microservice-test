import type { UseQueryResult } from '@tanstack/react-query'
import type { JSX } from 'react'

import type { ServiceInfo, ServiceResponse } from '../api/services.ts'

interface ResponseViewerProps {
  service: ServiceInfo
  path: string
  query: UseQueryResult<ServiceResponse>
}

function statusTone(status: number): string {
  if (status < 300) return 'ok'
  if (status < 500) return 'warn'
  return 'bad'
}

export default function ResponseViewer({ service, path, query }: ResponseViewerProps): JSX.Element {
  const { data, error, isPending, isFetching } = query

  return (
    <section className="response">
      <header className="response-header">
        <code>GET {path}</code>
        <span className="muted">
          → {service.label} :{service.port}
        </span>
        {isFetching && <span className="muted">loading…</span>}
      </header>

      {isPending && !error && <p className="muted">Waiting for the first answer…</p>}

      {error && (
        <p className="badge bad" role="alert">
          {error.message}
        </p>
      )}

      {data && (
        <>
          <span className={`badge ${statusTone(data.status)}`}>HTTP {data.status}</span>
          <pre>{JSON.stringify(data.body, null, 2)}</pre>
        </>
      )}
    </section>
  )
}
