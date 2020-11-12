import { Injectable } from "@angular/core";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private products: Product[] = [
    {
      title: "Guitar",
      description: "This is a pretty awesome guitar!",
      condition: "Used",
      images: ["assets/logo.png"],
      user: "Gilb1",
      rating: 4,
    },
    {
      title: "Guitar Amp",
      description: "This is a pretty awesome guitar amp!",
      condition: "Used",
      images: ["assets/logo.png"],
      user: "Gilb1",
      rating: 4,
    },
    {
      title: "Guitar string",
      description: "This are great guitar strings!",
      condition: "Used",
      images: ["assets/logo.png"],
      user: "Gilb1",
      rating: 4,
    },
  ];

  constructor() {}

  getProducts() {
    return [...this.products];
  }
}
