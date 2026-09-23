import { useQuery } from '@tanstack/react-query'
import { useState, type FormEvent, type JSX } from 'react'

import { callService, type ServiceInfo } from '../api/services.ts'
import ResponseViewer from './ResponseViewer.tsx'

interface ServiceExplorerProps {
  service: ServiceInfo
  inputLabel: string
  samples: string[]
  buildPath: (value: string) => string
}

export default function ServiceExplorer({
  service,
  inputLabel,
  samples,
  buildPath,
}: ServiceExplorerProps): JSX.Element {
  const [draft, setDraft] = useState(samples[0] ?? '')
  const [value, setValue] = useState(draft)

  // encodeURIComponent stops input such as "../health" from reaching another route.
  const path = buildPath(encodeURIComponent(value))

  const query = useQuery({
    queryKey: [service.name, path],
    queryFn: () => callService(service.name, path),
    retry: false,
  })

  const select = (next: string) => {
    setDraft(next)
    setValue(next)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValue(draft.trim())
  }

  return (
    <>
      <form className="explorer" onSubmit={handleSubmit}>
        <label>
          {inputLabel}
          <input value={draft} onChange={(event) => setDraft(event.target.value)} />
        </label>
        <button type="submit">Fetch</button>
      </form>

      <div className="samples">
        <span className="muted">Try:</span>
        {samples.map((sample) => (
          <button
            key={sample}
            type="button"
            className={sample === value ? 'chip active' : 'chip'}
            onClick={() => select(sample)}
          >
            {sample}
          </button>
        ))}
      </div>

      <ResponseViewer service={service} path={path} query={query} />
    </>
  )
}
