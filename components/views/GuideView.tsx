
import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface GuideViewProps {
    onBack: () => void;
}

const GuideContent: React.FC = () => (
    <div className="text-sm text-gray-300 space-y-6 mt-4">
        <div>
            <h4 className="font-bold text-xl text-purple-400 mb-3">Plan and Schedule</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-gray-300">Create a master schedule:</strong> At the start of each week or semester, schedule all your classes, work, and regular commitments.</li>
                <li><strong className="text-gray-300">Color-code your events:</strong> Use different colors for classes, assignments, social events, and personal time.</li>
                <li><strong className="text-gray-300">Time-block:</strong> Assign specific blocks of time for particular tasks, such as studying or homework.</li>
                <li><strong className="text-gray-300">Plan your day and week:</strong> Dedicate a few minutes each morning to plan your day and a longer session each week to plan the upcoming one.</li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-xl text-purple-400 mb-3">Set Goals and Deadlines</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-gray-300">Set realistic goals:</strong> Define both short-term and long-term goals to stay motivated and focused.</li>
                <li><strong className="text-gray-300">Break down large tasks:</strong> Divide big assignments into smaller, more manageable steps.</li>
                <li><strong className="text-gray-300">Add details and due dates:</strong> Be specific in your entries, including assignment details and their exact due dates.</li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-xl text-purple-400 mb-3">Stay Organized and Flexible</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-gray-300">Use reminders:</strong> Set alarms and notifications to ensure you don't miss important events or deadlines.</li>
                <li><strong className="text-gray-300">Keep your calendar accessible:</strong> Use a tool that syncs across your devices so you always have it on hand.</li>
                <li><strong className="text-gray-300">Be flexible:</strong> Be prepared to adjust your schedule when unexpected events or conflicts arise.</li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-xl text-purple-400 mb-3">Maintain a Healthy Balance</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li><strong className="text-gray-300">Schedule breaks:</strong> Include short breaks during study sessions and longer breaks for meals and activities.</li>
                <li><strong className="text-gray-300">Prioritize personal time:</strong> Intentionally block out time for hobbies, socializing, and relaxation to avoid burnout.</li>
                <li><strong className="text-gray-300">Review and adjust:</strong> Regularly look over your calendar to evaluate if your schedule is working for you.</li>
            </ul>
        </div>
    </div>
);

const GuideView: React.FC<GuideViewProps> = ({ onBack }) => {
    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm z-20 p-3 flex justify-between items-center border-b border-gray-700">
                <Button onClick={onBack} variant="secondary">&larr; Back to Dashboard</Button>
                <h1 className="text-xl font-bold text-white">Student Planning Guide</h1>
                <div className="w-48"></div> {/* Spacer */}
            </header>
            <main className="flex-grow overflow-y-auto p-6 flex justify-center">
                <div className="w-full max-w-4xl">
                    <Card>
                        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Effective Time Management for Students</h2>
                        <p className="text-center text-gray-400 mb-6">Use these principles to build a schedule that works for you.</p>
                        <GuideContent />
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default GuideView;
