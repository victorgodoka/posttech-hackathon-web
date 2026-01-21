import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MindEaseDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      email: string;
      name: string;
      hashedPassword: string;
      createdAt: string;
    };
    indexes: { 'by-email': string };
  };
  auth: {
    key: string;
    value: {
      key: string;
      value: string;
    };
  };
  tasks: {
    key: string;
    value: {
      id: string;
      text: string;
      state: 'active' | 'paused' | 'done';
      createdAt: string;
    };
  };
}

let dbInstance: IDBPDatabase<MindEaseDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<MindEaseDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<MindEaseDB>('mindease-db', 2, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-email', 'email', { unique: true });
      }

      if (!db.objectStoreNames.contains('auth')) {
        db.createObjectStore('auth', { keyPath: 'key' });
      }

      if (oldVersion < 2 && !db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}
