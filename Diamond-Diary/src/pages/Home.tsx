import { useState, useEffect } from 'react';
import DataForm from '../components/DataForm';
import DataTable from '../components/DataTable';
import PrintButton from '../components/PrintButton';
import Sidebar from '../components/Sidebar';
import RangeFilter from '../components/RangeFilter';
import { Entry } from '../types';
import { invoke } from '@tauri-apps/api/tauri';

const DATA_FILE = 'DiamondDiary/data.json';

const saveDataToFile = async (entries: Entry[]) => {
    const contents = JSON.stringify(entries, null, 2);
    if (window.__TAURI__) {
        try {
            await invoke('save_data', { path: DATA_FILE, contents });
            console.log('Data saved successfully to:', DATA_FILE);
            const backupPath = `DiamondDiary/backup_${Date.now()}.json`;
            await invoke('backup_data', { sourcePath: DATA_FILE, backupPath });
            console.log('Automatic backup created:', backupPath);
        } catch (e) {
            console.error('Failed to save data or create backup:', e);
        }
    } else {
        console.log('Saving to localStorage:', entries);
        localStorage.setItem(DATA_FILE, contents);
    }
};

const loadDataFromFile = async (): Promise<Entry[]> => {
    if (window.__TAURI__) {
        try {
            const data = await invoke<string>('load_data', { path: DATA_FILE });
            console.log('Data loaded successfully from:', DATA_FILE, data);
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to load data:', e);
            return [];
        }
    } else {
        const data = localStorage.getItem(DATA_FILE);
        console.log('Loaded from localStorage:', data);
        return data ? JSON.parse(data) : [];
    }
};

const Home: React.FC = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
    const [range, setRange] = useState<{ start: number | null; end: number | null }>({ start: null, end: null });

    useEffect(() => {
        const loadData = async () => {
            const loadedEntries = await loadDataFromFile();
            setEntries(loadedEntries);
            if (range.start !== null || range.end !== null) {
                const filtered = loadedEntries.filter((entry) => {
                    const roughWeight = parseFloat(entry.roughWeight || '0');
                    return (
                        (range.start === null || roughWeight >= range.start) &&
                        (range.end === null || roughWeight <= range.end)
                    );
                });
                setFilteredEntries(filtered);
            } else {
                setFilteredEntries(loadedEntries);
            }
        };
        loadData();
    }, []);

    const handleSubmit = (data: Entry) => {
        setEntries((prev) => {
            const newEntries = [...prev, data];
            saveDataToFile(newEntries);
            const filtered = newEntries.filter((entry) => {
                const roughWeight = parseFloat(entry.roughWeight || '0');
                return (
                    (range.start === null || roughWeight >= range.start) &&
                    (range.end === null || roughWeight <= range.end)
                );
            });
            setFilteredEntries(range.start !== null || range.end !== null ? filtered : newEntries);
            return newEntries;
        });
    };

    const handleUpdate = (updatedEntry: Entry) => {
        setEntries((prev) => {
            const newEntries = prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry));
            saveDataToFile(newEntries);
            const filtered = newEntries.filter((entry) => {
                const roughWeight = parseFloat(entry.roughWeight || '0');
                return (
                    (range.start === null || roughWeight >= range.start) &&
                    (range.end === null || roughWeight <= range.end)
                );
            });
            setFilteredEntries(range.start !== null || range.end !== null ? filtered : newEntries);
            return newEntries;
        });
    };

    const handleDelete = (id: string) => {
        setEntries((prev) => {
            const newEntries = prev.filter((entry) => entry.id !== id);
            saveDataToFile(newEntries);
            const filtered = newEntries.filter((entry) => {
                const roughWeight = parseFloat(entry.roughWeight || '0');
                return (
                    (range.start === null || roughWeight >= range.start) &&
                    (range.end === null || roughWeight <= range.end)
                );
            });
            setFilteredEntries(range.start !== null || range.end !== null ? filtered : newEntries);
            return newEntries;
        });
    };

    const handleFilter = (start: number | null, end: number | null) => {
        setRange({ start, end });
        if (start === null && end === null) {
            setFilteredEntries(entries);
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

    const handleRestore = async () => {
        try {
            const backupFile = `DiamondDiary/backup_${Date.now()}.json`; // Temporary—replace with selection logic if needed
            await invoke('restore_data', { backupPath: backupFile, destPath: DATA_FILE });
            const loadedEntries = await loadDataFromFile();
            setEntries(loadedEntries);
            setFilteredEntries(loadedEntries);
            console.log('Data restored!');
        } catch (e) {
            console.error('Restore failed:', e);
        }
    };

    return (
        <div className="home">
            <h1 className="page-title">DIAMOND DIARY</h1>
            <div className="layout">
                <Sidebar entries={filteredEntries} />
                <div className="content">
                    <DataForm onSubmit={handleSubmit} />
                    <RangeFilter onFilter={handleFilter} />
                    <PrintButton />
                    <button onClick={handleRestore}>Restore</button>
                    <div id="print-table">
                        <DataTable entries={filteredEntries} onUpdate={handleUpdate} onDelete={handleDelete} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;