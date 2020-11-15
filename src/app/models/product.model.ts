export interface Product {
  id: number;
  title: string;
  description: string;
  condition: string;
  images: { path: string }[];
  user: string;
  rating: number;
}
