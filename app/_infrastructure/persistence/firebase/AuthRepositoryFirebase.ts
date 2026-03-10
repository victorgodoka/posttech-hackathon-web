import { IAuthRepository } from '@/app/_domain/repositories/IAuthRepository';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export class AuthRepositoryFirebase implements IAuthRepository {
  async login(email: string, password: string): Promise<string> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user.uid;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid credentials');
      }
      throw error;
    }
  }

  async loginWithGoogle(): Promise<{ userId: string; email: string; name: string; isNewUser: boolean }> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      return {
        userId: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        isNewUser: result.user.metadata.creationTime === result.user.metadata.lastSignInTime,
      };
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelado');
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up bloqueado pelo navegador');
      }
      throw error;
    }
  }

  async register(email: string, password: string): Promise<string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user.uid;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use');
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mindease-current-user');
      localStorage.removeItem('mindease-is-guest');
    }
  }

  async getCurrentUserId(): Promise<string | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
        unsubscribe();
        resolve(user ? user.uid : null);
      });
    });
  }

  async saveSession(userId: string): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindease-current-user', userId);
    }
  }

  async getSession(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mindease-current-user');
    }
    return null;
  }

  async clearSession(): Promise<void> {
    await this.logout();
  }
}
