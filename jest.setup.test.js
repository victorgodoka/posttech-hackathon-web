// Mock Firebase para testes
jest.mock('./app/_infrastructure/persistence/firebase/firebaseConfig', () => ({
  db: {},
  auth: {
    currentUser: null,
  },
  app: {},
}));

// Mock IndexedDB para testes
require('fake-indexeddb/auto');

// Polyfill para structuredClone (Node < 17)
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock environment variables para testes
process.env.NEXT_PUBLIC_USE_FIREBASE = 'false';
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789';
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = '1:123456789:web:abcdef';
