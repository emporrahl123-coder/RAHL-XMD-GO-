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
import http from 'http' // ✅ Added for Render keep-alive

const logger = P({ level: CONFIG.LOG_LEVEL })

async function startBot() {
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

  // 💾 Auto-save credentials
  sock.ev.on('creds.update', saveCreds)

  // 💬 Message listener
  sock.ev.on('messages.upsert', async (msg) => handleMessage(sock, msg))

  return sock
}

// 🟢 Start the bot
startBot()

// 🌐 Simple HTTP keep-alive server (Render requires a listening port)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(`${CONFIG.APP_NAME} is alive and running ✅`)
})

// Start server on configured port (or 3000 fallback)
server.listen(CONFIG.PORT || 3000, () => {
  console.log(`🌐 HTTP Keep-alive running on port ${CONFIG.PORT || 3000}`)
})// src/main.js
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import P from 'pino'
import { CONFIG } from './config.js'
import { handleMessage } from './handler/messages.js'
import http from 'http' // ✅ Added for Render keep-alive

const logger = P({ level: CONFIG.LOG_LEVEL })

async function startBot() {
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

  // 💾 Auto-save credentials
  sock.ev.on('creds.update', saveCreds)

  // 💬 Message listener
  sock.ev.on('messages.upsert', async (msg) => handleMessage(sock, msg))

  return sock
}

// 🟢 Start the bot
startBot()

// 🌐 Simple HTTP keep-alive server (Render requires a listening port)
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(`${CONFIG.APP_NAME} is alive and running ✅`)
})

// Start server on configured port (or 3000 fallback)
server.listen(CONFIG.PORT || 3000, () => {
  console.log(`🌐 HTTP Keep-alive running on port ${CONFIG.PORT || 3000}`)
})
