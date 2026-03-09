import '@testing-library/jest-dom'
import { randomUUID, webcrypto } from 'crypto'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill para crypto.randomUUID no ambiente de testes
if (typeof global.crypto === 'undefined') {
  global.crypto = {}
}

if (typeof global.crypto.randomUUID === 'undefined') {
  global.crypto.randomUUID = randomUUID
}

// Polyfill para crypto.subtle (Web Crypto API)
if (typeof global.crypto.subtle === 'undefined') {
  global.crypto.subtle = webcrypto.subtle
}

// Polyfill para TextEncoder/TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
