import { Offer } from "./offer.model";
import { User } from "./user.model";
export interface Product {
  id: string;
  title: string;
  description: string;
  condition: string;
  images: string[] | File[];
  tags?: string[];
  owner: User;
  offers?: Offer[];
}
