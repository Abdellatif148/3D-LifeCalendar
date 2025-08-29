
import type { Category, CategoryName } from './types';

export const WEEKS_IN_YEAR = 52;
export const MAX_YEARS = 100; // Increased to 100 for a more complete grid view
export const MINUTES_IN_DAY = 24 * 60;

export const CATEGORIES: Category[] = [
    { name: 'Sleep', color: '#60A5FA', description: 'Rest and recovery' },
    { name: 'Work/Study', color: '#F59E0B', description: 'Career, education, and skill development' },
    { name: 'Social', color: '#F472B6', description: 'Time with friends, family, and community' },
    { name: 'Exercise', color: '#34D399', description: 'Physical fitness and health' },
    { name: 'Hobbies', color: '#A78BFA', description: 'Leisure, interests, and personal projects' },
    { name: 'Unallocated', color: '#9CA3AF', description: 'Commuting, chores, and other daily activities' },
];

export const CATEGORY_MAP: Record<CategoryName, Category> = CATEGORIES.reduce((acc, cat) => {
    acc[cat.name] = cat;
    return acc;
}, {} as Record<CategoryName, Category>);
