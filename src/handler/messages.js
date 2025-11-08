// src/handler/messages.js
import { CONFIG } from '../config.js'
import fs from 'fs'
import path from 'path'

const commands = new Map()

// Auto-load all command files
const cmdDir = path.resolve('src/commands')
fs.readdirSync(cmdDir).forEach((file) => {
  if (file.endsWith('.js')) {
    const { command } = await import(`../commands/${file}`)
    if (command?.name) commands.set(command.name, command)
  }
})

export async function handleMessage(sock, msg) {
  try {
    const message = msg.messages?.[0]
    if (!message?.message) return

    const from = message.key.remoteJid
    const type = Object.keys(message.message)[0]
    const text =
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      ''

    if (!text.startsWith(CONFIG.PREFIX)) return

    const args = text.slice(CONFIG.PREFIX.length).trim().split(/\s+/)
    const cmdName = args.shift().toLowerCase()
    const cmd = commands.get(cmdName)
    if (!cmd) return

    // Run command
    await cmd.execute(sock, msg, { from, args, text, CONFIG })
  } catch (err) {
    console.error('⚠️ Error in handleMessage:', err)
  }
}
