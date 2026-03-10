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

// Instanciar repositórios baseado na escolha
const userRepository = USE_FIREBASE ? new UserRepositoryFirebase() : new UserRepositoryIDB();
const authRepository = USE_FIREBASE ? new AuthRepositoryFirebase() : new AuthRepositoryIDB();
const taskRepository = USE_FIREBASE ? new TaskRepositoryFirebase() : new TaskRepositoryIDB();
const preferencesRepository = USE_FIREBASE ? new PreferencesRepositoryFirebase() : new PreferencesRepositoryIDB();

export const useCases = {
  registerUser: new RegisterUser(userRepository, USE_FIREBASE ? authRepository as any : undefined),
  loginUser: new LoginUser(userRepository, authRepository),
  loginWithGoogle: USE_FIREBASE ? new LoginWithGoogle(userRepository, authRepository as any) : null,
  logoutUser: new LogoutUser(authRepository),
  getCurrentUser: new GetCurrentUser(userRepository, authRepository),
  continueAsGuest: new ContinueAsGuest(authRepository),
  addTask: new AddTask(taskRepository),
  getTasks: new GetTasks(taskRepository),
  updateTaskState: new UpdateTaskState(taskRepository),
  deleteTask: new DeleteTask(taskRepository),
  addTaskStep: new AddTaskStep(taskRepository),
  toggleTaskStep: new ToggleTaskStep(taskRepository),
  removeTaskStep: new RemoveTaskStep(taskRepository),
  startTaskTimer: new StartTaskTimer(taskRepository),
  pauseTaskTimer: new PauseTaskTimer(taskRepository),
  resetTaskTimer: new ResetTaskTimer(taskRepository),
  updateTaskTimer: new UpdateTaskTimer(taskRepository),
  completeTimerCycle: new CompleteTimerCycle(taskRepository),
  getUserPreferences: new GetUserPreferences(preferencesRepository),
  updateUserPreferences: new UpdateUserPreferences(preferencesRepository),
  updateTaskCustomColumn: new UpdateTaskCustomColumn(taskRepository),
};
