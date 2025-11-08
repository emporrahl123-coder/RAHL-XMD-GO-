// src/commands/stats.js
import os from 'os'

export const command = {
  name: 'stats',
  description: 'Show system and runtime information',
  async execute(sock, msg, { from, CONFIG }) {
    const uptime = process.uptime()
    const upH = Math.floor(uptime / 3600)
    const upM = Math.floor((uptime % 3600) / 60)
    const upS = Math.floor(uptime % 60)
    const ram = (os.totalmem() - os.freemem()) / 1024 / 1024

    const text = `📊 *${CONFIG.APP_NAME} Stats*\n
🕒 Uptime: ${upH}h ${upM}m ${upS}s
💾 RAM: ${ram.toFixed(0)} MB
🌐 Node: ${process.version}
⚙️ Platform: ${os.type()} ${os.release()}
📡 Prefix: ${CONFIG.PREFIX}`

    await sock.sendMessage(from, { text })
  }
}
