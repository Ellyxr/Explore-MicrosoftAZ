import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.disable('x-powered-by')
const port = Number(process.env.PORT) || 3000
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

app.get('/api/hello', (_request, response) => {
  response.json({ message: 'Hello from the Express API!' })
})

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
