// IndexedDB Repositories
import { UserRepositoryIDB } from '../persistence/idb/UserRepositoryIDB';
import { AuthRepositoryIDB } from '../persistence/idb/AuthRepositoryIDB';
import { TaskRepositoryIDB } from '../persistence/idb/TaskRepositoryIDB';
import { PreferencesRepositoryIDB } from '../persistence/idb/PreferencesRepositoryIDB';

// Firebase Repositories
import { UserRepositoryFirebase } from '../persistence/firebase/UserRepositoryFirebase';
import { AuthRepositoryFirebase } from '../persistence/firebase/AuthRepositoryFirebase';
import { TaskRepositoryFirebase } from '../persistence/firebase/TaskRepositoryFirebase';
import { PreferencesRepositoryFirebase } from '../persistence/firebase/PreferencesRepositoryFirebase';

// Use Cases
import { RegisterUser } from '@/app/_application/use-cases/RegisterUser';
import { LoginUser } from '@/app/_application/use-cases/LoginUser';
import { LoginWithGoogle } from '@/app/_application/use-cases/LoginWithGoogle';
import { LogoutUser } from '@/app/_application/use-cases/LogoutUser';
import { GetCurrentUser } from '@/app/_application/use-cases/GetCurrentUser';
import { ContinueAsGuest } from '@/app/_application/use-cases/ContinueAsGuest';
import { AddTask } from '@/app/_application/use-cases/AddTask';
import { GetTasks } from '@/app/_application/use-cases/GetTasks';
import { UpdateTaskState } from '@/app/_application/use-cases/UpdateTaskState';
import { DeleteTask } from '@/app/_application/use-cases/DeleteTask';
import { AddTaskStep } from '@/app/_application/use-cases/AddTaskStep';
import { ToggleTaskStep } from '@/app/_application/use-cases/ToggleTaskStep';
import { RemoveTaskStep } from '@/app/_application/use-cases/RemoveTaskStep';
import { StartTaskTimer } from '@/app/_application/use-cases/StartTaskTimer';
import { PauseTaskTimer } from '@/app/_application/use-cases/PauseTaskTimer';
import { ResetTaskTimer } from '@/app/_application/use-cases/ResetTaskTimer';
import { UpdateTaskTimer } from '@/app/_application/use-cases/UpdateTaskTimer';
import { CompleteTimerCycle } from '@/app/_application/use-cases/CompleteTimerCycle';
import { GetUserPreferences } from '@/app/_application/use-cases/GetUserPreferences';
import { UpdateUserPreferences } from '@/app/_application/use-cases/UpdateUserPreferences';
import { UpdateTaskCustomColumn } from '@/app/_application/use-cases/UpdateTaskCustomColumn';

// Escolher backend baseado em variável de ambiente
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true';

// Função para verificar se está no modo guest
function isGuestMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const session = localStorage.getItem('guest-mode');
    return session === 'true';
  } catch {
    return false;
  }
}

// Lazy getters para repositórios
function getUserRepository() {
  return USE_FIREBASE ? new UserRepositoryFirebase() : new UserRepositoryIDB();
}

function getAuthRepository() {
  return USE_FIREBASE ? new AuthRepositoryFirebase() : new AuthRepositoryIDB();
}

function getTaskRepository() {
  // Tasks usam IndexedDB no modo guest
  return (USE_FIREBASE && !isGuestMode()) ? new TaskRepositoryFirebase() : new TaskRepositoryIDB();
}

function getPreferencesRepository() {
  // Preferences usam IndexedDB no modo guest
  return (USE_FIREBASE && !isGuestMode()) ? new PreferencesRepositoryFirebase() : new PreferencesRepositoryIDB();
}

// Use cases com lazy initialization
export const useCases = {
  get registerUser() {
    return new RegisterUser(getUserRepository(), USE_FIREBASE ? getAuthRepository() as any : undefined);
  },
  get loginUser() {
    return new LoginUser(getUserRepository(), getAuthRepository());
  },
  get loginWithGoogle() {
    return USE_FIREBASE ? new LoginWithGoogle(getUserRepository(), getAuthRepository() as any) : null;
  },
  get logoutUser() {
    return new LogoutUser(getAuthRepository());
  },
  get getCurrentUser() {
    return new GetCurrentUser(getUserRepository(), getAuthRepository());
  },
  get continueAsGuest() {
    return new ContinueAsGuest(getAuthRepository());
  },
  get addTask() {
    return new AddTask(getTaskRepository());
  },
  get getTasks() {
    return new GetTasks(getTaskRepository());
  },
  get updateTaskState() {
    return new UpdateTaskState(getTaskRepository());
  },
  get deleteTask() {
    return new DeleteTask(getTaskRepository());
  },
  get addTaskStep() {
    return new AddTaskStep(getTaskRepository());
  },
  get toggleTaskStep() {
    return new ToggleTaskStep(getTaskRepository());
  },
  get removeTaskStep() {
    return new RemoveTaskStep(getTaskRepository());
  },
  get startTaskTimer() {
    return new StartTaskTimer(getTaskRepository());
  },
  get pauseTaskTimer() {
    return new PauseTaskTimer(getTaskRepository());
  },
  get resetTaskTimer() {
    return new ResetTaskTimer(getTaskRepository());
  },
  get updateTaskTimer() {
    return new UpdateTaskTimer(getTaskRepository());
  },
  get completeTimerCycle() {
    return new CompleteTimerCycle(getTaskRepository());
  },
  get getUserPreferences() {
    return new GetUserPreferences(getPreferencesRepository());
  },
  get updateUserPreferences() {
    return new UpdateUserPreferences(getPreferencesRepository());
  },
  get updateTaskCustomColumn() {
    return new UpdateTaskCustomColumn(getTaskRepository());
  },
};
