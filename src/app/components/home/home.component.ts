import { ProductsService } from "./../../services/products.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  inMyProducts = false;
  modalOpen = false;
  userIsAuthenticated = false;
  userId: string;
  private productsSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        // Validate user auth status
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserID();
      });

    // Get all products from DB
    this.productService.getProducts();

    this.productsSubscription = this.productService
      .getProductsSubject()
      .subscribe((products) => {
        this.products = products;
      });

    // Filter products by user
    this.checkAndFilter(this.products);
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
  // Filter products by user
  checkAndFilter(products: Product[]) {
    if (this.router.url === "/my-products") {
      this.products = products.filter(
        (product) => product.owner.id === this.userId
      );
      this.inMyProducts = true;
    } else {
      this.products = products;
      this.inMyProducts = false;
    }
  }
  
  changeModalStatus(modalStatus: any) {
    this.modalOpen = modalStatus;
  }
}
