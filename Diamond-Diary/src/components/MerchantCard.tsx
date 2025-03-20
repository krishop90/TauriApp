import { Merchant } from '../types'; // Import shared type

interface MerchantCardProps {
    merchant: Merchant;
    onView: (merchant: Merchant) => void;
    onSelect: (id: string) => void;
    isSelected: boolean;
}

const MerchantCard: React.FC<MerchantCardProps> = ({ merchant, onView, onSelect, isSelected }) => (
    <div className="merchant-card">
        <input type="checkbox" checked={isSelected} onChange={() => onSelect(merchant.id)} />
        <span>{merchant.name}</span>
        <button onClick={() => onView(merchant)}>VIEW</button>
    </div>
);

export default MerchantCard;