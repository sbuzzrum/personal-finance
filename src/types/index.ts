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
}
