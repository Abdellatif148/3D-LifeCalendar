export type CategoryName = 'Sleep' | 'Work/Study' | 'Social' | 'Hobbies' | 'Exercise' | 'Unallocated';

export interface Category {
    name: CategoryName;
    color: string;
    description: string;
}

export interface ActivityData {
    name: CategoryName;
    minutesPerDay: number;
}

export interface LifeData {
    currentAge: number;
    targetAge: number;
    activities: ActivityData[];
}

export interface DailyTask {
    text: string; // Title
    completed: boolean;
    type: 'task' | 'event';
    description?: string;
    reminder?: string; // "HH:mm"
    
    // Event specific
    location?: string;
    time?: string; // "HH:mm"
    guests?: string; // comma-separated emails
    link?: string;
    
    // Task specific
    repeat?: 'none' | 'daily' | 'weekly';
}

export interface DayData {
    title: string;
    goals: DailyTask[];
}

export interface YearData {
    title: string;
    months: {
        [monthIndex: number]: {
            weeks: {
                [weekIndex: number]: {
                    days: {
                        [dayIndex: number]: DayData;
                    };
                };
            };
        };
    };
}

export interface TimeDataState {
    [year: number]: YearData;
}


export interface Delta {
    name: CategoryName;
    deltaMinutes: number;
}

export interface AppNotification {
    id: number;
    title: string;
    message: string;
}
