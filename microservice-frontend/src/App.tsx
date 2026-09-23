import type { JSX } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

import Layout from './components/Layout.tsx'
import HealthPage from './pages/HealthPage.tsx'
import InventoryPage from './pages/InventoryPage.tsx'
import NotificationsPage from './pages/NotificationsPage.tsx'
import OrdersPage from './pages/OrdersPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/health" replace /> },
      { path: 'health', element: <HealthPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
    ],
  },
])

export default function App(): JSX.Element {
  return <RouterProvider router={router} />
}
