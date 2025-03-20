import { useState } from 'react';
import DataForm from '../components/DataForm';
import DataTable from '../components/DataTable';
import PrintButton from '../components/PrintButton';
import Sidebar from '../components/Sidebar';
import MerchantCard from '../components/MerchantCard';
import { Entry, Merchant } from '../types';

const MerchantPage: React.FC = () => {
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [merchantName, setMerchantName] = useState('');

    const addMerchant = () => {
        if (!merchantName.trim()) return;
        const id = Date.now().toString();
        setMerchants([...merchants, { id, name: merchantName.toUpperCase() }]);
        setMerchantName('');
    };

    const deleteMerchants = () => {
        setMerchants(merchants.filter((m) => !selectedIds.includes(m.id)));
        setSelectedIds([]);
        if (selectedMerchant && selectedIds.includes(selectedMerchant.id)) {
            setSelectedMerchant(null);
            setEntries((prev) => prev.filter((entry) => !selectedIds.includes(entry.merchantId || '')));
        }
    };

    const handleSubmit = (data: Entry) => {
        setEntries((prev) => [...prev, { ...data, merchantId: selectedMerchant!.id }]);
    };

    const handleUpdate = (updatedEntry: Entry) => {
        setEntries((prev) => prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    };

    const handleDelete = (id: string) => {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
    };

    // Filter entries for the selected merchant
    const merchantEntries = selectedMerchant
        ? entries.filter((entry) => entry.merchantId === selectedMerchant.id)
        : entries;

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
                        <PrintButton />
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