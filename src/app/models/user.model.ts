export interface User {
  id: string;
  email: string;
  username: string;
  address: {
    country: string;
    city: string;
    address: string;
  };
  rating: {
    value: number;
    arrOfRatings: number;
  };
}
