import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.js'
import notesRoutes from './routes/notes.js'
import profileRoutes from './routes/profile.js'
import statsRoutes from './routes/stats.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const BASE_PORT = Number(process.env.PORT) || 4000

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }),
)

app.use(express.json())
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/stats', statsRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

function start(port: number) {
  const server = app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`)
  })

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE' && port - BASE_PORT < 10) {
      console.warn(`Port ${port} in use, trying ${port + 1}`)
      start(port + 1)
    } else {
      console.error('Server error:', err.message)
      process.exit(1)
    }
  })

  function cleanup() {
    server.close(() => process.exit(0))
  }
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

start(BASE_PORT)

export default app
