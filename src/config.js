// src/config.js
import dotenv from 'dotenv'
dotenv.config()

/**
 * Removes surrounding quotes from .env values.
 * Example: '"Hello"' -> 'Hello'
 */
function unquote(val) {
  if (typeof val !== 'string') return val
  return val.replace(/^['"]+|['"]+$/g, '').trim()
}

/**
 * Converts env values to boolean
 */
function parseBool(val, fallback = false) {
  if (val === undefined || val === null) return fallback
  const v = ('' + val).trim().toLowerCase()
  return ['true', '1', 'yes', 'on'].includes(v)
}

/**
 * Converts env values to numbers safely
 */
function parseNumber(val, fallback = null) {
  if (val === undefined || val === '') return fallback
  const n = Number(unquote(val))
  return Number.isNaN(n) ? fallback : n
}

/**
 * Converts comma-separated lists into arrays
 */
function parseList(val, fallback = []) {
  if (!val && val !== '') return fallback
  const raw = unquote(val || '')
  if (raw === '') return []
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}

const env = process.env

export const CONFIG = {
  // ────── Basic Info ──────
  APP_NAME: unquote(env.APP_NAME || 'RAHL_XMD_QUANTUM'),
  APP_VERSION: unquote(env.APP_VERSION || '1.0.0'),
  PORT: parseNumber(env.PORT, 3000),
  NODE_ENV: unquote(env.NODE_ENV || 'production'),

  // ────── Session ──────
  SESSION_ID: unquote(env.SESSION_ID || ''),
  SESSION_PATH: unquote(env.SESSION_PATH || 'auth_info/session.json'),
  PAIRING_URL: unquote(env.PAIRING_URL || 'https://rahl-verse-empire-pair-site.onrender.com'),

  // ────── Owner Info ──────
  OWNER_NAME: unquote(env.OWNER_NAME || 'Lord Rahl'),
  OWNER_NUMBER: unquote(env.OWNER_NUMBER || '254112399557'),
  PREFIX: unquote(env.PREFIX || '.'),
  LANGUAGE: unquote(env.LANGUAGE || 'en'),

  // ────── Display & Themes ──────
  THEME: unquote(env.THEME || 'dark'),
  STATUS_MESSAGE: unquote(env.STATUS_MESSAGE || 'Online'),
  WELCOME_MESSAGE: unquote(env.WELCOME_MESSAGE || 'Welcome!'),
  GOODBYE_MESSAGE: unquote(env.GOODBYE_MESSAGE || 'Goodbye 👋'),
  BOT_BIO: unquote(env.BOT_BIO || 'Automated WhatsApp assistant'),
  STICKER_PACK: unquote(env.STICKER_PACK || 'Lord Rahl Pack'),
  STICKER_AUTHOR: unquote(env.STICKER_AUTHOR || 'LORD RAHL XMD'),
  EMOJI_SET: parseList(env.EMOJI_SET, ['⚡', '🔥', '💀']),
  MENU_HEADER: unquote(env.MENU_HEADER || '🔥 RAHL XMD QUANTUM MENU 🔥'),
  MENU_FOOTER: unquote(env.MENU_FOOTER || '⚡ Crafted by Lord Rahl ⚡'),

  // ────── Logging & Behavior ──────
  LOG_LEVEL: unquote(env.LOG_LEVEL || 'info'),
  LOG_MESSAGES: parseBool(env.LOG_MESSAGES, true),
  SAVE_LOGS: parseBool(env.SAVE_LOGS, false),
  INCLUDE_TIMESTAMP: parseBool(env.INCLUDE_TIMESTAMP, true),
  MAX_LOG_SIZE: unquote(env.MAX_LOG_SIZE || '5MB'),
  ENABLE_CONSOLE_COLORS: parseBool(env.ENABLE_CONSOLE_COLORS, true),
  SHOW_MEMORY_USAGE: parseBool(env.SHOW_MEMORY_USAGE, false),
  ALLOW_PUBLIC_COMMANDS: parseBool(env.ALLOW_PUBLIC_COMMANDS, true),
  ALLOW_PRIVATE_COMMANDS: parseBool(env.ALLOW_PRIVATE_COMMANDS, true),
  ENABLE_COOLDOWN: parseBool(env.ENABLE_COOLDOWN, true),

  // ────── AI & API ──────
  ENABLE_AI: parseBool(env.ENABLE_AI, true),
  OPENAI_API_KEY: unquote(env.OPENAI_API_KEY || ''),
  AI_MODEL: unquote(env.AI_MODEL || 'gpt-4o-mini'),
  AI_TEMPERATURE: parseNumber(env.AI_TEMPERATURE, 0.7),
  TRANSLATE_API_KEY: unquote(env.TRANSLATE_API_KEY || ''),
  IMAGE_API_KEY: unquote(env.IMAGE_API_KEY || ''),
  USE_TEXT_TO_SPEECH: parseBool(env.USE_TEXT_TO_SPEECH, true),
  TTS_VOICE: unquote(env.TTS_VOICE || 'en-US'),
  TTS_RATE: parseNumber(env.TTS_RATE, 1.0),
  AI_REPLY_PREFIX: unquote(env.AI_REPLY_PREFIX || '🤖'),

  // ────── Advanced & Maintenance ──────
  CHECK_UPDATES: parseBool(env.CHECK_UPDATES, true),
  AUTO_RESTART: parseBool(env.AUTO_RESTART, true),
  AUTO_SAVE_INTERVAL: parseNumber(env.AUTO_SAVE_INTERVAL, 60),
  DATABASE_URL: unquote(env.DATABASE_URL || ''),
  CACHE_ENABLED: parseBool(env.CACHE_ENABLED, true),
  CACHE_TTL: parseNumber(env.CACHE_TTL, 3600),
  WEB_DASHBOARD: parseBool(env.WEB_DASHBOARD, false),
  METRICS_ENABLED: parseBool(env.METRICS_ENABLED, false),
  BACKUP_ENABLED: parseBool(env.BACKUP_ENABLED, false),
  BACKUP_INTERVAL: parseNumber(env.BACKUP_INTERVAL, 1440)
                    }
