import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { JSX } from 'react'

import { callService, type ServiceInfo } from '../api/services.ts'

interface StopServiceButtonProps {
  service: ServiceInfo
  isUp: boolean
}

export default function StopServiceButton({ service, isUp }: StopServiceButtonProps): JSX.Element {
  const queryClient = useQueryClient()

  const stop = useMutation({
    mutationFn: () => callService(service.name, '/admin/shutdown', 'POST'),
    // Refresh the card now instead of waiting for the next poll.
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['health', service.name] }),
  })

  // Without ENABLE_DEV_TOOLS the route does not exist: Express answers 404 with an HTML page.
  const isDisabledOnServer =
    stop.error !== null || (stop.data !== undefined && stop.data.status === 404)

  return (
    <div className="stop">
      <button
        type="button"
        className="danger"
        disabled={!isUp || stop.isPending}
        onClick={() => stop.mutate()}
      >
        {stop.isPending ? 'Stopping…' : 'Stop'}
      </button>
      {isDisabledOnServer && (
        <p className="muted" role="alert">
          Shutdown is off. Start the service with <code>npm run dev</code>.
        </p>
      )}
    </div>
  )
}
