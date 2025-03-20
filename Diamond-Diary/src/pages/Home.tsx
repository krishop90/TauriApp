import { useState, useEffect } from 'react';
import DataForm from '../components/DataForm';
import DataTable from '../components/DataTable';
import PrintButton from '../components/PrintButton';
import Sidebar from '../components/Sidebar';
import RangeFilter from '../components/RangeFilter'; // New import
import { Entry } from '../types';
import { invoke } from '@tauri-apps/api/tauri';

const DATA_FILE = 'DiamondDiary/data.json';

const saveDataToFile = async (entries: Entry[]) => {
    if (window.__TAURI__) {
        try {
            await invoke('save_data', {
                path: DATA_FILE,
                contents: JSON.stringify(entries, null, 2),
            });
        } catch (e) {
            console.error('Error saving data:', e);
        }
    } else {
        console.log('Saving to localStorage in dev mode:', entries);
        localStorage.setItem(DATA_FILE, JSON.stringify(entries));
    }
};

const loadDataFromFile = async (): Promise<Entry[]> => {
    if (window.__TAURI__) {
        try {
            const data = await invoke<string>('load_data', { path: DATA_FILE });
            return JSON.parse(data);
        } catch (e) {
            console.log('No existing data file found, starting fresh.');
            return [];
        }
    } else {
        const data = localStorage.getItem(DATA_FILE);
        return data ? JSON.parse(data) : [];
    }
};

const Home: React.FC = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]); // New state for filtered entries

    useEffect(() => {
        const loadData = async () => {
            const loadedEntries = await loadDataFromFile();
            setEntries(loadedEntries);
            setFilteredEntries(loadedEntries); // Initially show all
        };
        loadData();
    }, []);

    const handleSubmit = (data: Entry) => {
        setEntries((prev) => {
            const newEntries = [...prev, data];
            saveDataToFile(newEntries);
            setFilteredEntries(newEntries); // Update filtered entries too
            return newEntries;
        });
    };

    const handleUpdate = (updatedEntry: Entry) => {
        setEntries((prev) => {
            const newEntries = prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry));
            saveDataToFile(newEntries);
            setFilteredEntries(newEntries); // Update filtered entries
            return newEntries;
        });
    };

    const handleDelete = (id: string) => {
        setEntries((prev) => {
            const newEntries = prev.filter((entry) => entry.id !== id);
            saveDataToFile(newEntries);
            setFilteredEntries(newEntries); // Update filtered entries
            return newEntries;
        });
    };

    const handleFilter = (start: number | null, end: number | null) => {
        if (start === null && end === null) {
            setFilteredEntries(entries); // Show all if range cleared
        } else {
            const filtered = entries.filter((entry) => {
                const roughWeight = parseFloat(entry.roughWeight || '0');
                return (
                    (start === null || roughWeight >= start) &&
                    (end === null || roughWeight <= end)
                );
            });
            setFilteredEntries(filtered);
        }
    };

    return (
        <div className="home">
            <h1 className="page-title">DIAMOND DIARY</h1>
            <div className="layout">
                <Sidebar entries={filteredEntries} /> {/* Use filtered entries */}
                <div className="content">
                    <DataForm onSubmit={handleSubmit} />
                    <RangeFilter onFilter={handleFilter} /> {/* Add Range Filter */}
                    <PrintButton entries={filteredEntries} /> {/* Pass filtered entries to PrintButton */}
                    <div id="print-table">
                        <DataTable entries={filteredEntries} onUpdate={handleUpdate} onDelete={handleDelete} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;