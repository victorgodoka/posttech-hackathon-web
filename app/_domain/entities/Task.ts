import { TaskCategory } from './TaskCategory';

export type TaskState = 'active' | 'paused' | 'done';

export interface TaskStep {
  id: string;
  text: string;
  completed: boolean;
}

export type TimerMode = 'work' | 'break' | 'idle';

export interface TaskTimer {
  mode: TimerMode;
  remainingSeconds: number;
  isRunning: boolean;
  startedAt?: number;
}

export interface TaskProps {
  id: string;
  text: string;
  description?: string;
  category: TaskCategory;
  state: TaskState;
  createdAt: Date;
  steps: TaskStep[];
  timer?: TaskTimer;
  customColumnId?: string;
  usePomodoro: boolean;
}

export interface TaskJSON {
  id: string;
  text: string;
  description?: string;
  category?: string;
  state: string;
  createdAt: string;
  steps?: TaskStep[];
  timer?: TaskTimer;
  customColumnId?: string;
  usePomodoro?: boolean;
}

export class Task {
  private constructor(private props: TaskProps) {}

  static create(text: string, category: TaskCategory = 'other', description?: string, customColumnId?: string, usePomodoro: boolean = true): Task {
    return new Task({
      id: crypto.randomUUID(),
      text,
      usePomodoro,
      description,
      category,
      state: 'active',
      createdAt: new Date(),
      steps: [],
      timer: {
        mode: 'idle',
        remainingSeconds: 25 * 60,
        isRunning: false,
      },
      customColumnId,
    });
  }

  static fromPersistence(props: TaskProps): Task {
    return new Task(props);
  }

  get id(): string {
    return this.props.id;
  }

  get text(): string {
    return this.props.text;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get category(): TaskCategory {
    return this.props.category;
  }

  get state(): TaskState {
    return this.props.state;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get steps(): TaskStep[] {
    return this.props.steps;
  }

  get timer(): TaskTimer {
    return this.props.timer || {
      mode: 'idle',
      remainingSeconds: 25 * 60,
      isRunning: false,
    };
  }

  get customColumnId(): string | undefined {
    return this.props.customColumnId;
  }

  get usePomodoro(): boolean {
    return this.props.usePomodoro;
  }

  updateText(newText: string): void {
    this.props.text = newText;
  }

  updateState(state: TaskState): void {
    this.props.state = state;
  }

  updateCustomColumnId(columnId: string | undefined): void {
    this.props.customColumnId = columnId;
  }

  pause(): void {
    this.props.state = 'paused';
  }

  resume(): void {
    this.props.state = 'active';
  }

  complete(): void {
    this.props.state = 'done';
  }

  addStep(text: string): void {
    const step: TaskStep = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    this.props.steps.push(step);
  }

  toggleStep(stepId: string): void {
    const step = this.props.steps.find(s => s.id === stepId);
    if (step) {
      step.completed = !step.completed;
    }
  }

  removeStep(stepId: string): void {
    this.props.steps = this.props.steps.filter(s => s.id !== stepId);
  }

  startTimer(workDuration: number = 25): void {
    if (!this.props.timer) {
      this.props.timer = {
        mode: 'work',
        remainingSeconds: workDuration * 60,
        isRunning: true,
        startedAt: Date.now(),
      };
    } else {
      // Se o timer estava pausado, apenas retomar com o tempo restante
      // Se estava em idle, iniciar novo ciclo
      if (this.props.timer.mode === 'idle') {
        this.props.timer.mode = 'work';
        this.props.timer.remainingSeconds = workDuration * 60;
      }
      this.props.timer.isRunning = true;
      this.props.timer.startedAt = Date.now();
    }
  }

  pauseTimer(): void {
    if (this.props.timer && this.props.timer.startedAt) {
      // Calcular quanto tempo passou desde que iniciou
      const elapsed = Math.floor((Date.now() - this.props.timer.startedAt) / 1000);
      // Atualizar remainingSeconds com o tempo que realmente resta
      this.props.timer.remainingSeconds = Math.max(0, this.props.timer.remainingSeconds - elapsed);
      this.props.timer.isRunning = false;
      this.props.timer.startedAt = undefined;
    }
  }

  resetTimer(workDuration: number = 25): void {
    const workSeconds = workDuration * 60;
    
    if (!this.props.timer) {
      this.props.timer = {
        mode: 'idle',
        remainingSeconds: workSeconds,
        isRunning: false,
      };
    } else {
      this.props.timer.mode = 'idle';
      this.props.timer.remainingSeconds = workSeconds;
      this.props.timer.isRunning = false;
      this.props.timer.startedAt = undefined;
    }
  }

  updateTimerSeconds(seconds: number): void {
    if (this.props.timer) {
      this.props.timer.remainingSeconds = seconds;
    }
  }

  completeTimerCycle(workDuration: number = 25, breakDuration: number = 5): void {
    if (!this.props.timer) return;

    if (this.props.timer.mode === 'work') {
      this.props.timer.mode = 'break';
      this.props.timer.remainingSeconds = breakDuration * 60;
    } else if (this.props.timer.mode === 'break') {
      this.props.timer.mode = 'work';
      this.props.timer.remainingSeconds = workDuration * 60;
    }
    
    this.props.timer.isRunning = false;
    this.props.timer.startedAt = undefined;
  }

  toJSON(): TaskJSON {
    return {
      id: this.props.id,
      text: this.props.text,
      description: this.props.description,
      category: this.props.category,
      state: this.props.state,
      createdAt: this.props.createdAt.toISOString(),
      steps: this.props.steps,
      timer: this.props.timer,
      customColumnId: this.props.customColumnId,
      usePomodoro: this.props.usePomodoro,
    };
  }

  static fromJSON(data: TaskJSON): Task {
    return Task.fromPersistence({
      id: data.id,
      text: data.text,
      description: data.description,
      category: (data.category as TaskCategory) || 'other',
      state: data.state as TaskState,
      createdAt: new Date(data.createdAt),
      steps: data.steps || [],
      timer: data.timer || {
        mode: 'idle',
        remainingSeconds: 25 * 60,
        isRunning: false,
      },
      customColumnId: data.customColumnId,
      usePomodoro: data.usePomodoro ?? true,
    });
  }
}
