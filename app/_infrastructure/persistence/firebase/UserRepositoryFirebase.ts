import { IUserRepository } from '@/app/_domain/repositories/IUserRepository';
import { User, UserJSON } from '@/app/_domain/entities/User';
import { Email } from '@/app/_domain/value-objects/Email';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export class UserRepositoryFirebase implements IUserRepository {
  private collectionName = 'users';

  async save(user: User): Promise<void> {
    const userData = {
      ...user.toJSON(),
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(doc(db, this.collectionName, user.id), userData);
  }

  async findById(id: string): Promise<User | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data() as UserJSON;
    return User.fromJSON(data);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const q = query(
      collection(db, this.collectionName),
      where('email', '==', email.getValue())
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const data = querySnapshot.docs[0].data() as UserJSON;
    return User.fromJSON(data);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, this.collectionName, id));
  }
}
