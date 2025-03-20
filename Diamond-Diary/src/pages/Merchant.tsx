import { useState, useEffect } from 'react';
import DataForm from '../components/DataForm';
import DataTable from '../components/DataTable';
import PrintButton from '../components/PrintButton';
import Sidebar from '../components/Sidebar';
import MerchantCard from '../components/MerchantCard';
import RangeFilter from '../components/RangeFilter'; // New import
import { Entry, Merchant } from '../types';
import { invoke } from '@tauri-apps/api/tauri';

const DATA_FILE = 'DiamondDiary/merchant_data.json';

const saveDataToFile = async (entries: Entry[], merchants: Merchant[]) => {
    if (window.__TAURI__) {
        try {
            await invoke('save_data', {
                path: DATA_FILE,
                contents: JSON.stringify({ entries, merchants }, null, 2),
            });
        } catch (e) {
            console.error('Error saving merchant data:', e);
        }
    } else {
        console.log('Saving to localStorage in dev mode:', { entries, merchants });
        localStorage.setItem(DATA_FILE, JSON.stringify({ entries, merchants }));
    }
};

const loadDataFromFile = async (): Promise<{ entries: Entry[]; merchants: Merchant[] }> => {
    if (window.__TAURI__) {
        try {
            const data = await invoke<string>('load_data', { path: DATA_FILE });
            return JSON.parse(data);
        } catch (e) {
            console.log('No existing merchant data file found, starting fresh.');
            return { entries: [], merchants: [] };
        }
    } else {
        const data = localStorage.getItem(DATA_FILE);
        return data ? JSON.parse(data) : { entries: [], merchants: [] };
    }
};

const MerchantPage: React.FC = () => {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]); // New state for filtered entries
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [merchantName, setMerchantName] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const { entries: loadedEntries, merchants: loadedMerchants } = await loadDataFromFile();
            setEntries(loadedEntries);
            setMerchants(loadedMerchants);
            setFilteredEntries(loadedEntries); // Initially show all
        };
        loadData();
    }, []);

    const addMerchant = () => {
        if (!merchantName.trim()) return;
        const id = Date.now().toString();
        const newMerchants = [...merchants, { id, name: merchantName.toUpperCase() }];
        setMerchants(newMerchants);
        setMerchantName('');
        saveDataToFile(entries, newMerchants);
    };

    const deleteMerchants = () => {
        const newMerchants = merchants.filter((m) => !selectedIds.includes(m.id));
        const newEntries = entries.filter((entry) => !selectedIds.includes(entry.merchantId || ''));
        setMerchants(newMerchants);
        setEntries(newEntries);
        setFilteredEntries(newEntries); // Update filtered entries
        setSelectedIds([]);
        if (selectedMerchant && selectedIds.includes(selectedMerchant.id)) {
            setSelectedMerchant(null);
        }
        saveDataToFile(newEntries, newMerchants);
    };

    const handleSubmit = (data: Entry) => {
        setEntries((prev) => {
            const newEntries = [...prev, { ...data, merchantId: selectedMerchant!.id }];
            saveDataToFile(newEntries, merchants);
            setFilteredEntries(newEntries); // Update filtered entries
            return newEntries;
        });
    };

    const handleUpdate = (updatedEntry: Entry) => {
        setEntries((prev) => {
            const newEntries = prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry));
            saveDataToFile(newEntries, merchants);
            setFilteredEntries(newEntries); // Update filtered entries
            return newEntries;
        });
    };

    const handleDelete = (id: string) => {
        setEntries((prev) => {
            const newEntries = prev.filter((entry) => entry.id !== id);
            saveDataToFile(newEntries, merchants);
            setFilteredEntries(newEntries); // Update filtered entries
            return newEntries;
        });
    };

    const merchantEntries = selectedMerchant
        ? filteredEntries.filter((entry) => entry.merchantId === selectedMerchant.id)
        : filteredEntries;

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
        <div className="merchant">
            <h1 className="page-title">MERCHANTS</h1>
            {!selectedMerchant ? (
                <div>
                    <div className="add-merchant">
                        <input
                            value={merchantName}
                            onChange={(e) => setMerchantName(e.target.value)}
                            placeholder="MERCHANT NAME"
                            className="merchant-input"
                        />
                        <button onClick={addMerchant} className="add-btn">ADD MERCHANT</button>
                    </div>
                    <button onClick={deleteMerchants} disabled={!selectedIds.length} className="delete-selected-btn">
                        DELETE SELECTED
                    </button>
                    <div className="merchant-list">
                        {merchants.map((merchant) => (
                            <MerchantCard
                                key={merchant.id}
                                merchant={merchant}
                                onView={setSelectedMerchant}
                                onSelect={(id) =>
                                    setSelectedIds((prev) =>
                                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                                    )
                                }
                                isSelected={selectedIds.includes(merchant.id)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="layout">
                    <Sidebar entries={merchantEntries} />
                    <div className="content">
                        <button onClick={() => setSelectedMerchant(null)} className="back-btn">BACK</button>
                        <h2 className="merchant-title">MERCHANT: {selectedMerchant.name}</h2>
                        <DataForm onSubmit={handleSubmit} />
                        <RangeFilter onFilter={handleFilter} /> {/* Add Range Filter */}
                        <PrintButton entries={merchantEntries} /> {/* Pass filtered entries */}
                        <div id="print-table">
                            <DataTable
                                entries={merchantEntries}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MerchantPage;