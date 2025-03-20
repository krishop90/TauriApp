import { useState } from 'react';
import DataForm from '../components/DataForm';
import DataTable from '../components/DataTable';
import PrintButton from '../components/PrintButton';
import Sidebar from '../components/Sidebar';
import { Entry } from '../types'; // Import shared type

const Home: React.FC = () => {
    const [entries, setEntries] = useState<Entry[]>([]);

    const handleSubmit = (data: Entry) => {
        setEntries((prev) => [...prev, data]);
    };

    const handleUpdate = (updatedEntry: Entry) => {
        setEntries((prev) => prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    };

    const handleDelete = (id: string) => {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
    };

    return (
        <div className="home">
            <h1 className="page-title">DIAMOND DIARY</h1>
            <div className="layout">
                <Sidebar entries={entries} />
                <div className="content">
                    <DataForm onSubmit={handleSubmit} />
                    <PrintButton />
                    <div id="print-table">
                        <DataTable entries={entries} onUpdate={handleUpdate} onDelete={handleDelete} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;