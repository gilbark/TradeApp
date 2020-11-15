import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private products: Product[] = [
    {
      title: "Guitar",
      description:
        "This is a pretty awesome guitar! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
      user: "Danny",
      rating: 3,
    },
  ];

  public modalStatusSubject = new Subject<boolean>();

  constructor() {}

  getProducts() {
    return [...this.products];
  }

  getModalStatus() {
    return this.modalStatusSubject.asObservable();
  }

  modalStatusChanged(status: boolean) {
    this.modalStatusSubject.next(status);
  }
}
