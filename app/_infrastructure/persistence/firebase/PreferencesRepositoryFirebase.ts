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
      userId: preferences.userId,
      layoutMode: preferences.layoutMode,
      customColumns: preferences.customColumns,
      allowExtraCustomColumns: preferences.allowExtraCustomColumns,
      overloadBehavior: preferences.overloadBehavior,
      visualComplexity: preferences.visualComplexity,
      informationDensity: preferences.informationDensity,
      textSize: preferences.textSize,
      notificationTiming: preferences.notificationTiming,
      taskCreationMode: preferences.taskCreationMode,
      pomodoroSettings: preferences.pomodoroSettings,
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(doc(db, this.collectionName, userId), preferencesData);
  }

  async findByUserId(userId: string): Promise<UserPreferences | null> {
    // Verificar se há usuário autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      // Se não há usuário autenticado, retornar null ao invés de tentar acessar Firestore
      return null;
    }
    
    // Verificar se o userId solicitado é o mesmo do usuário autenticado
    if (currentUser.uid !== userId) {
      throw new Error('Unauthorized: Cannot access preferences of another user');
    }
    
    const docRef = doc(db, this.collectionName, userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    
    // Converter para UserPreferences usando fromPersistence
    // Garantir que todos os campos obrigatórios existam
    const prefsData = {
      userId: data.userId || userId,
      layoutMode: data.layoutMode || 'list',
      customColumns: data.customColumns || [],
      allowExtraCustomColumns: data.allowExtraCustomColumns ?? false,
      overloadBehavior: data.overloadBehavior || 'suggest-move',
      visualComplexity: data.visualComplexity || 'balanced',
      informationDensity: data.informationDensity || 'complete',
      textSize: data.textSize || 'medium',
      notificationTiming: data.notificationTiming || 'only-when-asked',
      taskCreationMode: data.taskCreationMode || 'simple',
      pomodoroSettings: data.pomodoroSettings || {
        workDuration: 25,
        breakDuration: 5,
      },
      updatedAt: data.updatedAt?.toDate?.() || new Date(),
    };
    
    return UserPreferences.fromPersistence(prefsData as any);
  }

  async getDefault(): Promise<UserPreferences | null> {
    return null;
  }
}
