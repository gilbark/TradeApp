export interface Product {
  id: string;
  title: string;
  description: string;
  condition: string;
  images: string[] | File[];
  tags?: string[];
  owner: {
    id: string;
    username?: string;
  };
  rating?: number; // TODO: Remove when getting user by authentication
}
