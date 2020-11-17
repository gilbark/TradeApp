import { ProductsService } from "./../../services/products.service";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "src/app/models/product.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.scss"],
})
export class OfferComponent implements OnInit, OnDestroy {
  products: Product[];
  productsSubject: Subscription;
  constructor(
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.productService.getProducts();

    this.productsSubject = this.productService
      .getProductsSubject()
      .subscribe((products: Product[]) => {
        return (this.products = products.filter(
          (product) => product.owner === "Gilb1"
        ));
      });
  }

  ngOnDestroy() {
    this.productsSubject.unsubscribe();
  }
}
