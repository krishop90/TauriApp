import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Entry } from '../types'; // Import shared type

export interface DataTableProps {
    entries: Entry[];
    onUpdate: (updatedEntry: Entry) => void;
    onDelete: (id: string) => void;
}

const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
};

const DataTable: React.FC<DataTableProps> = ({ entries, onUpdate, onDelete }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Entry | null>(null);

    const startEditing = (entry: Entry) => {
        setEditingId(entry.id);
        setEditData({ ...entry });
    };

    const handleEditChange = (field: keyof Entry, value: string | Date | null) => {
        if (!editData) return;
        setEditData((prev) => {
            if (!prev) return null;
            const updated = { ...prev, [field]: value };
            if (field === 'roughWeight' || field === 'rate') {
                updated.total = parseFloat(updated.roughWeight || '0') * parseFloat(updated.rate || '0');
            }
            if (field === 'depositDate' && value instanceof Date) {
                updated.depositDate = formatDate(value);
            } else if (field === 'depositDate' && value === null) {
                updated.depositDate = '';
            }
            return updated;
        });
    };

    const saveEdit = () => {
        if (editData) {
            onUpdate(editData);
            setEditingId(null);
            setEditData(null);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData(null);
    };

    const totals = entries.reduce(
        (acc, row) => ({
            roughWeight: acc.roughWeight + parseFloat(row.roughWeight || '0'),
            total: acc.total + (row.total || 0),
        }),
        { roughWeight: 0, total: 0 }
    );

    return (
        <div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>SR NO.</th><th>ISSUE DATE</th><th>KAPAN NO.</th><th>PACKET NO.</th><th>ROUGH WEIGHT</th>
                        <th>CUT</th><th>POLISH WEIGHT</th><th>SHAPE</th><th>RATE</th><th>DEPOSIT DATE</th>
                        <th>TOTAL</th><th>REMARK</th><th className="no-print">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((row, idx) => (
                        <tr key={row.id}>
                            {editingId === row.id ? (
                                <>
                                    <td>{idx + 1}</td>
                                    <td>{formatDate(row.issueDate)}</td>
                                    <td><input value={editData?.kapanNo || ''} onChange={(e) => handleEditChange('kapanNo', e.target.value)} /></td>
                                    <td><input value={editData?.packetNo || ''} onChange={(e) => handleEditChange('packetNo', e.target.value)} /></td>
                                    <td><input type="number" value={editData?.roughWeight || ''} onChange={(e) => handleEditChange('roughWeight', e.target.value)} step="0.01" /></td>
                                    <td><input value={editData?.cut || ''} onChange={(e) => handleEditChange('cut', e.target.value)} /></td>
                                    <td><input type="number" value={editData?.polishWeight || ''} onChange={(e) => handleEditChange('polishWeight', e.target.value)} step="0.01" /></td>
                                    <td>
                                        <select value={editData?.shape || ''} onChange={(e) => handleEditChange('shape', e.target.value)}>
                                            <option value="EX">EX</option><option value="VG">VG</option>
                                            <option value="GD">GD</option><option value="POOR">POOR</option>
                                        </select>
                                    </td>
                                    <td><input type="number" value={editData?.rate || ''} onChange={(e) => handleEditChange('rate', e.target.value)} step="0.01" /></td>
                                    <td>
                                        <DatePicker
                                            selected={editData?.depositDate ? new Date(editData.depositDate.split('-').reverse().join('-')) : null}
                                            onChange={(date: Date | null) => handleEditChange('depositDate', date)}
                                            dateFormat="dd-MM-yyyy"
                                            className="date-picker"
                                        />
                                    </td>
                                    <td>{editData?.total?.toFixed(2) || '0.00'}</td>
                                    <td><input value={editData?.remark || ''} onChange={(e) => handleEditChange('remark', e.target.value)} /></td>
                                    <td className="no-print">
                                        <button className="save-btn" onClick={saveEdit}>SAVE</button>
                                        <button className="cancel-btn" onClick={cancelEdit}>CANCEL</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{idx + 1}</td>
                                    <td>{formatDate(row.issueDate)}</td>
                                    <td>{row.kapanNo || '-'}</td><td>{row.packetNo || '-'}</td><td>{row.roughWeight || '-'}</td>
                                    <td>{row.cut || '-'}</td><td>{row.polishWeight || '-'}</td><td>{row.shape || '-'}</td>
                                    <td>{row.rate || '-'}</td><td>{row.depositDate || '-'}</td>
                                    <td>{row.total?.toFixed(2) || '0.00'}</td><td>{row.remark || '-'}</td>
                                    <td className="no-print">
                                        <div className="action-buttons">
                                            <button className="edit-btn" onClick={() => startEditing(row)}>E</button>
                                            <button className="delete-btn" onClick={() => onDelete(row.id)}>D</button>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="totals">
                <span>ROUGH WEIGHT TOTAL: {totals.roughWeight.toFixed(3)}</span>
                <span>GRAND TOTAL: {totals.total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default DataTable;