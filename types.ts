export type CategoryName =
  | 'Sleep'
  | 'Work/Study'
  | 'Social'
  | 'Hobbies'
  | 'Exercise'
  | 'Unallocated';

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

export interface Delta {
  name: CategoryName;
  deltaMinutes: number;
}
