import { useState } from 'react';
import '../index.css';


interface RangeFilterProps {
    onFilter: (start: number | null, end: number | null) => void;
}

const RangeFilter: React.FC<RangeFilterProps> = ({ onFilter }) => {
    const [startRange, setStartRange] = useState<string>('');
    const [endRange, setEndRange] = useState<string>('');

    const handleFilter = () => {
        const start = startRange ? parseFloat(startRange) : null;
        const end = endRange ? parseFloat(endRange) : null;
        onFilter(start, end);
    };

    const handleClear = () => {
        setStartRange('');
        setEndRange('');
        onFilter(null, null);
    };

    return (
        <div className="range-filter">
            <input
                type="number"
                step="0.01"
                value={startRange}
                onChange={(e) => setStartRange(e.target.value)}
                placeholder="Start Range (e.g., 1.10)"
            />
            <input
                type="number"
                step="0.01"
                value={endRange}
                onChange={(e) => setEndRange(e.target.value)}
                placeholder="End Range (e.g., 1.20)"
            />
            <button onClick={handleFilter}>Filter</button>
            <button onClick={handleClear}>Clear</button>
        </div>
    );
};

export default RangeFilter;