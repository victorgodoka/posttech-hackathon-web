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
      description?: string;
      category?: string;
      state: 'active' | 'paused' | 'done';
      createdAt: string;
      steps?: Array<{
        id: string;
        text: string;
        completed: boolean;
      }>;
      timer?: {
        mode: 'work' | 'break' | 'idle';
        remainingSeconds: number;
        isRunning: boolean;
        startedAt?: number;
      };
      customColumnId?: string;
      usePomodoro?: boolean;
    };
  };
  preferences: {
    key: string;
    value: any;
  };
}

let dbInstance: IDBPDatabase<MindEaseDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<MindEaseDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<MindEaseDB>('mindease-db', 3, {
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

      if (oldVersion < 3 && !db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'userId' });
      }
    },
  });

  return dbInstance;
}
