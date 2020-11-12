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
      images: [{ path: "assets/guitar1.png" }, { path: "assets/guitar2.jpg" }],
      user: "Gilb1",
      rating: 4,
    },
    {
      title: "Guitar Amp",
      description: "This is a pretty awesome guitar amp!",
      condition: "Used",
      images: [{ path: "assets/amp1.jpg" }, { path: "assets/amp2.jpg" }],
      user: "Gilb1",
      rating: 4,
    },
    {
      title: "Another Guitar",
      description: "This is a great guitar!",
      condition: "Used",
      images: [{ path: "assets/guitar1.png" }, { path: "assets/guitar2.jpg" }],
      user: "Gilb1",
      rating: 4,
    },
  ];

  constructor() {}

  getProducts() {
    return [...this.products];
  }
}
