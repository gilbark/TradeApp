export interface Product {
  id: string;
  title: string;
  description: string;
  condition: string;
  images: string[] | File[];
  tags?: string[];
  owner: string;
  rating?: number; // TODO: Remove when getting user by authentication
}
