

export interface Transaction {
  id: string;
  date: string;
  time: string;
  merchant: string;
  amount: string;
  category: string;
  account: string;
  note: string;
  image: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  category: string;
  link: string;
  image: string;
}

