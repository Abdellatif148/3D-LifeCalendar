import React, { useState, useEffect, useCallback } from 'react';
import Button from '../ui/Button';

interface NotesViewProps {
    onBack: () => void;
}

// Debounce hook
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
    const [status, setStatus] = useState('Ready');
    const debouncedNotes = useDebounce(notes, 500); // 500ms delay

    useEffect(() => {
        try {
            const savedNotes = localStorage.getItem('app-notes');
            if (savedNotes) {
                setNotes(savedNotes);
            }
        } catch (e) {
            console.error("Failed to load notes from localStorage", e);
        }
    }, []);

    useEffect(() => {
        if (debouncedNotes !== undefined) {
            try {
                localStorage.setItem('app-notes', debouncedNotes);
                setStatus('Saved');
                setTimeout(() => setStatus('Ready'), 2000);
            } catch (e) {
                console.error("Failed to save notes to localStorage", e);
                setStatus('Error');
            }
        }
    }, [debouncedNotes]);

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
