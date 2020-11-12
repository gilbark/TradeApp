export interface Product {
  title: string;
  description: string;
  condition: string;
  images: { path: string }[];
  user: string;
  rating: number;
}
