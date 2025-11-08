// src/commands/owner.js
export const command = {
  name: 'owner',
  description: 'Display owner information',
  async execute(sock, msg, { from, CONFIG }) {
    const ownerInfo = `👑 *Owner:* ${CONFIG.OWNER_NAME}\n📱 *Number:* wa.me/${CONFIG.OWNER_NUMBER}`
    await sock.sendMessage(from, { text: ownerInfo })
  }
}
