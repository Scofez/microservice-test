import type { JSX } from 'react'
import { NavLink, Outlet } from 'react-router'

const tabs = [
  { to: '/health', label: 'Health' },
  { to: '/orders', label: 'Orders' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/notifications', label: 'Notifications' },
]

export default function Layout(): JSX.Element {
  return (
    <>
      <header className="topbar">
        <strong>Microservices lab</strong>
        <nav>
          {tabs.map((tab) => (
            <NavLink key={tab.to} to={tab.to}>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
