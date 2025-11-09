// src/main.js
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import P from 'pino'
import { CONFIG } from './config.js'
import { handleMessage } from './handler/messages.js'
import http from 'http' // keep-alive server for Render

const logger = P({ level: CONFIG.LOG_LEVEL })

async function startBot() {
  try {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    logger.info(`📡 Using Baileys v${version.join('.')} (Latest: ${isLatest})`)

    const { state, saveCreds } = await useMultiFileAuthState(CONFIG.SESSION_PATH)

    const sock = makeWASocket({
      version,
      printQRInTerminal: !CONFIG.SESSION_ID,
      auth: state,
      logger,
      browser: [CONFIG.APP_NAME, 'Chrome', '121.0.0'],
      syncFullHistory: false,
    })

    // 🔁 Connection updates
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update

      if (connection === 'close') {
        const shouldReconnect =
          lastDisconnect?.error instanceof Boom &&
          lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        logger.warn(`❌ Connection closed. Reconnect: ${shouldReconnect}`)
        if (shouldReconnect) startBot()
      } else if (connection === 'open') {
        logger.info(`✅ ${CONFIG.APP_NAME} connected as ${CONFIG.OWNER_NAME}`)
        sock.sendPresenceUpdate('available')
      }
    })

    // 💾 Save credentials automatically
    sock.ev.on('creds.update', saveCreds)

    // 💬 Message handler
    sock.ev.on('messages.upsert', async (msg) => handleMessage(sock, msg))
  } catch (err) {
    logger.error('❌ Fatal error in startBot():', err)
  }
}

// 🟢 Start the bot
startBot()

// 🌐 Minimal HTTP server so Render detects an open port
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      status: 'alive',
      app: CONFIG.APP_NAME,
      owner: CONFIG.OWNER_NAME,
      version: CONFIG.APP_VERSION,
      timestamp: new Date().toISOString(),
    })
  )
})

const PORT = CONFIG.PORT || 3000
server.listen(PORT, () => {
  console.log(`🌐 HTTP keep-alive server running on port ${PORT}`)
})
