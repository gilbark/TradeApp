import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      title: "Guitar",
      description:
        "This is a pretty awesome guitar! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      condition: "Used",
      images: [{ path: "assets/guitar1.png" }, { path: "assets/guitar2.jpg" }],
      user: "Gilb1",
      rating: 4,
    },
    {
      id: 2,
      title: "Guitar Amp",
      description: "This is a pretty awesome guitar amp!",
      condition: "Used",
      images: [{ path: "assets/amp1.jpg" }, { path: "assets/amp2.jpg" }],
      user: "Gilb1",
      rating: 4,
    },
    {
      id: 3,
      title: "Another Guitar",
      description: "This is a great guitar!",
      condition: "Used",
      images: [{ path: "assets/guitar1.png" }, { path: "assets/guitar2.jpg" }],
      user: "Danny",
      rating: 3,
    },
  ];

  private productsChangedSubject = new Subject<Product[]>();

  constructor() {}

  getProducts() {
    return [...this.products];
  }

  getProductsSubject() {
    return this.productsChangedSubject.asObservable();
  }

  getLastId() {
    return this.products.length;
  }

  getProduct(id: number) {
    return this.products[id - 1];
  }

  updateProduct(id: number, product: Product) {
    this.products[id - 1] = product;
    this.productsChangedSubject.next([...this.products]);
  }

  addProduct(product: Product) {
    this.products.push(product);
    this.productsChangedSubject.next([...this.products]);
  }
}
