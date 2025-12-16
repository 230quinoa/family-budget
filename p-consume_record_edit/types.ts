
export interface TransactionFormData {
  date: string;
  time: string;
  merchant: string;
  category: string;
  amount: string;
  account: string;
  note: string;
  imageUrl: string;
}

export interface CategoryOption {
  value: string;
  label: string;
  icon: string;
}

export interface AccountOption {
  value: string;
  label: string;
}
