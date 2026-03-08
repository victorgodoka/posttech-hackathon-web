export type LayoutMode = 'list' | 'complete' | 'custom';

export interface CustomColumn {
  id: string;
  name: string;
  order: number;
}

export type VisualComplexity = 'minimal' | 'balanced' | 'informative';
export type InformationDensity = 'essential' | 'complete';
export type TextSize = 'small' | 'medium' | 'large';
export type NotificationTiming = 'only-when-asked' | 'focus-ends' | 'long-breaks';

export interface UserPreferencesProps {
  userId: string;
  layoutMode: LayoutMode;
  customColumns: CustomColumn[];
  overloadBehavior: 'warn-only' | 'suggest-move' | 'no-warning';
  visualComplexity: VisualComplexity;
  informationDensity: InformationDensity;
  textSize: TextSize;
  notificationTiming: NotificationTiming;
  updatedAt: Date;
}

export interface UserPreferencesJSON {
  userId: string;
  layoutMode?: string;
  customColumns?: CustomColumn[];
  overloadBehavior?: string;
  visualComplexity?: string;
  informationDensity?: string;
  textSize?: string;
  notificationTiming?: string;
  updatedAt: string;
}

export class UserPreferences {
  private constructor(private props: UserPreferencesProps) {}

  static createDefault(userId: string): UserPreferences {
    return new UserPreferences({
      userId,
      layoutMode: 'list',
      customColumns: [],
      overloadBehavior: 'suggest-move',
      visualComplexity: 'balanced',
      informationDensity: 'complete',
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

  get layoutMode(): LayoutMode {
    return this.props.layoutMode;
  }

  get customColumns(): CustomColumn[] {
    return this.props.customColumns;
  }

  get overloadBehavior(): 'warn-only' | 'suggest-move' | 'no-warning' {
    return this.props.overloadBehavior;
  }

  get visualComplexity(): VisualComplexity {
    return this.props.visualComplexity;
  }

  get informationDensity(): InformationDensity {
    return this.props.informationDensity;
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

  updateLayoutMode(mode: LayoutMode): void {
    this.props.layoutMode = mode;
    if (mode !== 'custom') {
      this.props.customColumns = [];
    }
    this.props.updatedAt = new Date();
  }

  addCustomColumn(name: string, afterColumnId?: string): void {
    const newColumn: CustomColumn = {
      id: crypto.randomUUID(),
      name,
      order: 0,
    };

    if (!afterColumnId || this.props.customColumns.length === 0) {
      newColumn.order = this.props.customColumns.length;
      this.props.customColumns.push(newColumn);
    } else {
      const afterColumn = this.props.customColumns.find(c => c.id === afterColumnId);
      if (afterColumn) {
        const insertPosition = afterColumn.order + 1;
        newColumn.order = insertPosition;
        
        this.props.customColumns.forEach(col => {
          if (col.order >= insertPosition) {
            col.order++;
          }
        });
        
        this.props.customColumns.push(newColumn);
        this.props.customColumns.sort((a, b) => a.order - b.order);
      } else {
        newColumn.order = this.props.customColumns.length;
        this.props.customColumns.push(newColumn);
      }
    }
    
    this.props.updatedAt = new Date();
  }

  updateCustomColumn(columnId: string, name: string): void {
    const column = this.props.customColumns.find(c => c.id === columnId);
    if (column) {
      column.name = name;
      this.props.updatedAt = new Date();
    }
  }

  removeCustomColumn(columnId: string): void {
    this.props.customColumns = this.props.customColumns.filter(c => c.id !== columnId);
    this.props.updatedAt = new Date();
  }

  reorderCustomColumns(columns: CustomColumn[]): void {
    this.props.customColumns = columns;
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

  updateInformationDensity(density: InformationDensity): void {
    this.props.informationDensity = density;
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
      layoutMode: this.props.layoutMode,
      customColumns: this.props.customColumns,
      overloadBehavior: this.props.overloadBehavior,
      visualComplexity: this.props.visualComplexity,
      informationDensity: this.props.informationDensity,
      textSize: this.props.textSize,
      notificationTiming: this.props.notificationTiming,
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }

  static fromJSON(data: UserPreferencesJSON): UserPreferences {
    return UserPreferences.fromPersistence({
      userId: data.userId,
      layoutMode: (data.layoutMode as LayoutMode) || 'list',
      customColumns: data.customColumns || [],
      overloadBehavior: (data.overloadBehavior as 'warn-only' | 'suggest-move' | 'no-warning') || 'suggest-move',
      visualComplexity: (data.visualComplexity as VisualComplexity) || 'balanced',
      informationDensity: (data.informationDensity as InformationDensity) || 'complete',
      textSize: (data.textSize as TextSize) || 'medium',
      notificationTiming: (data.notificationTiming as NotificationTiming) || 'only-when-asked',
      updatedAt: new Date(data.updatedAt),
    });
  }
}
