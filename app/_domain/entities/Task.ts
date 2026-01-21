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
  state: TaskState;
  createdAt: Date;
  steps: TaskStep[];
  timer?: TaskTimer;
}

export class Task {
  private constructor(private props: TaskProps) {}

  static create(text: string): Task {
    return new Task({
      id: crypto.randomUUID(),
      text,
      state: 'active',
      createdAt: new Date(),
      steps: [],
      timer: {
        mode: 'idle',
        remainingSeconds: 25 * 60,
        isRunning: false,
      },
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

  updateText(newText: string): void {
    this.props.text = newText;
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

  startTimer(): void {
    if (!this.props.timer) {
      this.props.timer = {
        mode: 'work',
        remainingSeconds: 25 * 60,
        isRunning: true,
        startedAt: Date.now(),
      };
    } else {
      this.props.timer.isRunning = true;
      this.props.timer.startedAt = Date.now();
    }
  }

  pauseTimer(): void {
    if (this.props.timer) {
      this.props.timer.isRunning = false;
      this.props.timer.startedAt = undefined;
    }
  }

  resetTimer(): void {
    const workDuration = 25 * 60;
    const breakDuration = 5 * 60;
    
    if (!this.props.timer) {
      this.props.timer = {
        mode: 'idle',
        remainingSeconds: workDuration,
        isRunning: false,
      };
    } else {
      this.props.timer.mode = 'idle';
      this.props.timer.remainingSeconds = workDuration;
      this.props.timer.isRunning = false;
      this.props.timer.startedAt = undefined;
    }
  }

  updateTimerSeconds(seconds: number): void {
    if (this.props.timer) {
      this.props.timer.remainingSeconds = seconds;
    }
  }

  completeTimerCycle(): void {
    if (!this.props.timer) return;

    if (this.props.timer.mode === 'work') {
      this.props.timer.mode = 'break';
      this.props.timer.remainingSeconds = 5 * 60;
    } else if (this.props.timer.mode === 'break') {
      this.props.timer.mode = 'work';
      this.props.timer.remainingSeconds = 25 * 60;
    }
    
    this.props.timer.isRunning = false;
    this.props.timer.startedAt = undefined;
  }

  toJSON() {
    return {
      id: this.props.id,
      text: this.props.text,
      state: this.props.state,
      createdAt: this.props.createdAt.toISOString(),
      steps: this.props.steps,
      timer: this.props.timer,
    };
  }

  static fromJSON(data: any): Task {
    return Task.fromPersistence({
      id: data.id,
      text: data.text,
      state: data.state,
      createdAt: new Date(data.createdAt),
      steps: data.steps || [],
      timer: data.timer || {
        mode: 'idle',
        remainingSeconds: 25 * 60,
        isRunning: false,
      },
    });
  }
}
