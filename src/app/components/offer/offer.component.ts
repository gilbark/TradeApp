import { AuthService } from "src/app/services/auth.service";
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
  private userId: string;
  private authStatusSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.productService.getProducts();
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {});
    this.userId = this.authService.getUserID();
    
    this.productsSubject = this.productService
      .getProductsSubject()
      .subscribe((products: Product[]) => {
        return (this.products = products.filter(
          (product) => product.owner.id === this.userId
        ));
      });
  }

  ngOnDestroy() {
    this.productsSubject.unsubscribe();
  }
}
