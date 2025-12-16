

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tag: string;
  validUntil: string;
  usedCount: string;
  isFavorited: boolean;
  image: string;
  link: string;
}

export interface RecommendationDetail {
  title: string;
  description: string;
  category: string;
  validUntil: string;
  link: string;
  image: string;
}

