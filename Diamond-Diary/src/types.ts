export interface Entry {
    id: string;
    kapanNo?: string;
    packetNo?: string;
    roughWeight?: string;
    polishWeight?: string;
    rate?: string;
    depositDate?: string;
    remark?: string;
    shape?: string;
    cut?: string;
    total?: number;
    issueDate: string; // Made required to match DataTable
    merchantId?: string; // For Merchant.tsx
}

export interface Merchant {
    id: string;
    name: string;
}