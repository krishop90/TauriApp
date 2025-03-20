import { useState, useRef } from 'react';
import { Entry } from '../types'; // Import shared type

export interface DataFormProps {
    onSubmit: (data: Entry) => void; // Updated to use Entry
}

const shapeOptions = ['EX', 'VG', 'GD', 'POOR'];

const DataForm: React.FC<DataFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState<Entry>({
        id: '',
        kapanNo: '',
        packetNo: '',
        roughWeight: '',
        polishWeight: '',
        rate: '',
        remark: '',
        shape: 'EX',
        cut: '',
        total: 0,
        issueDate: new Date().toISOString(), // Default value
    });
    const [customCuts, setCustomCuts] = useState<string[]>(['RD']);
    const [newCut, setNewCut] = useState('');
    const inputRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === 'roughWeight' || name === 'rate') {
                updated.total = parseFloat(updated.roughWeight || '0') * parseFloat(updated.rate || '0');
            }
            return updated;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextIndex = index + 1;
            if (nextIndex < inputRefs.current.length) {
                inputRefs.current[nextIndex]?.focus();
            } else {
                handleSubmit(e as any);
            }
        }
    };

    const addCustomCut = () => {
        if (newCut.trim() && !customCuts.includes(newCut)) {
            setCustomCuts((prev) => [...prev, newCut]);
            setNewCut('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const entry = { ...formData, id: Date.now().toString(), issueDate: new Date().toISOString() };
        onSubmit(entry);
        setFormData({
            id: '',
            kapanNo: '',
            packetNo: '',
            roughWeight: '',
            polishWeight: '',
            rate: '',
            remark: '',
            shape: 'EX',
            cut: '',
            total: 0,
            issueDate: new Date().toISOString(),
        });
        inputRefs.current[0]?.focus();
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            {['kapanNo', 'packetNo', 'roughWeight', 'polishWeight', 'rate', 'remark'].map((field, idx) => (
                <div key={field} className="input-group">
                    <label>{field.replace(/([A-Z])/g, ' $1').trim()}:</label>
                    <input
                        ref={(el) => (inputRefs.current[idx] = el)}
                        name={field}
                        value={formData[field as keyof Entry] || ''}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        placeholder={field}
                        type={field === 'roughWeight' || field === 'rate' ? 'number' : 'text'}
                        step="0.01"
                    />
                </div>
            ))}
            <div className="input-group">
                <label>SHAPE:</label>
                <select
                    ref={(el) => (inputRefs.current[6] = el)}
                    name="shape"
                    value={formData.shape || 'EX'}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 6)}
                >
                    {shapeOptions.map((shape) => <option key={shape} value={shape}>{shape}</option>)}
                </select>
            </div>
            <div className="input-group cut-group">
                <label>CUT:</label>
                <input
                    value={newCut}
                    onChange={(e) => setNewCut(e.target.value)}
                    placeholder="ADD NEW CUT"
                    onKeyDown={(e) => e.key === 'Enter' && addCustomCut()}
                    className="cut-input-field"
                />
                <select
                    ref={(el) => (inputRefs.current[7] = el)}
                    name="cut"
                    value={formData.cut || ''}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 7)}
                    className="cut-select-field"
                >
                    <option value="">SELECT CUT</option>
                    {customCuts.map((cut) => <option key={cut} value={cut}>{cut}</option>)}
                </select>
                <button type="button" onClick={addCustomCut} className="add-cut-btn">ADD</button>
            </div>
            <div className="form-footer">
                <button type="submit" className="submit-btn">ADD ENTRY</button>
                <div className="total-display">TOTAL: {formData.total?.toFixed(2) || '0.00'}</div>
            </div>
        </form>
    );
};

export default DataForm;