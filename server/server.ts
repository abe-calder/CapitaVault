import express from 'express'
import * as Path from 'node:path'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import assetRoutes from './routes/assets.ts'
import userRoutes from './routes/users.ts'
import polygonRoutes from './routes/polygon.ts'

const app = express()

const server = createServer(app)
const wss = new WebSocketServer({ server })

app.use(express.json())

app.use('/api/v1/users', userRoutes)

app.use('/api/v1/assets', assetRoutes)

app.use('/api/v1/polygon', polygonRoutes)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(Path.resolve('public')))
  app.use('/assets', express.static(Path.resolve('./dist/assets')))
  app.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

wss.on('connection', (ws) => {
  console.log('Client connected')

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`)
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})


export { server, wss}
