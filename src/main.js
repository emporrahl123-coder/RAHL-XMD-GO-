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

  // Log connection updates
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

  // Save credentials automatically
  sock.ev.on('creds.update', saveCreds)

  // Message events
  sock.ev.on('messages.upsert', async (msg) => handleMessage(sock, msg))

  return sock
}

startBot()
