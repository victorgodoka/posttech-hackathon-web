export type TaskState = 'active' | 'paused' | 'done';

export interface TaskStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskProps {
  id: string;
  text: string;
  state: TaskState;
  createdAt: Date;
  steps: TaskStep[];
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

  toJSON() {
    return {
      id: this.props.id,
      text: this.props.text,
      state: this.props.state,
      createdAt: this.props.createdAt.toISOString(),
      steps: this.props.steps,
    };
  }

  static fromJSON(data: any): Task {
    return Task.fromPersistence({
      id: data.id,
      text: data.text,
      state: data.state,
      createdAt: new Date(data.createdAt),
      steps: data.steps || [],
    });
  }
}
