import { ITaskRepository } from '@/app/_domain/repositories/ITaskRepository';
import { Task, TaskJSON } from '@/app/_domain/entities/Task';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  deleteDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

export class TaskRepositoryFirebase implements ITaskRepository {
  private collectionName = 'tasks';

  private getUserId(): string {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  async save(task: Task): Promise<void> {
    const userId = this.getUserId();
    const taskData = {
      ...task.toJSON(),
      userId,
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(doc(db, this.collectionName, task.id), taskData);
  }

  async findAll(): Promise<Task[]> {
    const userId = this.getUserId();
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as TaskJSON;
      return Task.fromJSON(data);
    });
  }

  async findById(id: string): Promise<Task | null> {
    const userId = this.getUserId();
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data() as TaskJSON & { userId: string };
    
    if (data.userId !== userId) {
      return null;
    }
    
    return Task.fromJSON(data);
  }

  async delete(id: string): Promise<void> {
    const userId = this.getUserId();
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as { userId: string };
      if (data.userId === userId) {
        await deleteDoc(docRef);
      }
    }
  }
}
