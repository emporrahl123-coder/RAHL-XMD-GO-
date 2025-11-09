// src/handler/messages.js
import { CONFIG } from '../config.js'
import fs from 'fs'
import path from 'path'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const commands = new Map()

// ✅ Async function to load all commands dynamically
async function loadCommands() {
  const cmdDir = path.join(__dirname, '../commands')
  const files = fs.readdirSync(cmdDir).filter((f) => f.endsWith('.js'))

  for (const file of files) {
    try {
      const module = await import(`../commands/${file}`)
      const command = module?.command
      if (command?.name) {
        commands.set(command.name.toLowerCase(), command)
        console.log(`⚙️ Loaded command: ${command.name}`)
      }
    } catch (err) {
      console.error(`❌ Failed to load command ${file}:`, err)
    }
  }
}

// ✅ Main message handler
export async function handleMessage(sock, msg) {
  try {
    const message = msg.messages?.[0]
    if (!message?.message) return

    const from = message.key.remoteJid
    const text =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      message.message?.imageMessage?.caption ||
      ''

    if (!text.startsWith(CONFIG.PREFIX)) return

    const args = text.slice(CONFIG.PREFIX.length).trim().split(/\s+/)
    const cmdName = args.shift().toLowerCase()
    const cmd = commands.get(cmdName)

    if (!cmd) {
      await sock.sendMessage(from, { text: `❓ Unknown command: *${cmdName}*` })
      return
    }

    console.log(`⚡ ${CONFIG.APP_NAME}: ${cmdName} from ${from}`)
    await cmd.execute(sock, msg, { from, args, text, CONFIG })
  } catch (err) {
    console.error('⚠️ Error in handleMessage:', err)
  }
}

// ✅ Load commands when this module is first imported
await loadCommands()
