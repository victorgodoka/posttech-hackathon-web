import { UserRepositoryIDB } from '../persistence/idb/UserRepositoryIDB';
import { AuthRepositoryIDB } from '../persistence/idb/AuthRepositoryIDB';
import { TaskRepositoryIDB } from '../persistence/idb/TaskRepositoryIDB';
import { RegisterUser } from '@/app/_application/use-cases/RegisterUser';
import { LoginUser } from '@/app/_application/use-cases/LoginUser';
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

const userRepository = new UserRepositoryIDB();
const authRepository = new AuthRepositoryIDB();
const taskRepository = new TaskRepositoryIDB();

export const useCases = {
  registerUser: new RegisterUser(userRepository),
  loginUser: new LoginUser(userRepository, authRepository),
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
};
