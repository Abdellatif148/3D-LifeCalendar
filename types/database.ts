export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          life_data: LifeData | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          life_data?: LifeData | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          life_data?: LifeData | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface LifeData {
  currentAge: number;
  targetAge: number;
  activities: ActivityData[];
}

export interface ActivityData {
  name: CategoryName;
  minutesPerDay: number;
}

export type CategoryName = 'Sleep' | 'Work/Study' | 'Social' | 'Hobbies' | 'Exercise' | 'Unallocated';