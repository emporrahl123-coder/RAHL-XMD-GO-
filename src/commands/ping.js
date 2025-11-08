// src/commands/ping.js
export const command = {
  name: 'ping',
  description: 'Check bot response time',
  async execute(sock, msg, { from }) {
    const start = Date.now()
    await sock.sendMessage(from, { text: '🏓 Pinging...' })
    const latency = Date.now() - start
    await sock.sendMessage(from, { text: `✅ Pong! ${latency}ms` })
  },
}
