import { useQuery } from '@tanstack/react-query'
import type { JSX } from 'react'

import { callService, serviceByName } from '../api/services.ts'
import ResponseViewer from '../components/ResponseViewer.tsx'

const notificationService = serviceByName.notification
const PATH = '/notifications'

export default function NotificationsPage(): JSX.Element {
  const query = useQuery({
    queryKey: [notificationService.name, PATH],
    queryFn: () => callService(notificationService.name, PATH),
    retry: false,
  })

  return (
    <>
      <h1>notification-service</h1>
      <p className="muted">
        <code>GET /notifications</code> lists the sent messages. The list stays empty until Step 5
        publishes events.
      </p>
      <button type="button" onClick={() => query.refetch()}>
        Refresh
      </button>
      <ResponseViewer service={notificationService} path={PATH} query={query} />
    </>
  )
}
