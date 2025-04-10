export interface Transaction {
  id: string;
  userId: string;
  type: 'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
} 