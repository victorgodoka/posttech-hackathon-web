import { IPreferencesRepository } from '@/app/_domain/repositories/IPreferencesRepository';
import { UserPreferences } from '@/app/_domain/entities/UserPreferences';
import { 
  doc, 
  setDoc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

export class PreferencesRepositoryFirebase implements IPreferencesRepository {
  private collectionName = 'preferences';

  private getUserId(): string {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  async save(preferences: UserPreferences): Promise<void> {
    const userId = this.getUserId();
    const preferencesData = {
      ...preferences,
      userId,
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(doc(db, this.collectionName, userId), preferencesData);
  }

  async findByUserId(userId: string): Promise<UserPreferences | null> {
    const docRef = doc(db, this.collectionName, userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return data as UserPreferences;
  }

  async getDefault(): Promise<UserPreferences | null> {
    return null;
  }
}
