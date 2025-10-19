import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

interface NotesViewProps {
    onBack: () => void;
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const NotesView: React.FC<NotesViewProps> = ({ onBack }) => {
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('Loading...');
    const [isInitialized, setIsInitialized] = useState(false);
    const debouncedNotes = useDebounce(notes, 500);

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data, error } = await supabase
                        .from('notes')
                        .select('content')
                        .eq('user_id', user.id)
                        .maybeSingle();

                    if (error) {
                        console.error('Error loading notes:', error);
                        setStatus('Error loading');
                    } else if (data) {
                        setNotes(data.content);
                        setStatus('Ready');
                    } else {
                        setStatus('Ready');
                    }
                } else {
                    const savedNotes = localStorage.getItem('app-notes');
                    if (savedNotes) {
                        setNotes(savedNotes);
                    }
                    setStatus('Ready');
                }
            } catch (error) {
                console.error('Failed to load notes:', error);
                setStatus('Error loading');
            } finally {
                setIsInitialized(true);
            }
        };

        loadNotes();
    }, []);

    useEffect(() => {
        if (!isInitialized) return;

        const saveNotes = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { error } = await supabase
                        .from('notes')
                        .upsert({
                            user_id: user.id,
                            content: debouncedNotes,
                        }, {
                            onConflict: 'user_id'
                        });

                    if (error) {
                        console.error('Error saving notes:', error);
                        setStatus('Error saving');
                    } else {
                        setStatus('Saved');
                        setTimeout(() => setStatus('Ready'), 2000);
                    }
                } else {
                    localStorage.setItem('app-notes', debouncedNotes);
                    setStatus('Saved');
                    setTimeout(() => setStatus('Ready'), 2000);
                }
            } catch (error) {
                console.error('Failed to save notes:', error);
                setStatus('Error saving');
            }
        };

        saveNotes();
    }, [debouncedNotes, isInitialized]);

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        setStatus('Saving...');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm z-20 p-3 flex justify-between items-center border-b border-gray-700">
                <Button onClick={onBack} variant="secondary">&larr; Back to Dashboard</Button>
                <div className="flex items-center gap-4">
                     <h1 className="text-xl font-bold text-white">My Notes</h1>
                     <span className="text-sm text-gray-400">{status}</span>
                </div>
                <div className="w-48"></div> {/* Spacer */}
            </header>
            <main className="flex-grow p-4">
                <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Start typing your notes here..."
                    className="w-full h-full bg-gray-800 text-gray-200 p-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
            </main>
        </div>
    );
};

export default NotesView;
