import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.js'
import notesRoutes from './routes/notes.js'
import profileRoutes from './routes/profile.js'
import statsRoutes from './routes/stats.js'

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/stats', statsRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
