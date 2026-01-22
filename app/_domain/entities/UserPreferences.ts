export type FocusRhythm = 'one-at-time' | 'few-parallel' | 'no-limit';
export type VisualComplexity = 'minimal' | 'balanced' | 'informative';
export type TextSize = 'small' | 'medium' | 'large';
export type NotificationTiming = 'only-when-asked' | 'focus-ends' | 'long-breaks';

export interface UserPreferencesProps {
  userId: string;
  focusRhythm: FocusRhythm;
  maxTasksInFocus: number;
  overloadBehavior: 'warn-only' | 'suggest-move' | 'no-warning';
  visualComplexity: VisualComplexity;
  textSize: TextSize;
  notificationTiming: NotificationTiming;
  updatedAt: Date;
}

export class UserPreferences {
  private constructor(private props: UserPreferencesProps) {}

  static createDefault(userId: string): UserPreferences {
    return new UserPreferences({
      userId,
      focusRhythm: 'one-at-time',
      maxTasksInFocus: 1,
      overloadBehavior: 'suggest-move',
      visualComplexity: 'balanced',
      textSize: 'medium',
      notificationTiming: 'only-when-asked',
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: UserPreferencesProps): UserPreferences {
    return new UserPreferences(props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get focusRhythm(): FocusRhythm {
    return this.props.focusRhythm;
  }

  get maxTasksInFocus(): number {
    return this.props.maxTasksInFocus;
  }

  get overloadBehavior(): 'warn-only' | 'suggest-move' | 'no-warning' {
    return this.props.overloadBehavior;
  }

  get visualComplexity(): VisualComplexity {
    return this.props.visualComplexity;
  }

  get textSize(): TextSize {
    return this.props.textSize;
  }

  get notificationTiming(): NotificationTiming {
    return this.props.notificationTiming;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateFocusRhythm(rhythm: FocusRhythm): void {
    this.props.focusRhythm = rhythm;
    if (rhythm === 'one-at-time') {
      this.props.maxTasksInFocus = 1;
    } else if (rhythm === 'few-parallel') {
      this.props.maxTasksInFocus = 3;
    } else {
      this.props.maxTasksInFocus = 999;
    }
    this.props.updatedAt = new Date();
  }

  updateMaxTasksInFocus(max: number): void {
    this.props.maxTasksInFocus = max;
    this.props.updatedAt = new Date();
  }

  updateOverloadBehavior(behavior: 'warn-only' | 'suggest-move' | 'no-warning'): void {
    this.props.overloadBehavior = behavior;
    this.props.updatedAt = new Date();
  }

  updateVisualComplexity(complexity: VisualComplexity): void {
    this.props.visualComplexity = complexity;
    this.props.updatedAt = new Date();
  }

  updateTextSize(size: TextSize): void {
    this.props.textSize = size;
    this.props.updatedAt = new Date();
  }

  updateNotificationTiming(timing: NotificationTiming): void {
    this.props.notificationTiming = timing;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      userId: this.props.userId,
      focusRhythm: this.props.focusRhythm,
      maxTasksInFocus: this.props.maxTasksInFocus,
      overloadBehavior: this.props.overloadBehavior,
      visualComplexity: this.props.visualComplexity,
      textSize: this.props.textSize,
      notificationTiming: this.props.notificationTiming,
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }

  static fromJSON(data: any): UserPreferences {
    return UserPreferences.fromPersistence({
      userId: data.userId,
      focusRhythm: data.focusRhythm || 'one-at-time',
      maxTasksInFocus: data.maxTasksInFocus || 1,
      overloadBehavior: data.overloadBehavior || 'suggest-move',
      visualComplexity: data.visualComplexity || 'balanced',
      textSize: data.textSize || 'medium',
      notificationTiming: data.notificationTiming || 'only-when-asked',
      updatedAt: new Date(data.updatedAt),
    });
  }
}
