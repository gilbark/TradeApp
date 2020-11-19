import { TradeService } from "./../../services/trade.service";
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
  offers: string[];
  private productsSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private authService: AuthService,
    private tradeService: TradeService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserID();

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
        if (this.router.url === "/my-products") {
          this.products = products.filter((product) => {
            return product.owner._id === this.userId;
          });
          this.inMyProducts = true;
          this.tradeService.getMyOffers();
        } else {
          this.products = products;
          this.inMyProducts = false;
        }
      });
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }

  changeModalStatus(modalStatus: any) {
    this.modalOpen = modalStatus;
  }
}
