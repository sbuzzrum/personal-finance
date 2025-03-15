export interface Account {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment';
    balance: number;
    currency: string;
    created_at: string;
    user_id: string;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    user_id: string;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    category_id: string;
    details?: string;
    amount: number;
    account_id: string;
    user_id: string;
    created_at: string;
    tdate?: Date;
    sum: number;
    accounts?: Account[];
    categories?: Category[];
}

export interface FormMessage {
    type: 'required' | 'minumum' | 'maximum';
    message: string;
}

export interface Totalizer {
    id: string;
    name: string;
    description: string;
    user_id: string;
    created_at: string;
}

export interface Budget {
    id: string;
    name: string;
    amount: number;
    totalizer_id: string;
    category_id: string;
    user_id: string;
    created_at: string;
}
