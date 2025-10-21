import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTimeData } from '../../hooks/useTimeData';
import type { DayData, YearData, DailyTask } from '../../types';

type SearchResultType = 'year' | 'month' | 'week' | 'day' | 'goal';

interface SearchResult {
    type: SearchResultType;
    year: number;
    month: number | null;
    week: number | null;
    day: number | null;
    dayOfMonth?: number;
    text: string;
    context: string;
    date: Date;
    relevance: number;
}

interface GlobalSearchProps {
    onNavigate: (args: { year: number, month: number | null, week: number | null, day: number | null }) => void;
    targetAge: number;
    currentAge: number;
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate, targetAge, currentAge }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { timeData } = useTimeData();
    const debouncedQuery = useDebounce(query, 300);

    const calculateRelevance = useCallback((item: Omit<SearchResult, 'relevance'>, query: string): number => {
        let score = 0;
        const lowerQuery = query.toLowerCase();
        const lowerText = item.text.toLowerCase();

        // Match Score (enhanced)
        if (lowerText.includes(lowerQuery)) {
            score += 10;
            if (lowerText === lowerQuery) score += 30;
            if (lowerText.startsWith(lowerQuery)) score += 15;
            const matchPosition = lowerText.indexOf(lowerQuery);
            if (matchPosition === 0) score += 10;
        }

        // Type Score with hierarchy preference
        const typeWeights: Record<SearchResultType, number> = { year: 6, month: 5, week: 4, day: 3, goal: 2 };
        score += (typeWeights[item.type] || 1) * 12;

        // Recency Score (prioritize more recent entries)
        const now = new Date();
        const currentYear = now.getFullYear();
        const yearDifference = Math.abs(item.year - currentYear);
        const recencyScore = 120 / (1 + yearDifference * 0.5);
        score += recencyScore;

        // Temporal proximity bonus
        const daysDifference = Math.abs(item.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDifference < 7) score += 40;
        else if (daysDifference < 30) score += 25;
        else if (daysDifference < 90) score += 10;

        // Date-based search bonus (enhanced)
        const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                           'july', 'august', 'september', 'october', 'november', 'december'];
        const monthIndex = monthNames.findIndex(month => lowerQuery.includes(month));
        if (monthIndex !== -1 && item.month === monthIndex) {
            score += 60;
        }

        // Year search bonus
        const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
        if (yearMatch && parseInt(yearMatch[1]) === item.year) {
            score += 50;
        }

        return score;
    }, [currentAge]);


    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const lowerQuery = debouncedQuery.toLowerCase();
        let searchResults: SearchResult[] = [];
        const today = new Date();
        
        // Special keyword search for "events"
        if (lowerQuery === 'events') {
             Object.entries(timeData).forEach(([yearStr, yearData]) => {
                const year = parseInt(yearStr);
                 Object.entries(yearData.months).forEach(([monthStr, monthData]) => {
                    const month = parseInt(monthStr);
                     Object.entries((monthData as any).weeks).forEach(([weekStr, weekData]) => {
                        const week = parseInt(weekStr);
                         Object.entries((weekData as any).days).forEach(([dayStr, dayData]) => {
                            const day = parseInt(dayStr);
                            const dayOfMonth = (week * 7) + day + 1; // Approx
                            const date = new Date(year, month, dayOfMonth);
                            if (date >= today) {
                                ((dayData as DayData).goals || []).forEach(goal => {
                                    if (goal.type === 'event') {
                                        searchResults.push({
                                            type: 'goal', year, month, week, day, date, dayOfMonth,
                                            text: goal.text, context: `Event on ${date.toLocaleDateString()}`, relevance: 0
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            });
            // Sort events by date
            searchResults.sort((a, b) => a.date.getTime() - b.date.getTime());
        } else {
             // General Search
            Object.entries(timeData).forEach(([yearStr, yearData]) => {
                const year = parseInt(yearStr);
                
                // Search Year Title
                if (yearData.title.toLowerCase().includes(lowerQuery)) {
                     searchResults.push({ type: 'year', year, month: null, week: null, day: null, date: new Date(year, 0, 1), text: yearData.title, context: `Year ${year + 1}`, relevance: 0 });
                }

                // Search through days and goals
                 Object.entries(yearData.months).forEach(([monthStr, monthData]) => {
                    const month = parseInt(monthStr);
                    Object.entries((monthData as any).weeks).forEach(([weekStr, weekData]) => {
                        const week = parseInt(weekStr);
                        Object.entries((weekData as any).days).forEach(([dayStr, dayDataTyped]) => {
                            const day = parseInt(dayStr);
                            const dayOfMonth = (week * 7) + day + 1; // Approx
                            const date = new Date(year, month, dayOfMonth);
                            const dayData = dayDataTyped as DayData;

                            if (dayData.title.toLowerCase().includes(lowerQuery)) {
                                searchResults.push({ type: 'day', year, month, week, day, date, dayOfMonth, text: dayData.title, context: `Focus for ${date.toLocaleDateString()}`, relevance: 0 });
                            }
                            (dayData.goals || []).forEach(goal => {
                                let fullText = `${goal.text} ${goal.description || ''} ${goal.location || ''} ${goal.link || ''} ${goal.guests || ''}`.toLowerCase();
                                if (fullText.includes(lowerQuery)) {
                                    searchResults.push({ type: 'goal', year, month, week, day, date, dayOfMonth, text: goal.text, context: `On ${date.toLocaleDateString()}`, relevance: 0 });
                                }
                            });
                        });
                    });
                });
            });

             // Calculate relevance and sort
            searchResults = searchResults.map(r => ({ ...r, relevance: calculateRelevance(r, debouncedQuery) }));
            searchResults.sort((a, b) => b.relevance - a.relevance);
        }
        
        setResults(searchResults.slice(0, 10)); // Limit to top 10 results
        setIsOpen(searchResults.length > 0);

    }, [debouncedQuery, timeData, calculateRelevance]);
    
    const handleNavigate = (result: SearchResult) => {
        onNavigate({ year: result.year, month: result.month, week: result.week, day: result.day });
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div className="relative w-64" onBlur={() => setTimeout(() => setIsOpen(false), 100)}>
            <div className="relative">
                <input
                    type="search"
                    placeholder="Search goals, events, dates..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="input-clean pl-10 text-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            {isOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-soft-lg z-50 max-h-80 overflow-y-auto scrollbar-clean">
                    {results.map((result, index) => (
                        <div key={index}
                            onMouseDown={() => handleNavigate(result)}
                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                        >
                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{result.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{result.context}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};