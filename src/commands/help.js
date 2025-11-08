// src/commands/help.js
import fs from 'fs'
import path from 'path'

export const command = {
  name: 'help',
  description: 'Show all available commands',
  async execute(sock, msg, { from, CONFIG }) {
    const cmdDir = path.resolve('src/commands')
    const files = fs.readdirSync(cmdDir).filter(f => f.endsWith('.js'))
    const cmds = []

    for (const file of files) {
      const { command } = await import(`../commands/${file}`)
      if (command && command.name !== 'help')
        cmds.push(`• *${CONFIG.PREFIX}${command.name}* — ${command.description || ''}`)
    }

    const menu = [
      `${CONFIG.MENU_HEADER}`,
      '',
      ...cmds.sort(),
      '',
      `${CONFIG.MENU_FOOTER}`
    ].join('\n')

    await sock.sendMessage(from, { text: menu })
  }
}
