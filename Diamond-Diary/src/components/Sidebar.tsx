import { useMemo } from 'react';
import { Entry } from '../types'; // Import shared type

export interface SidebarProps {
    entries: Entry[];
}

const Sidebar: React.FC<SidebarProps> = ({ entries }) => {
    const months = useMemo(() => {
        const monthMap: { [key: string]: number } = {};
        entries.forEach((entry) => {
            const date = new Date(entry.issueDate);
            const key = `${date.toLocaleString('default', { month: 'long' }).toUpperCase()}-${date.getFullYear()}`;
            monthMap[key] = (monthMap[key] || 0) + 1;
        });
        return Object.entries(monthMap).map(([name, count]) => ({ name, count }));
    }, [entries]);

    return (
        <div className="sidebar">
            <h3>MONTHLY ENTRIES</h3>
            <ul>
                {months.map((month) => (
                    <li key={month.name}>{month.name} ({month.count})</li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;