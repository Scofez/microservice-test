import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const services = {
  order: 'http://localhost:3001',
  inventory: 'http://localhost:3002',
  notification: 'http://localhost:3003',
}

// The browser only ever talks to Vite's origin, so CORS never applies.
// In production, an API gateway plays this role.
const proxy = Object.fromEntries(
  Object.entries(services).map(([name, target]) => [
    `/api/${name}`,
    {
      target,
      rewrite: (path: string) => path.replace(`/api/${name}`, ''),
    },
  ]),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
})
