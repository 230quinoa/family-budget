

export interface Transaction {
  id: string;
  date: string;
  time: string;
  merchant: string;
  category: string;
  categoryIcon: string;
  amount: number;
  account: string;
  note: string;
  imageUrl: string;
}

export interface FilterState {
  searchTerm: string;
  category: string;
  account: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
}

